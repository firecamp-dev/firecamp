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
import { ERequestTypes, ISocketIO, TId } from '@firecamp/types';
import PushActionService from '../../../services/push-actions';

export interface IPushActionRequest {
  url?: Array<EPushActionUrlKeys>;
  config?: Array<EPushActionConfigKeys>;
  connections?: IPushActionConnections;
  _root?: Array<EPushAction_rootKeys>;
  __meta: Array<EPushActionMetaKeys>;
  __ref: Array<EPushAction_metaKeys>;
  _removed?: {};
}

export interface IPushAction {
  request?: IPushActionRequest;
  emitters?: { [key: TId]: IPushActionEmitter };
  directories?: { [key: TId]: IPushActionDirectory };
}

export interface IPushPayload extends Partial<ISocketIO> {
  _action?: {
    type: string;
    item_id: TId;
    item_type: 'R';
    requestType: ERequestTypes.SocketIO;
    collectionId: TId;
    workspaceId: TId;
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
  __meta: [],
  url: [],

  __ref: [],
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
      type: 'i',
      item_id: request.__ref.id,
      item_type: 'R', // TODO: add type here
      requestType: ERequestTypes.SocketIO,
      collectionId: '',
      keys: {},
      workspaceId: '',
    };
    return Promise.resolve(pushPayload);
  },

  prepareRequestUpdatePushPayload: (): Promise<IPushPayload> => {
    let pushAction: Partial<IPushAction> = _cleanDeep(get().pushAction);

    if (!_object.size(pushAction)) return Promise.reject('Empty push action');
    // console.log({ state: get() });

    let request: ISocketIO = get().request;
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
      item_id: request.__ref.id,
      item_type: 'R', // TODO: add type here
      requestType: ERequestTypes.SocketIO,
      collectionId: request.__ref.collectionId,
      workspaceId: '',
      keys: pushAction,
    };
    // console.log({ updatedRequest });

    return Promise.resolve(updatedRequest);
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

        // handle __meta
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
  ...createPushActionEmitterSlice(set, get),
  ...createPushActionDirectorySlice(set, get),
});
