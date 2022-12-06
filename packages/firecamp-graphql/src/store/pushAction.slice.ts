import { ERequestTypes, IGraphQL, IUrl, TId } from '@firecamp/types';
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
    requestType: ERequestTypes.GraphQL;
    collectionId: TId;
    workspaceId: TId;
    keys: IPushAction;
  };
}

interface IPushAction {
  _root?: Array<EPushAction_rootKeys>;
  __meta?: Array<EPushActionMetaKeys>;
  url?: Array<EPushActionUrlKeys>;
  __ref?: Array<EPushAction_metaKeys>;
  _removed?: {};
}

interface IPushActionSlice {
  pushAction?: IPushAction;

  initializePushAction: (pushAction: IPushAction) => void;

  prepareUrlPushAction?: (lastUrl: IUrl, url: IUrl) => void;
  prepareRootPushAction?: (lastRequest, request) => void;
  prepareMetaPushAction?: (lastMeta, __meta) => void;

  prepareRequestInsertPushPayload: () => Promise<IPushPayload>;
  prepareRequestUpdatePushPayload: () => Promise<IPushPayload>;
  prepareRequestUpdatePushAction: (
    request: Partial<IGraphQL>
  ) => Promise<Partial<IPushAction>>;
  setPushActionEmpty: () => void;
}

export const emptyPushAction = {
  _root: [],
  __meta: [],
  url: [],

  __ref: [],
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

  prepareMetaPushAction: (lastMeta, __meta) => {
    // Return if request is not saved
    if (!get()?.runtime?.isRequestSaved) return;

    let metaPushAction = pushActionS.prepareMetaPushAction(
      lastMeta,
      __meta,
      get().pushAction?.__meta
    );

    set((s) => ({
      ...s,
      pushAction: {
        ...s.pushAction,
        __meta: metaPushAction,
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
      requestType: ERequestTypes.GraphQL,
      collectionId: '',
      keys: {},
      workspaceId: '',
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

        // handle __meta
        case '__meta':
          pushAction['__meta'] = pushActionS.prepareMetaPushAction(
            lastRequest.__meta,
            request.__meta
            // get().pushAction?.__meta
          );

          break;

        // handle __ref
        /* case '__ref':
          pushAction['__ref'] = pushActionS.prepare_MetaPushAction(
            lastRequest.__ref,
            request.__ref
            // get().pushAction?.__ref
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
