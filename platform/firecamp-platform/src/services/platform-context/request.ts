import { Realtime, Rest } from '@firecamp/cloud-apis';
import {
  TId,
  IRest,
  IRestResponse,
  EHttpMethod,
  IRequestFolder,
  IRequestItem,
  IVariableGroup,
} from '@firecamp/types';
import { _misc } from '@firecamp/utils';
import * as executor from '@firecamp/agent-manager';
import { platformEmitter } from '../platform-emitter';
import { promptSaveItem } from './prompt.service';
import { prepareEventNameForRequestPull } from '../platform-emitter/events';
import AppService from '../app.service';
import { useTabStore } from '../../store/tab';
import { useWorkspaceStore } from '../../store/workspace';
import { useExplorerStore } from '../../store/explorer';
import { usePlatformStore } from '../../store/platform';
import { useEnvStore } from '../../store/environment';
import { ETabEntityTypes } from '../../components/tabs/types';
import { Regex } from '../../constants';
import platformContext from '.';

interface IPlatformRequestService {
  // subscribe real-time request changes (pull-actions from server)
  subscribeChanges?: (requestId: TId, handlePull: () => any) => void;

  // fetch request from server by request id
  fetch: (reqId: TId) => Promise<any>;

  // fetch request's parent artifacts
  fetchParentArtifacts: (reqId: TId) => Promise<any>;

  // fetch request path from explorer
  getPath: (reqId: TId) => {
    path: string;
    items: {
      id: string;
      name: string;
    }[];
  };

  // save and update request
  save: (request: any, tabId?: TId, isNew?: boolean) => Promise<any>;

  // request folders
  createRequestFolderPrompt: (
    folder: IRequestFolder,
    tabId: TId
  ) => Promise<IRequestFolder>;
  createRequestFolder: (
    folder: IRequestFolder,
    tabId: TId
  ) => Promise<IRequestFolder>;
  updateRequestFolder: (
    item: IRequestFolder,
    tabId: TId
  ) => Promise<IRequestFolder>;
  deleteRequestFolder: (
    folderId: TId,
    requestId: TId,
    tabId: TId
  ) => Promise<any>;

  // request items
  createRequestItemPrompt: (
    item: IRequestItem<any, any>,
    collection: { items: any[]; rootOrders: TId[] },
    options: { header: string; label: string }
  ) => Promise<IRequestItem<any, any>>;
  createRequestItem: (
    item: IRequestItem<any, any>,
    tabId: TId
  ) => Promise<IRequestItem<any, any>>;
  updateRequestItem: (
    item: Partial<IRequestItem<any, any>>,
    tabId: TId
  ) => Promise<IRequestItem<any, any>>;
  deleteRequestItem: (itemId: TId, requestId: TId, tabId: TId) => Promise<any>;

  // get executor
  execute: (request: IRest) => Promise<{
    response: IRestResponse;
    variables: any;
    scriptErrors: any[];
    testResult: any;
  }>;
  cancelExecution: (reqId: TId) => Promise<any>;
}

