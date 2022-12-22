import { Realtime, Rest } from '@firecamp/cloud-apis';
import {
  TId,
  IRest,
  IGraphQL,
  IRestResponse,
  ISocketIO,
  IWebSocket,
  EHttpMethod,
} from '@firecamp/types';
import * as executor from '@firecamp/agent-manager';
import { useTabStore } from '../../store/tab';
import { useWorkspaceStore } from '../../store/workspace';
import { useRequestStore } from '../../store/request';
import { useUserStore } from '../../store/user';
import { usePlatformStore } from '../../store/platform';
import { IRequestTab } from '../../components/tabs/types';
import { platformEmitter } from '../platform-emitter';
import { promptSaveItem } from './prompt.service';

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
    request?: IRest | IGraphQL | ISocketIO | IWebSocket
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
  onSave: async (request: any, tabId: TId) => {
    const { onNewRequestCreate } = useWorkspaceStore.getState();
    const tabState = useTabStore.getState();
    const requestState = useRequestStore.getState();
    const {
      explorer: { collections, folders },
    } = useWorkspaceStore.getState();
    try {
      // set request payload to store to be saved for next step
      // requestState.setReqAndTabId(request, tabId);

      if (true) {
        promptSaveItem({
          header: 'Save Request',
          texts: { btnOk: 'Save', btnOking: 'Saving...' },
          folders: [...collections, ...folders],
          value: '',
          validator: (val) => {
            let isValid = false,
              message = '';
            if (!val) message = 'The request name is required';
            else if (val.length < 3) {
              message = 'The request name must have min 3 characters';
            } else {
              isValid = true;
            }
            // TODO: add regex validation
            return { isValid, message };
          },
        })
          .then(
            async (res: {
              name: string;
              description?: string;
              collectionId: TId;
              folderId?: TId;
            }) => {
              console.log(res, 'res...');
              return request;
              const _request = {
                ...request,
                __meta: {
                  ...request.__meta,
                  name: res.name,
                  description: res.description || '',
                },
                __ref: {
                  ...request.__ref,
                  collectionId: res.collectionId,
                  folderId: res.folderId,
                },
              };

              // TODO: handle error here
              return Rest.request
                .push([_request])
                .then((res) => {
                  return _request;
                })
                .catch((e) => {
                  console.log(e, 'error 007');
                });
            }
          )
          .then((_request) => {
            // reflect in explorer
            onNewRequestCreate(_request);
            return _request;
          })
          .then((_request) => {
            tabState.changeRootKeys(tabId, {
              name: _request.__meta?.name,
              type: _request.__meta?.type || '',
              request: {
                url: _request.url,
                method: _request.method || EHttpMethod.POST,
                __meta: _request.__meta,
                __ref: _request.__ref,
              },
              __meta: {
                isSaved: true,
                hasChange: false,
                isFresh: false,
                isDeleted: false,
                revision: 1,
              },
            });
            // TODO: // update tab meta on save request
            // tabState.changeMeta(tabId, {
            //   isSaved: true,
            //   hasChange: false,
            //   isFresh: false,
            // });
          });

        // open save request
        // AppService.modals.openSaveRequest();
      } else {
        // update request
        requestState.onSaveRequest();
      }
      // return Promise.resolve(response);
    } catch (error) {
      console.error({
        fn: 'onSaveRequest',
        request,
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
    let activeWorkspace = useWorkspaceStore.getState().getWorkspaceId();

    let userId = useUserStore.getState().user;

    let timestamp = new Date().valueOf();

    if (pushPayload._action && pushPayload._action.type) {
      let type = pushPayload._action.type;
      // console.log({ pushPayload });

      // add workspaceId
      pushPayload._action = {
        ...pushPayload._action,
        workspaceId: activeWorkspace,
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
    request?: IRest | IGraphQL // | ISocket | IWebsocket,
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
