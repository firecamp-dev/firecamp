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
import { prepareEventNameForRequestPull } from '../platform-emitter/events';

interface IPlatformRequestService {
  // subscribe real-time request changes (pull-actions from server)
  subscribeChanges?: (requestId: TId, handlePull: () => any) => void;

  // unsubscribe real-time request changes (pull-actions from server)
  unsubscribeChanges?: (requestId: TId) => void;

  // save and update request
  save: (request: any, tabId: TId) => Promise<any>;

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
  save: async (request: any, tabId: TId) => {
    const { onNewRequestCreate, workspace } = useWorkspaceStore.getState();
    const tabState = useTabStore.getState();
    const requestState = useRequestStore.getState();
    const {
      explorer: { collections, folders },
    } = useWorkspaceStore.getState();
    try {
      // set request payload to store to be saved for next step
      // requestState.setReqAndTabId(request, tabId);

      console.log(workspace, 132456789);

      if (true) {
        return promptSaveItem({
          header: 'Save Request',
          texts: { btnOk: 'Save', btnOking: 'Saving...' },
          collection: {
            items: [...collections, ...folders],
            rootOrders: workspace.__meta.cOrders,
          },
          value: '',
          validator: ({ value, itemId }) => {
            let isValid = false,
              message = '';
            if (!value) message = 'The request name is required';
            if (!itemId)
              message =
                'Please select the colletion/folder to save the request.';
            else if (value.length < 3) {
              message = 'The request name must have min 3 characters';
            } else {
              isValid = true;
            }
            // TODO: add regex validation
            return { isValid, message };
          },
          executor: ({ value, itemId }) => {
            if (!itemId) throw 'The path is not selected';
            const item = [...collections, ...folders].find(
              (i) => i.__ref.id == itemId
            );
            if (!item)
              throw 'The collection/folder you have selected is not found';
            const collectionId = item.__ref.collectionId || item.__ref.id;
            const folderId = item.__ref.collectionId
              ? item.__ref.id
              : undefined;
            console.log(item, 'res...');
            const _request = {
              ...request,
              __meta: {
                ...request.__meta,
                name: value,
                description: '',
              },
              __ref: { ...request.__ref, collectionId },
            };
            if (folderId) _request.__ref.folderId = folderId;
            // return Rest.request.create(_request);
            return new Promise((rs, rj) => {
              setTimeout(() => rs(_request), 2000);
            });
          },
        })
          .then(async (_request) => {
            console.log(_request, '_request...');
            return _request;
          })
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

            return _request;
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