const request: IPlatformRequestService = {
  // subscribe real-time request changes (pull-actions from server)
  subscribeChanges: (requestId: TId, handlePull: () => any) => {
    // TODO: manage user is logged in from store

    // console.log({ subscribeChanges: requestId });

    // Subscribe request changes
    Realtime.subscribeRequest(requestId);

    const evtName = prepareEventNameForRequestPull(requestId);
    // listen/ subscribe updates
    platformEmitter.on(evtName, handlePull);

    // unsubscribe real-time request changes
    return () => {
      // TODO: handle isLoggedIn

      // unsubscribe request changes
      // Realtime.unsubscribeRequest(requestId); // TODO: add socket API
      platformEmitter.off(prepareEventNameForRequestPull(requestId));
    };
  },

  // fetch request by request id
  fetch: async (reqId: TId) => {
    return await Rest.request.findOne(reqId).then((res) => res.data);
  },

  // fetch request by request id
  getPath: (reqId) => {
    const {
      explorer: { collections, folders, requests },
    } = useExplorerStore.getState();
    return _misc.itemPathFinder(
      [...collections, ...folders, ...requests],
      reqId
    );
  },

  // fetch request's parent artifacts
  fetchParentArtifacts: async (reqId: TId) => {
    return await Rest.request.getParentArtifacts(reqId).then((res) => res.data);
  },

  /** save a new request or update the request changes */
  save: async (request: any, tabId: TId, isNew: boolean = false) => {
    if (!AppService.user.isLoggedIn()) {
      return AppService.modals.openSignIn();
    }
    const { workspace } = useWorkspaceStore.getState();
    const { onNewRequestCreate } = useExplorerStore.getState();
    const tabState = useTabStore.getState();

    const {
      explorer: { collections, folders },
    } = useExplorerStore.getState();
    const _request = {
      ...request,
      __ref: {
        ...request.__ref,
        workspaceId: workspace.__ref.id,
      },
    };
    // console.log(workspace, 132456789);
    if (isNew === true) {
      return promptSaveItem({
        title: 'Save Request',
        btnLabels: { ok: 'Save', oking: 'Saving...' },
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
              'Please select the collection/folder to save the request.';
          else if (value.length < 3) {
            message = 'The request name must have min 3 characters';
          } else {
            isValid = true;
          }
          // TODO: add regex validation
          return { isValid, message };
        },
        executor: async ({ value, itemId }) => {
          if (!itemId) throw 'The path is not selected';
          const item = [...collections, ...folders].find(
            (i) => i.__ref.id == itemId
          );
          if (!item)
            throw 'The collection/folder you have selected is not found';
          const collectionId = item.__ref.collectionId || item.__ref.id;
          const folderId = item.__ref.collectionId ? item.__ref.id : undefined;
          console.log(item, 'res...');
          _request.__meta.name = value;
          _request.__meta.description = '';
          _request.__ref.collectionId = collectionId;
          if (folderId) _request.__ref.folderId = folderId;
          const { data } = await Rest.request.create(_request);
          return _request;
        },
      })
        .then(async (_request) => {
          // console.log(_request, '_request...');
          return _request;
        })
        .then((_request) => {
          // reflect in explorer
          onNewRequestCreate(_request);
          return _request;
        })
        .then((_request) => {
          if (!tabId) return _request;
          tabState.changeRootKeys(tabId, {
            name: _request.__meta?.name,
            entity: {
              url: _request.url,
              method: _request.method || EHttpMethod.POST,
              __meta: _request.__meta,
              __ref: _request.__ref,
            },
            __meta: {
              entityId: _request.__ref.id,
              entityType: ETabEntityTypes.Request,
              isSaved: true,
              hasChange: false,
              isFresh: false,
              isDeleted: false,
              revision: 1,
            },
          });
          return _request;
        });
    } else {
      // Update request
      return Rest.request
        .update(_request.__ref.id, _request)
        .then((res) => {
          // console.log(res);
          if (res.data.flag) {
            platformContext.app.notify.success(
              'The request changes are successfully saved.'
            );
          }
          return res.data;
        })
        .then((request) => {
          if (!tabId) return request;
          // update tab meta on save request
          tabState.changeMeta(tabId, {
            isSaved: true,
            hasChange: false,
            isFresh: false,
          });
          return request;
        })
        .catch((e) => {
          console.log(e);
          if (e?.message) platformContext.app.notify.alert(e.message);
        });
    }
  },

  createRequestFolderPrompt: async (folder, tabId) => {
    return platformContext.window
      .promptInput({
        title: 'Create A New Folder',
        label: 'Folder Name',
        placeholder: '',
        btnLabels: { oking: 'Creating...' },
        value: folder.name,
        validator: (val) => {
          if (!val || val.length < 3) {
            return {
              isValid: false,
              message: 'The folder name must have minimum 3 characters.',
            };
          }
          const isValid = Regex.FolderName.test(val);
          return {
            isValid,
            message:
              !isValid &&
              'The folder name must not contain any special characters.',
          };
        },
        executor: (name) => {
          const _folder = { ...folder, name };
          return request.createRequestFolder(_folder, '');
        },
        onError: (e) => {
          platformContext.app.notify.alert(
            e?.response?.data?.message || e.message
          );
        },
      })
      .then((res) => {
        // console.log(res, 'createRequestFolder response);
        return res;
      });
  },
  createRequestFolder: async (folder, tabId) => {
    return Rest.request
      .createFolder(folder.__ref.requestId, folder)
      .then((res) => res.data);
  },
  updateRequestFolder: async (folder, tabId) => {
    return folder;
  },
  deleteRequestFolder: async (requestId, folderId, tabId) => {
    return Rest.request
      .deleteFolder(requestId, folderId)
      .then((res) => res.data);
  },

  createRequestItemPrompt: async (item, collection, { header, label }) => {
    return platformContext.window
      .promptSaveItem({
        title: header || 'Save WebSocket Message',
        label: label || 'Message Title',
        placeholder: '',
        btnLabels: { ok: 'Save', oking: 'Saving...' },
        value: '',
        collection,
        executor: ({ value, itemId }) => {
          const _item = {
            ...item,
            name: value,
            __ref: {
              ...item.__ref,
              folderId: itemId,
            },
          };
          return request.createRequestItem(_item, '');
        },
        onError: (e) => {
          platformContext.app.notify.alert(
            e?.response?.data?.message || e.message
          );
        },
      })
      .then((res) => {
        console.log(res, 1111);
        return res;
      });
  },

  createRequestItem: async (item, tabId) => {
    return Rest.request
      .createItem(item.__ref.requestId, item)
      .then((res) => res.data);
  },
  updateRequestItem: async (item, tabId) => {
    return Rest.request
      .updateItem(item.__ref.requestId, item.__ref.id, item)
      .then((res) => res.data);
  },
  deleteRequestItem: async (requestId, itemId, tabId) => {
    return Rest.request.deleteItem(requestId, itemId).then((res) => res.data);
  },

  // execute request
  execute: async (request: IRest) => {
    const agent = usePlatformStore.getState().getFirecampAgent();
    const varGroup = platformContext.environment.getVariableGroup();
    return executor.send(request, varGroup, agent).then((result) => {
      const { setVarsInLocalFromExecutorResponse } = useEnvStore.getState();
      setVarsInLocalFromExecutorResponse(varGroup, request.__ref?.collectionId);
      return result;
    });
  },

  cancelExecution: (reqId: TId) => {
    const agent = usePlatformStore.getState().getFirecampAgent();
    return executor.cancel(reqId, agent);
  },
};

export { IPlatformRequestService, request };
