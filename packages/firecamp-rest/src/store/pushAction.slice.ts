import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import {
  EAuthTypes,
  ERequestTypes,
  TId,
  ERestBodyTypes,
  IRest,
} from '@firecamp/types';
import { _array, _object } from '@firecamp/utils';

import {
  EReqChangeRootKeys,
  EReqChangeScriptsKeys,
  EReqChangeMetaKeys,
  EReqChangeUrlKeys,
  IRestClientRequest,
} from '../types';
import { normalizePushPayload } from '../services/request-service';

/**
 * @reference: https://github.com/firecamp-io/firecamp-collaboration-json-examples/blob/main/push/v3/requests/rest/rest.u.json
 */

const emptyPushAction = {
  _root: [],
  meta: [],
  url: [],
  scripts: [],
  auth: [],
  _meta: [],
  body: [],
  _removed: {
    body: [],
    auth: [],
  },
};

interface IPushAction {
  _root?: Array<EReqChangeRootKeys>;
  meta?: Array<EReqChangeMetaKeys>;
  url?: Array<EReqChangeUrlKeys>;
  scripts?: Array<EReqChangeScriptsKeys>;
  auth?: Array<EAuthTypes>;
  _meta?: Array<string>;
  body?: Array<ERestBodyTypes>;
  _removed?: {
    body?: Array<ERestBodyTypes>;
    auth?: Array<EAuthTypes>;
  };
}

interface IPushPayload extends Partial<IRest> {
  _action?: {
    type: string;
    item_id: TId;
    item_type: 'R';
    request_type: ERequestTypes.Rest;
    collectionId: TId;
    workspaceId: TId;
    keys: IPushAction;
  };
}

interface IPushActionSlice {
  pushAction?: IPushAction;
  prepareRequestInsertPushPayload: () => Promise<IPushPayload>;
  prepareRequestUpdatePushPayload: () => Promise<IPushPayload>;
  setPushActionEmpty: () => void;
}

const createPushActionSlice = (set, get): IPushActionSlice => ({
  pushAction: _cloneDeep(emptyPushAction),

  prepareRequestInsertPushPayload: async (): Promise<IPushPayload> => {
    let request: IRestClientRequest = get().request;
    let pushPayload: IPushPayload = {};

    // console.log({ request });

    let requestToPush = await normalizePushPayload(request);

    pushPayload = { ...requestToPush };
    pushPayload._action = {
      type: 'i',
      item_id: request.__ref.id,
      item_type: 'R', // TODO: add type here
      request_type: ERequestTypes.Rest,
      collectionId: '',
      keys: {},
      workspaceId: '',
    };
    return Promise.resolve(pushPayload);
  },

  prepareRequestUpdatePushPayload: async (): Promise<IPushPayload> => {
    let pushAction: Partial<IPushAction> = get().pushAction;
    pushAction = _cleanDeep(pushAction);
    // console.log({ pushAction });

    if (!_object.size(pushAction)) return Promise.reject('Empty push action');

    let request: IRestClientRequest = get().request;

    let updatedRequest = {};

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

    let pushPayload: IPushPayload = {};
    // console.log({ updatedRequest });

    let requestToPush = await normalizePushPayload(
      updatedRequest,
      pushAction._removed
    );

    pushPayload = { ...requestToPush };

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
      request_type: ERequestTypes.Rest,
      collectionId: request.__ref.collectionId,
      workspaceId: '',
      keys: pushAction,
    };
    // console.log({ updatedRequest });

    return Promise.resolve(pushPayload);
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
