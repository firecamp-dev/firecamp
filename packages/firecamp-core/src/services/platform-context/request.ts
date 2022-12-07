import { Realtime, Rest } from '@firecamp/cloud-apis';
import {
  TId,
  IRest,
  IGraphQL,
  IRestResponse,
} from '@firecamp/types';
import * as executor from '@firecamp/agent-manager';

// import { ISocket } from '@firecamp/socket.io/src/store';
// import { IWebsocket } from '@firecamp/websocket/src/store';

import { useTabStore } from '../../store/tab';
import { useWorkspaceStore } from '../../store/workspace';
import { useRequestStore } from '../../store/request';
import { useUserStore } from '../../store/user';
import { usePlatformStore } from '../../store/platform';

import { IRequestTab } from '../../components/tabs/types';
import { platformEmitter } from '../platform-emitter';

import AppService from '../app';
import { prepareEventNameForRequestPull } from '../platform-emitter/events';

interface IPlatformRequestService {
  // subscribe real-time request changes (pull-actions from server)
  subscribeChanges?: (requestId: TId, handlePull: () => any) => void;

  // unsubscribe real-time request changes (pull-actions from server)
  unsubscribeChanges?: (requestId: TId) => void;

  // Save and update request
  onSave: (pushPayload: any, tabId: TId) => Promise<any>;

  // on change request, update tab __meta
  onChangeRequestTab: (
    tabId: TId,
    tabMeta: IRequestTab['__meta'],
    request?: IRest | IGraphQL, // |ISocket | IWebsocket ,
    pushActions?: any[]
  ) => void;

  // fetch request from server by request id
  onFetch: (reqId: TId) => Promise<any>;

  // normalize request push payload for insert and update
  normalizePushPayload: (pushPayload: any) => Promise<any>;

  // get executor
  execute: (request: IRest) => Promise<IRestResponse>;
  cancelExecution: (reqId: TId) => Promise<any>;
}

const request: IPlatformRequestService = {
  // subscribe real-time request changes (pull-actions from server)
  subscribeChanges: (requestId: TId, handlePull: () => any) => {
    // TODO: manage user is logged in from store
    // if (!F.userMeta.isLoggedIn) return;

    // console.log({ subscribeChanges: requestId });

    // Subscribe request changes
    Realtime.subscribeRequest(requestId);

    // listen/ subscribe updates
    platformEmitter.on(prepareEventNameForRequestPull(requestId), handlePull);
  },

  // unsubscribe real-time request changes (pull-actions from server)
  unsubscribeChanges: (requestId: TId) => {
    // TODO: handle isLoggedIn
    // if (!F.userMeta.isLoggedIn) return;

    // console.log({ unsubscribeChanges: requestId });

    // unsubscribe request changes
    // Realtime.unsubscribeRequest(requestId); // TODO: add socket API
    platformEmitter.off(prepareEventNameForRequestPull(requestId));
  },

  /**
   * Open save request modal if request is newly created
   * if request is already saved then update request with chanes/payload
   */
  onSave: async (pushPayload: any, tabId: TId) => {
    const requestState = useRequestStore.getState();
    try {
      // set request payload to store to be saved for next step
      requestState.setReqAndTabId(pushPayload, tabId);

      if (pushPayload && pushPayload._action.type === 'i') {
        // open save request
        AppService.modals.openSaveRequest();
      } else {
        // update request
        requestState.onSaveRequest();
      }
      // return Promise.resolve(response);
    } catch (error) {
      console.error({
        fn: 'onSaveRequest',
        pushPayload,
        error,
      });
      // return Promise.reject(error);
    }
  },

  // fetch request from server by request id
  onFetch: async (reqId: TId) => {
    return await Rest.request.findOne(reqId);
  },

  // normalize request push payload for insert and update
  normalizePushPayload: (pushPayload: any) => {
    let active_workspace = useWorkspaceStore.getState().getWorkspaceId();

    let userId = useUserStore.getState().user;

    let timestamp = new Date().valueOf();

    if (pushPayload._action && pushPayload._action.type) {
      let type = pushPayload._action.type;
      // console.log({ pushPayload });

      // add workspaceId
      pushPayload._action = {
        ...pushPayload._action,
        workspaceId: active_workspace,
      };

      switch (type) {
        case 'i':
          pushPayload.__ref = {
            ...pushPayload.__ref,
            createdBy: userId,
            createdAt: timestamp,
          };
          break;

        case 'u':
          pushPayload.__ref = {
            ...pushPayload.__ref,
            updatedBy: userId,
            updatedAt: timestamp,
          };
          break;

        case 'd':
          pushPayload.__ref = {
            ...pushPayload.__ref,
            deleted_by: userId,
            deleted_at: timestamp,
          };
          break;

        default:
          // do nothing
          break;
      }
    }

    return Promise.resolve(pushPayload);
  },

  // on change request
  onChangeRequestTab: (
    tabId: TId,
    tabMeta: IRequestTab['__meta'],
    request?: IRest | IGraphQL, // | ISocket | IWebsocket,
    pushActions?: any[]
  ) => {
    // Here, request and pushActions are used for future purpose
    // console.log({ tabMeta });

    useTabStore.getState().changeMeta(tabId, tabMeta);
  },

  // execute request
  execute: async (request: IRest) => {
    const agent = usePlatformStore.getState().getFirecampAgent();
    return executor.send(request, agent);
  },

  cancelExecution: (reqId: TId) => {
    const agent = usePlatformStore.getState().getFirecampAgent();
    return executor.cancel(reqId, agent);
  },
};

export { IPlatformRequestService, request };
