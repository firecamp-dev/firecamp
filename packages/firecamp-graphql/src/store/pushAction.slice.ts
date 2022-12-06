import {
  ERequestTypes,
  IGraphQL,
  IUrl,
  TId,
} from '@firecamp/types';
import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { _object } from '@firecamp/utils';

import pushActionS from '../services/push-actions';
import {
  EPushAction_rootKeys,
  EPushActionMetaKeys,
  EPushAction_metaKeys,
  EPushActionUrlKeys,
} from '../types';

interface IPushPayload extends Partial<IGraphQL> {
  _action?: {
    type: string;
    item_id: TId;
    item_type: 'R';
    request_type: ERequestTypes.GraphQL;
    collection_id: TId;
    workspace_id: TId;
    keys: IPushAction;
  };
}

interface IPushAction {
  _root?: Array<EPushAction_rootKeys>;
  meta?: Array<EPushActionMetaKeys>;
  url?: Array<EPushActionUrlKeys>;
  _meta?: Array<EPushAction_metaKeys>;
  _removed?: {};
}

interface IPushActionSlice {
  pushAction?: IPushAction;

  initializePushAction: (pushAction: IPushAction) => void;

  prepareUrlPushAction?: (lastUrl: IUrl, url: IUrl) => void;
  prepareRootPushAction?: (lastRequest, request) => void;
  prepareMetaPushAction?: (lastMeta, meta) => void;

  prepareRequestInsertPushPayload: () => Promise<IPushPayload>;
  prepareRequestUpdatePushPayload: () => Promise<IPushPayload>;
  prepareRequestUpdatePushAction: (
    request: Partial<IGraphQL>
  ) => Promise<Partial<IPushAction>>;
  setPushActionEmpty: () => void;
}

export const emptyPushAction = {
  _root: [],
  meta: [],
  url: [],

  _meta: [],
  _removed: {
    body: [],
    auth: [],
  },
};

const createPushActionSlice = (set, get): IPushActionSlice => ({
  pushAction: _cloneDeep(emptyPushAction),

  initializePushAction: (pushAction: IPushAction) => {
    set({ pushAction });
  },

  prepareUrlPushAction: (lastUrl, url) => {
    const state = get();
    /** return if request is not saved */
    if (!state.runtime?.isRequestSaved) return;

    const urlPushAction = pushActionS.prepareUrlPushAction(
      lastUrl,
      url,
      state.pushAction?.url
    );

    // console.log({ urlPushAction });

    set((s) => ({
      pushAction: {
        ...s.pushAction,
        url: urlPushAction,
      },
    }));
  },

  prepareRootPushAction: (lastRequest, request) => {
    // Return if request is not saved
    if (!get()?.runtime?.isRequestSaved) return;

    let rootPushAction = pushActionS.prepareRootPushAction(
      lastRequest,
      request,
      get().pushAction?._root
    );

    // console.log({rootPushAction});

    set((s) => ({
      ...s,
      pushAction: {
        ...s.pushAction,
        _root: rootPushAction,
      },
    }));
  },

  prepareMetaPushAction: (lastMeta, meta) => {
    // Return if request is not saved
    if (!get()?.runtime?.isRequestSaved) return;

    let metaPushAction = pushActionS.prepareMetaPushAction(
      lastMeta,
      meta,
      get().pushAction?.meta
    );

    set((s) => ({
      ...s,
      pushAction: {
        ...s.pushAction,
        meta: metaPushAction,
      },
    }));
  },

  prepareRequestInsertPushPayload: (): Promise<IPushPayload> => {
    let request: IGraphQL = get()?.request;
    let pushPayload: IPushPayload = {};

    pushPayload = { ...request };

    pushPayload._action = {
      type: 'i',
      item_id: request.__ref.id,
      item_type: 'R', // TODO: add type here
      request_type: ERequestTypes.GraphQL,
      collection_id: '',
      keys: {},
      workspace_id: '',
    };
    return Promise.resolve(pushPayload);
  },

  prepareRequestUpdatePushPayload: (): Promise<IPushPayload> => {
    let pushAction: Partial<IPushAction> = _cleanDeep(get().pushAction);

    if (!_object.size(pushAction)) return Promise.reject('Empty push action');

    let request: IGraphQL = get().request;
    let updatedRequest: IPushPayload = {};

    // console.log({ pushAction, request });
    for (let key in pushAction) {
      if (key === '_root') {
        updatedRequest = {
          ...updatedRequest,
          ..._object.pick(request, pushAction[key]),
        };
      } else if (key !== '_removed' && key in request) {
        updatedRequest[key] = _object.pick(request[key], pushAction[key]);
      }
    }

    let pushPayload: IPushPayload = updatedRequest;

    pushPayload.__ref = {
      ...pushPayload.__ref,
      id: request.__ref.id,
      collectionId: request.__ref.collectionId,
      folderId: request.__ref.folderId || '',
    };

    pushPayload._action = {
      type: 'u',
      item_id: request.__ref.id,
      item_type: 'R', // TODO: add type here
      requestType: ERequestTypes.GraphQL,
      collectionId: request.__ref.collectionId,
      workspaceId: '',
      keys: pushAction,
    };
    // console.log({ updatedRequest });

    return Promise.resolve(updatedRequest);
  },

  prepareRequestUpdatePushAction: (request: Partial<IGraphQL>) => {
    let pushAction: Partial<IPushAction> = {};
    let lastRequest: IGraphQL = get()?.last.request;

    console.log('prepareRequestUpdatePushAction: ', { lastRequest, request });

    for (let key in request) {
      switch (key) {
        // handle _root
        case EPushAction_rootKeys.headers:
        case EPushAction_rootKeys.method:
          pushAction['_root'] = pushActionS.prepareRootPushAction(
            { [key]: lastRequest[key] },
            { [key]: request[key] }
            // get().pushAction?._root
          );
          break;

        // handle meta
        case 'meta':
          pushAction['__meta'] = pushActionS.prepareMetaPushAction(
            lastRequest.__meta,
            request.__meta
            // get().pushAction?.meta
          );

          break;

        // handle _meta
        /* case '_meta':
          pushAction['_meta'] = pushActionS.prepare_MetaPushAction(
            lastRequest._meta,
            request._meta
            // get().pushAction?._meta
          );
          break; */

        // handle url
        case 'url':
          pushAction['url'] = pushActionS.prepareUrlPushAction(
            lastRequest.url,
            request.url
            // get().pushAction?.url
          );
          break;

        default:
        // do nothing
      }
    }

    console.log({ prepareRequestUpdatePushAction: pushAction });

    return Promise.resolve(pushAction);
  },

  setPushActionEmpty: () => {
    // console.log({ emptyPushAction });

    set((s) => ({
      ...s,
      pushAction: _cloneDeep(emptyPushAction),
    }));
  },
});
export { createPushActionSlice, IPushActionSlice, IPushAction, IPushPayload };
