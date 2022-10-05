import { Realtime, Rest } from '@firecamp/cloud-apis';
import {
  TId,
  EPushActionType,
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

import { ITabMeta } from '../../components/tabs/types';
import { platformEmitter } from '../platform-emitter';

import AppService from '../app';
import { prepareEventNameForRequestPull } from '../../types';

interface IPlatformRequestService {
  // subscribe real-time request changes (pull-actions from server)
  subscribeChanges?: (request_id: TId, handlePull: () => any) => void;

  // unsubscribe real-time request changes (pull-actions from server)
  unsubscribeChanges?: (request_id: TId) => void;

  // Save and update request
  onSave: (pushPayload: any, tabId: TId) => Promise<any>;

  // on change request, update tab meta
  onChangeRequestTab: (
    tabId: TId,
    tabMeta: ITabMeta,
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
  subscribeChanges: (request_id: TId, handlePull: () => any) => {
    // TODO: manage user is logged in from store
    // if (!F.userMeta.isLoggedIn) return;

    // console.log({ subscribeChanges: request_id });

    // Subscribe request changes
    Realtime.socket.subscribeRequest(request_id);

    // listen/ subscribe updates
    platformEmitter.on(prepareEventNameForRequestPull(request_id), handlePull);
  },

  // unsubscribe real-time request changes (pull-actions from server)
  unsubscribeChanges: (request_id: TId) => {
    // TODO: handle isLoggedIn
    // if (!F.userMeta.isLoggedIn) return;

    // console.log({ unsubscribeChanges: request_id });

    // unsubscribe request changes
    // Realtime.socket.unsubscribeRequest(request_id); // TODO: add socket API
    platformEmitter.off(prepareEventNameForRequestPull(request_id));
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

      if (pushPayload && pushPayload._action.type === EPushActionType.Insert) {
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

    let user_id = useUserStore.getState().user;

    let timestamp = new Date().valueOf();

    if (pushPayload._action && pushPayload._action.type) {
      let type = pushPayload._action.type;
      // console.log({ pushPayload });

      // add workspace_id
      pushPayload._action = {
        ...pushPayload._action,
        workspace_id: active_workspace,
      };

      switch (type) {
        case EPushActionType.Insert:
          pushPayload._meta = {
            ...pushPayload._meta,
            created_by: user_id,
            created_at: timestamp,
          };
          break;

        case EPushActionType.Update:
          pushPayload._meta = {
            ...pushPayload._meta,
            updated_by: user_id,
            updated_at: timestamp,
          };
          break;

        case EPushActionType.Delete:
          pushPayload._meta = {
            ...pushPayload._meta,
            deleted_by: user_id,
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
    tabMeta: ITabMeta,
    request?: IRest | IGraphQL, // | ISocket | IWebsocket,
    pushActions?: any[]
  ) => {
    // Here, request and pushActions are used for future purpose
    // console.log({ tabMeta });

    useTabStore.getState().update.meta(tabId, tabMeta);
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
