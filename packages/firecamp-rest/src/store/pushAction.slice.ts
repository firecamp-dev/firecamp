import {
  IUrl,
  EAuthTypes,
  ERequestTypes,
  TId,
  EPushActionType,
  ERestBodyTypes,
  IRest,
} from '@firecamp/types';
import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';

import PushActionService from '../services/push-actions';
import { TAuth } from './index';

import {
  EPushAction_rootKeys,
  EPushActionScriptsKeys,
  EPushActionMetaKeys,
  EPushAction_metaKeys,
  EPushActionUrlKeys,
  IRestClientRequest,
} from '../types';
import { _array, _object } from '@firecamp/utils';
import { normalizePushPaylaod } from '../services/rest-service';

/**
 * Referance: https://github.com/firecamp-io/firecamp-collaboration-json-examples/blob/main/push/v3/requests/rest/rest.u.json
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
  _root?: Array<EPushAction_rootKeys>;
  meta?: Array<EPushActionMetaKeys>;
  url?: Array<EPushActionUrlKeys>;
  scripts?: Array<EPushActionScriptsKeys>;
  auth?: Array<EAuthTypes>;
  _meta?: Array<EPushAction_metaKeys>;
  body?: Array<ERestBodyTypes>;
  _removed?: {
    body?: Array<ERestBodyTypes>;
    auth?: Array<EAuthTypes>;
  };
}

interface IPushPayload extends Partial<IRest> {
  _action?: {
    type: EPushActionType;
    item_id: TId;
    item_type: 'R';
    request_type: ERequestTypes.Rest;
    collection_id: TId;
    workspace_id: TId;
    keys: IPushAction;
  };
}

interface IPushActionSlice {
  pushAction?: IPushAction;

  initializePushAction: (pushAction: IPushAction) => void;
  prepareUrlPushAction?: (lastUrl: IUrl, url: IUrl) => void;
  prepareRootPushAction?: (lastRequest, request) => void;
  prepareScriptsPushAction?: (lastScripts, scripts) => void;
  prepareAuthPushAction?: (
    lastAuth: TAuth,
    auth: TAuth,
    authType: EAuthTypes
  ) => void;
  prepareMetaPushAction?: (lastMeta, meta) => void;
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

  initializePushAction: (pushAction: IPushAction) => {
    set((s) => ({
      ...s,
      pushAction,
    }));
  },

  prepareUrlPushAction: (lastUrl, url) => {
    // Return if request is not saved
    if (!get()?.runtime?.isRequestSaved) return;

    let urlPushAction = PushActionService.prepareUrlPushAction(
      lastUrl,
      url,
      get().pushAction?.url
    );

    // console.log({ urlPushAction });

    set((s) => ({
      ...s,
      pushAction: {
        ...s.pushAction,
        url: urlPushAction,
      },
    }));
  },

  prepareRootPushAction: (lastRequest, request) => {
    // Return if request is not saved
    if (!get()?.runtime?.isRequestSaved) return;

    let rootPushAction = PushActionService.prepareRootPushAction(
      lastRequest,
      request,
      get().pushAction?._root
    );

    set((s) => ({
      ...s,
      pushAction: {
        ...s.pushAction,
        _root: rootPushAction,
      },
    }));
  },

  prepareScriptsPushAction: (lastScripts, scripts) => {
    // Return if request is not saved
    if (!get()?.runtime?.isRequestSaved) return;

    let scriptsPushAction = PushActionService.prepareScriptsPushAction(
      lastScripts,
      scripts,
      get().pushAction?.scripts
    );

    // console.log({ 1: scripts, 2: lastScripts });

    set((s) => ({
      ...s,
      pushAction: {
        ...s.pushAction,
        scripts: scriptsPushAction,
      },
    }));
  },

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

  prepareMetaPushAction: (lastMeta, meta) => {
    // Return if request is not saved
    if (!get()?.runtime?.isRequestSaved) return;

    let metaPushAction = PushActionService.prepareMetaPushAction(
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

    let requestToPush = await normalizePushPaylaod(request);

    pushPayload = { ...requestToPush };
    pushPayload._action = {
      type: EPushActionType.Insert,
      item_id: request._meta.id,
      item_type: 'R', // TODO: add type here
      request_type: ERequestTypes.Rest,
      collection_id: '',
      keys: {},
      workspace_id: '',
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

    let requestToPush = await normalizePushPaylaod(
      updatedRequest,
      pushAction._removed
    );

    pushPayload = { ...requestToPush };

    pushPayload._meta = {
      ...pushPayload._meta,
      id: request._meta.id,
      collection_id: request._meta.collection_id,
      folder_id: request._meta.folder_id || '',
    };

    pushPayload._action = {
      type: EPushActionType.Update,
      item_id: request._meta.id,
      item_type: 'R', // TODO: add type here
      request_type: ERequestTypes.Rest,
      collection_id: request._meta.collection_id,
      workspace_id: '',
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
        // handle _root
        case EPushAction_rootKeys.config:
        case EPushAction_rootKeys.headers:
        case EPushAction_rootKeys.method:
          pushAction['_root'] = PushActionService.prepareRootPushAction(
            { [key]: lastRequest[key] },
            { [key]: request[key] }
            // get().pushAction?._root
          );
          break;

        // handle meta
        case 'meta':
          pushAction['meta'] = PushActionService.prepareMetaPushAction(
            lastRequest.meta,
            request.meta
            // get().pushAction?.meta
          );

          break;

        // handle _meta
        /* case '_meta':
          pushAction['_meta'] = PushActionService.prepare_MetaPushAction(
            lastRequest._meta,
            request._meta
            // get().pushAction?._meta
          );
          break; */

        // handle url
        case 'url':
          pushAction['url'] = PushActionService.prepareUrlPushAction(
            lastRequest.url,
            request.url
            // get().pushAction?.url
          );
          break;

        // handle scripts
        case 'scripts':
          pushAction['scripts'] = PushActionService.prepareScriptsPushAction(
            lastRequest.scripts,
            request.scripts
            // get().pushAction?.scripts
          );
          break;

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
