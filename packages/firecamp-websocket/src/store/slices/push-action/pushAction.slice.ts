import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { _object } from '@firecamp/utils';

import {
  EPushActionMetaKeys,
  EPushActionUrlKeys,
  EPushActionConfigKeys,
  EPushActionRootKeys,
  EPushAction_metaKeys,
  IPushActionConnections,
  IPushActionMessage,
  IPushActionDirectory,
} from '../../../types';

import {
  IPushActionRequestSlice,
  createPushActionRequestSlice,
} from './request.slice';

import {
  IPushActionDirectorySlice,
  createPushActionDirectorySlice,
} from './directory.slice';

import {
  IPushActionMessageSlice,
  createPushActionMessageSlice,
} from './message.slice';
import {
  ERequestTypes,
  IWebSocket,
  TId,
} from '@firecamp/types';
import PushActionService from '../../../services/push-actions';

export interface IPushActionRequest {
  url?: Array<EPushActionUrlKeys>;
  meta?: Array<EPushActionMetaKeys>;
  config?: Array<EPushActionConfigKeys>;
  connections?: IPushActionConnections;
  _root?: Array<EPushActionRootKeys>;
  __ref?: Array<EPushAction_metaKeys>;
  _removed?: {};
}

export interface IPushAction {
  request?: IPushActionRequest;
  messages?: { [key: TId]: IPushActionMessage };
  directories?: { [key: TId]: IPushActionDirectory };
}

export interface IPushPayload extends Partial<IWebSocket> {
  _action?: {
    type: string;
    itemId: TId;
    itemType: 'R';
    requestType: ERequestTypes.WebSocket;
    collectionId: TId;
    workspaceId: TId;
    keys: IPushAction;
  };
}

export interface IPushActionSlice
  extends IPushActionRequestSlice,
    IPushActionDirectorySlice,
    IPushActionMessageSlice {
  pushAction?: IPushAction;

  initializePushAction: (pushAction: IPushAction) => void;
  prepareRequestInsertPushPayload: () => Promise<IPushPayload>;
  prepareRequestUpdatePushPayload: () => Promise<IPushPayload>;
  prepareRequestUpdatePushAction: (
    request: Partial<IWebSocket>
  ) => Promise<Partial<IPushAction>>;
  setPushActionEmpty: () => void;
}

export const emptyPushAction = {
  _root: [],
  url: [],
  __meta: [],
  __ref: [],
  _removed: {},
};

export const createPushActionSlice = (
  set: any,
  get: any
): IPushActionSlice => ({
  pushAction: {
    request: {},
    messages: {},
    directories: {},
  },

  initializePushAction: (pushAction: IPushAction) => {
    set((s) => ({
      ...s,
      pushAction,
    }));
  },

  prepareRequestInsertPushPayload: async (): Promise<IPushPayload> => {
    const state = get();
    const request: IWebSocket = state.request;
    let pushPayload: IPushPayload = {};

    console.log({ request });

    pushPayload = { ...request };
    pushPayload._action = {
      type: 'i',
      itemId: request.__ref.id,
      itemType: 'R', // TODO: add type here
      requestType: ERequestTypes.WebSocket,
      collectionId: '',
      keys: {},
      workspaceId: '',
    };
    return Promise.resolve(pushPayload);
  },

  prepareRequestUpdatePushPayload: (): Promise<IPushPayload> => {
    const state = get();
    const pushAction: Partial<IPushAction> = _cleanDeep(state.pushAction);

    if (!_object.size(pushAction)) return Promise.reject('Empty push action');
    // console.log({ state: get() });

    const request: IWebSocket = state.request;
    let updatedRequest: IPushPayload = {};
    if (pushAction.request) {
      // console.log({ pushAction, request });
      for (let key in pushAction.request) {
        // console.log({ key, 1: request[key], 2: pushAction.request[key] });

        if (key === '_root') {
          updatedRequest = {
            ...updatedRequest,
            ..._object.pick(request, pushAction.request[key]),
          };
        } else if (key !== '_removed' && key in request) {
          updatedRequest[key] = _object.pick(
            request[key],
            pushAction.request[key]
          );
        }
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
      itemId: request.__ref.id,
      itemType: 'R', // TODO: add type here
      requestType: ERequestTypes.WebSocket,
      collectionId: request.__ref.collectionId,
      workspaceId: '',
      keys: pushAction,
    };
    // console.log({ updatedRequest });

    return Promise.resolve(updatedRequest);
  },

  prepareRequestUpdatePushAction: (request: Partial<IWebSocket>) => {
    const state = get();
    let pushAction: Partial<IPushAction> = {};
    let lastRequest: IWebSocket = state.last.request;

    console.log('prepareRequestUpdatePushAction: ', { lastRequest, request });

    for (let key in request) {
      switch (key) {
        // handle _root
        case EPushActionRootKeys.headers:
          pushAction['_root'] = PushActionService.prepareRootPushAction(
            { [key]: lastRequest[key] },
            { [key]: request[key] }
            // get().pushAction?._root
          );
          break;

        // handle meta
        case '__meta':
          pushAction['__meta'] = PushActionService.prepareMetaPushAction(
            lastRequest.__meta,
            request.__meta
            // get().pushAction?.__meta
          );

          break;

        // handle __ref
        /* case '__ref':
          pushAction['__ref'] = PushActionService.prepare_MetaPushAction(
            lastRequest.__ref,
            request.__ref
            // get().pushAction?.__ref
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
  ...createPushActionRequestSlice(set, get),
  ...createPushActionMessageSlice(set, get),
  ...createPushActionDirectorySlice(set, get),
});
