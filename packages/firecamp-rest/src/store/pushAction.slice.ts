import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import {
  IUrl,
  EAuthTypes,
  ERequestTypes,
  TId,
  ERestBodyTypes,
  IRest,
} from '@firecamp/types';
import { _array, _object } from '@firecamp/utils';
import PushActionService from '../services/push-actions';
import { TAuth } from './index';

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
  prepareAuthPushAction?: (
    lastAuth: TAuth,
    auth: TAuth,
    authType: EAuthTypes
  ) => void;
  prepareActiveBodyTypePushAction?: (lastBodyType, bodyType) => void;
  prepareBodyPushAction?: (lastBody, body, bodyType: string) => void;
  prepareRequestInsertPushPayload: () => Promise<IPushPayload>;
  prepareRequestUpdatePushPayload: () => Promise<IPushPayload>;
  prepareRequestUpdatePushAction: (
    request: Partial<IRestClientRequest>
  ) => Promise<Partial<IPushAction>>;
  setPushActionEmpty: () => void;
}

const createPushActionSlice = (set, get): IPushActionSlice => ({
  pushAction: _cloneDeep(emptyPushAction),

  prepareAuthPushAction: (
    lastAuth: TAuth,
    auth: TAuth,
    authType: EAuthTypes
  ) => {
    // Return if request is not saved
    if (!get()?.runtime?.isRequestSaved) return;

    let authPushAction = PushActionService.prepareAuthPushAction(
      lastAuth,
      auth,
      authType,
      {
        auth: get().pushAction?.auth || [],
        _removed: get().pushAction?._removed,
      }
    );

    set((s) => ({
      ...s,
      pushAction: {
        ...s.pushAction,
        auth: authPushAction.auth,
        _removed: {
          ...s.pushAction._removed,
          auth: authPushAction._removed.auth,
        },
      },
    }));
  },

  prepareBodyPushAction: (lastBody, body, bodyType: ERestBodyTypes) => {
    // Return if request is not saved
    if (!get()?.runtime?.isRequestSaved) return;

    let bodyPushAction = PushActionService.prepareBodyPushAction(
      lastBody,
      body,
      bodyType,
      {
        body: get().pushAction?.body || [],
        _removed: get().pushAction?._removed,
      }
    );

    set((s) => ({
      ...s,
      pushAction: {
        ...s.pushAction,
        body: bodyPushAction.body,
        _removed: {
          ...s.pushAction._removed,
          body: bodyPushAction._removed.body,
        },
      },
    }));
  },

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

  prepareRequestUpdatePushAction: (
    request: Partial<IRestClientRequest>
  ): Promise<Partial<IPushAction>> => {
    let pushAction: Partial<IPushAction> = {};
    let lastRequest: IRestClientRequest = get()?.last.request;

    // console.log('prepareRequestUpdatePushAction: ', { lastRequest, request });

    for (let key in request) {
      switch (key) {
        // handle auth
        case 'auth':
          for (let authType in request.auth) {
            let authPushAction = PushActionService.prepareAuthPushAction(
              lastRequest.auth[authType],
              request.auth[authType],
              authType as EAuthTypes
              /* {
                auth: get().pushAction?.auth || [],
                _removed: get().pushAction?._removed,
              } */
            );

            pushAction = _object.mergeDeep(
              _cloneDeep(pushAction),
              authPushAction
            );
          }
          break;

          break;

        // handle body
        case 'body':
          for (let bodyType in request.body) {
            let bodyPushAction = PushActionService.prepareBodyPushAction(
              lastRequest.body[bodyType],
              request.body[bodyType],
              bodyType as ERestBodyTypes
              /* {
                body: get().pushAction?.body || [],
                _removed: get().pushAction?._removed,
              } */
            );
            pushAction = _object.mergeDeep(
              _cloneDeep(pushAction),
              bodyPushAction
            );
          }
          break;
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

export {
  createPushActionSlice,
  IPushActionSlice,
  IPushAction,
  IPushPayload,
  emptyPushAction,
};
