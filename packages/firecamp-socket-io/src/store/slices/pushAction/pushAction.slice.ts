import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { _object } from '@firecamp/utils';

import {
  EPushActionMetaKeys,
  EPushActionUrlKeys,
  EPushActionConfigKeys,
  IPushActionConnections,
  IPushActionEmitter,
  IPushActionDirectory,
  EPushAction_rootKeys,
  EPushAction_metaKeys,
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
  IPushActionEmitterSlice,
  createPushActionEmitterSlice,
} from './emitter.slice';
import {
  EPushActionType,
  ERequestTypes,
  ISocketIO,
  TId,
} from '@firecamp/types';
import PushActionService from '../../../services/push-actions';

export interface IPushActionRequest {
  url?: Array<EPushActionUrlKeys>;
  meta?: Array<EPushActionMetaKeys>;
  config?: Array<EPushActionConfigKeys>;
  connections?: IPushActionConnections;
  _root?: Array<EPushAction_rootKeys>;
  _meta?: Array<EPushAction_metaKeys>;
  _removed?: {};
}

export interface IPushAction {
  request?: IPushActionRequest;
  emitters?: { [key: TId]: IPushActionEmitter };
  directories?: { [key: TId]: IPushActionDirectory };
}

export interface IPushPayload extends Partial<ISocketIO> {
  _action?: {
    type: EPushActionType;
    item_id: TId;
    item_type: 'R';
    request_type: ERequestTypes.SocketIO;
    collectionId: TId;
    workspace_id: TId;
    keys: IPushAction;
  };
}

export interface IPushActionSlice
  extends IPushActionRequestSlice,
    IPushActionDirectorySlice,
    IPushActionEmitterSlice {
  pushAction?: IPushAction;

  initializePushAction: (pushAction: IPushAction) => void;
  prepareRequestInsertPushPayload: () => Promise<IPushPayload>;
  prepareRequestUpdatePushPayload: () => Promise<IPushPayload>;
  prepareRequestUpdatePushAction: (
    request: Partial<ISocketIO>
  ) => Promise<Partial<IPushAction>>;
  setPushActionEmpty: () => void;
}

export const emptyPushAction = {
  _root: [],
  meta: [],
  url: [],

  _meta: [],
  _removed: {},
};

export const createPushActionSlice = (
  set: any,
  get: any
): IPushActionSlice => ({
  pushAction: {
    request: {},
    emitters: {},
    directories: {},
  },
  initializePushAction: (pushAction: IPushAction) => {
    set((s) => ({
      ...s,
      pushAction,
    }));
  },
  prepareRequestInsertPushPayload: async (): Promise<IPushPayload> => {
    let request: ISocketIO = get().request;
    let pushPayload: IPushPayload = {};

    console.log({ request });

    pushPayload = { ...request };
    pushPayload._action = {
      type: EPushActionType.Insert,
      item_id: request._meta.id,
      item_type: 'R', // TODO: add type here
      request_type: ERequestTypes.SocketIO,
      collectionId: '',
      keys: {},
      workspace_id: '',
    };
    return Promise.resolve(pushPayload);
  },

  prepareRequestUpdatePushPayload: (): Promise<IPushPayload> => {
    let pushAction: Partial<IPushAction> = _cleanDeep(get().pushAction);

    if (!_object.size(pushAction)) return Promise.reject('Empty push action');
    // console.log({ state: get() });

    let request: ISocketIO = get().request;
    let updatedReqeust: IPushPayload = {};
    if (pushAction.request) {
      // console.log({ pushAction, request });
      for (let key in pushAction.request) {
        // console.log({ key, 1: request[key], 2: pushAction.request[key] });

        if (key === '_root') {
          updatedReqeust = {
            ...updatedReqeust,
            ..._object.pick(request, pushAction.request[key]),
          };
        } else if (key !== '_removed' && key in request) {
          updatedReqeust[key] = _object.pick(
            request[key],
            pushAction.request[key]
          );
        }
      }
    }

    let pushPayload: IPushPayload = updatedReqeust;

    pushPayload._meta = {
      ...pushPayload._meta,
      id: request._meta.id,
      collectionId: request._meta.collectionId,
      folderId: request._meta.folderId || '',
    };

    pushPayload._action = {
      type: EPushActionType.Update,
      item_id: request._meta.id,
      item_type: 'R', // TODO: add type here
      request_type: ERequestTypes.SocketIO,
      collectionId: request._meta.collectionId,
      workspace_id: '',
      keys: pushAction,
    };
    // console.log({ updatedReqeust });

    return Promise.resolve(updatedReqeust);
  },

  prepareRequestUpdatePushAction: (request: Partial<ISocketIO>) => {
    let pushAction: Partial<IPushAction> = {};
    let lastRequest: ISocketIO = get()?.last.request;

    console.log('prepareRequestUpdatePushAction: ', { lastRequest, request });

    for (let key in request) {
      switch (key) {
        // handle _root
        case EPushAction_rootKeys.headers:
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
  ...createPushActionEmitterSlice(set, get),
  ...createPushActionDirectorySlice(set, get),
});
