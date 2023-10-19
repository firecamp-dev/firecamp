import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import _reject from 'lodash/reject';
import { _object, _string } from '@firecamp/utils';
import { Rest } from '@firecamp/cloud-apis';
import {
  TId,
  ICollection,
  IFolder,
  IWorkspace,
  EWorkspaceType,
} from '@firecamp/types';

import { useEnvStore } from './environment';
import platformContext from '../services/platform-context';
import { ETabEntityTypes } from '../components/tabs/types';
import { useTabStore } from './tab';
import { useWorkspaceStore } from './workspace';

const initialState = {
  explorer: {
    tdpInstance: null,
    isProgressing: false,

    collections: [],
    folders: [],
    requests: [],
  },
};

export interface IWorkspaceStore {
  explorer: {
    tdpInstance: any;
    isProgressing: boolean;
    collections?: any[];
    folders?: any[];
    requests?: any[];
  };

  registerTDP: (instance: any) => void;
  unRegisterTDP: () => void;
  toggleProgressBar: (flag?: boolean) => void;

  // organization
  createOrg: (payload: TCreateOrgPayload) => Promise<any>;
  checkOrgNameAvailability: (name: string) => Promise<any>;

  // workspace
  fetchExplorer: (wId?: TId) => void;

  // collection
  openCollectionTab: (collectionId: TId) => void;
  createCollection: (payload: { [k: string]: any }) => Promise<any>;
  updateCollection: (cId: string, payload: { [k: string]: any }) => void;
  deleteCollection: (cId: string) => void;
  onCreateCollection: (collection: ICollection) => void;
  onUpdateCollection: (collection: Partial<ICollection>) => void;
  onDeleteCollection: (collection: TId | ICollection) => void;

  // folder
  openFolderTab: (folderId: TId) => void;
  createFolder: (payload: { [k: string]: any }) => Promise<any>;
  updateFolder: (fId: string, payload: { [k: string]: any }) => void;
  deleteFolder: (fId: string) => void;
  onCreateFolder: (folder: IFolder) => void;
  onUpdateFolder: (folder: Partial<IFolder>) => void;
  onDeleteFolder: (folder: TId | IFolder) => void;

  onCreateRequest: (request: any) => void;
  onUpdateRequest: (request: any) => void;
  onDeleteRequest: (request: TId | any) => void;

  // request
  onNewRequestCreate: (request: any) => void;
  createRequest: (payload: { [k: string]: any }) => void;
  deleteRequest: (rId: TId) => void;

  // change orders
  changeWorkspaceMetaOrders: (itemId: TId, position: number) => Promise<any>;
  changeCollectionChildrenPosition: (
    colId: TId,
    itemId: TId,
    position: number,
    itemType: 'request' | 'folder'
  ) => Promise<any>;
  changeFolderChildrenPosition: (
    folId: TId,
    itemId: TId,
    position: number,
    itemType: 'request' | 'folder'
  ) => Promise<any>;

  moveFolder: (
    folderId: TId,
    to: { collectionId: string; folderId?: string }
  ) => Promise<any>;
  moveRequest: (
    requestId: TId,
    to: { collectionId: string; folderId?: string }
  ) => Promise<any>;

  // common
  dispose: () => void;
}

export const useExplorerStore = create<IWorkspaceStore>(
  devtools((set, get) => ({
    explorer: { ...initialState.explorer },

    // register TreeDatProvider instance
    registerTDP: (instance: any) => {
      const state = get();
      const { collections, folders, requests } = state.explorer;
      const { workspace } = useWorkspaceStore.getState();
      console.log(workspace.__meta.cOrders, 'workspace.__meta.cOrders');
      instance.init(collections, folders, requests, workspace.__meta.cOrders);
      set((s) => {
        return { explorer: { ...s.explorer, tdpInstance: instance } };
      });
    },

    // unregister TreeDatProvider instance
    unRegisterTDP: () => {
      set((s) => ({ explorer: { ...s.explorer, tdpInstance: null } }));
    },

    toggleProgressBar: (flag?: boolean) => {
      set((s) => ({
        explorer: {
          ...s.explorer,
          isProgressing:
            typeof flag == 'boolean' ? flag : !s.explorer.isProgressing,
        },
      }));
    },

    // fetch remote collections of workspace... replacement of fetchAndSetAll
    fetchExplorer: async (workspaceId) => {
      const state = get();

      state.toggleProgressBar(true);
      const wId =
        workspaceId || useWorkspaceStore.getState().workspace.__ref.id;
      await Rest.workspace
        .fetchWorkspaceArtifacts(wId)
        .then((res: any) => {
          if (Array.isArray(res.data?.collections)) {
            let {
              workspace = {},
              collections = [],
              folders = [],
              requests = [],
              envs = [],
              environments = [],
              globalEnv,
            } = res.data;

            // console.log(res.data, "res.data wCollection...");
            const { setWorkspace } = useWorkspaceStore.getState();
            setWorkspace(workspace);
            set((s) => {
              s.explorer?.tdpInstance?.init(
                collections,
                folders,
                requests,
                workspace.__meta.cOrders
              );
              return {
                explorer: { ...s.explorer, collections, folders, requests },
              };
            });

            //TODO: set env from here atm, but improve this logic in future to fetch directly in Env store
            const envStore = useEnvStore.getState();
            envStore.initialize(envs);
            envStore.init(environments, globalEnv);
          }
        })
        .catch((e) => {
          console.log(e.response, 'e');
          platformContext.app.notify.alert(
            e.response?.data?.message || e.message
          );
        })
        .finally(() => {
          state.toggleProgressBar(false);
        });
    },

    // collection
    openCollectionTab: (collectionId: TId) => {
      const state = get();
      const collection = state.explorer.collections?.find(
        (c) => c.__ref.id == collectionId
      );
      if (collection) {
        const { name, description, __ref } = collection;
        const { open } = useTabStore.getState();
        open(
          { name, description, __ref },
          { id: collectionId, type: ETabEntityTypes.Collection }
        );
      }
    },

    createCollection: async (payload: { [k: string]: any }) => {
      const state = get();
      const { workspace } = useWorkspaceStore.getState();
      const _collection = {
        name: payload?.name,
        description: payload?.description,
        __ref: {
          id: nanoid(),
          workspaceId: workspace.__ref.id,
        },
      };
      state.toggleProgressBar(true);
      const res = await Rest.collection
        .create(_collection)
        .then((r) => {
          state.onCreateCollection(r.data);
          return r;
        })
        .finally(() => {
          state.toggleProgressBar(false);
        });
      return res;
    },
    updateCollection: async (cId: string, payload: Partial<ICollection>) => {
      const state = get();
      state.toggleProgressBar(true);
      const res = await Rest.collection
        .update(cId, payload)
        .then((r) => {
          state.onUpdateCollection(payload);
          return r;
        })
        .catch((e) => {})
        .finally(() => {
          state.toggleProgressBar(false);
        });
      return res;
    },
    deleteCollection: async (cId: string) => {
      const state = get();
      state.toggleProgressBar(true);
      const res = await Rest.collection
        .delete(cId)
        .then((r) => {
          state.onDeleteCollection(cId);
          return r;
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          state.toggleProgressBar(false);
        });
      return res;
    },
    onCreateCollection: (collection: ICollection) => {
      const { workspace, setWorkspace } = useWorkspaceStore.getState();
      setWorkspace({
        ...workspace,
        __meta: {
          ...workspace.__meta,
          cOrders: [...workspace.__meta.cOrders, collection.__ref.id],
        },
      } as IWorkspace);
      set((s) => {
        s.explorer.tdpInstance?.addCollectionItem(collection);
        return {
          explorer: {
            ...s.explorer,
            collections: [...s.explorer.collections, collection],
          },
        };
      });
    },

    onUpdateCollection: (collection) => {
      set((s) => {
        s.explorer.tdpInstance?.updateCollectionItem(collection);
        const collections = s.explorer.collections.map((c) => {
          if (c.__ref.id == collection.__ref.id)
            c = { ...c, name: collection.name }; //note: this condition is used considering only renaming use case
          return c;
        });
        return { explorer: { ...s.explorer, collections } };
      });
    },
    onDeleteCollection: (collection) => {
      const cId =
        typeof collection == 'string' ? collection : collection.__ref.id;
      const { workspace, setWorkspace } = useWorkspaceStore.getState();
      const _workspace = {
        ...workspace,
        __meta: {
          ...workspace.__meta,
          cOrders: workspace.__meta.cOrders.filter((id) => id != cId),
        },
      };
      setWorkspace(_workspace as IWorkspace);
      set((s) => {
        const collections = s.explorer.collections.filter(
          (c) => c.__ref.id != cId
        );
        s.explorer.tdpInstance?.deleteCollectionItem(cId);
        return { explorer: { ...s.explorer, collections } };
      });
    },

    // folder
    openFolderTab: (folderId: TId) => {
      const state = get();
      const folder = state.explorer.folders?.find(
        (f) => f.__ref.id == folderId
      );
      if (folder) {
        const { name, description, __ref } = folder;
        const { open } = useTabStore.getState();
        open(
          { name, description, __ref },
          { id: folderId, type: ETabEntityTypes.Folder }
        );
      }
    },
    createFolder: async (payload: IFolder) => {
      const state = get();
      const _folder: IFolder = {
        name: payload?.name,
        description: payload?.description,
        preScripts: [],
        postScripts: [],
        __meta: { fOrders: [], rOrders: [] },
        __ref: {
          id: nanoid(),
          collectionId: payload?.__ref?.collectionId,
          folderId: payload?.__ref?.folderId,
        },
      };

      state.toggleProgressBar(true);
      const res = await Rest.folder
        .create(_folder)
        .then((res) => {
          state.onCreateFolder(_folder);
        })
        // .catch((e) => {
        //   console.log(e);
        // })
        .finally(() => {
          state.toggleProgressBar(false);
        });

      return res;
    },
    updateFolder: async (fId: string, payload: Partial<IFolder>) => {
      const state = get();
      state.toggleProgressBar(true);
      const res = await Rest.folder
        .update(fId, payload)
        .then((r) => {
          state.onUpdateFolder(payload);
          return r;
        })
        .catch((e) => {
          if (e.message == 'Network Error') {
            //TODO: show error notification
          }
        })
        .finally(() => {
          state.toggleProgressBar(false);
        });
      return res;
    },
    deleteFolder: async (fId: string) => {
      const state = get();
      state.toggleProgressBar(true);
      const res = await Rest.folder
        .delete(fId)
        .then((r) => {
          state.onDeleteFolder(fId);
          return r;
        })
        .catch((e) => {
          if (e.message == 'Network Error') {
            //TODO: show error notification
          }
        })
        .finally(() => {
          state.toggleProgressBar(false);
        });
      return res;
    },
    onCreateFolder: (folder) => {
      //@ts-ignore
      if (folder.__meta?.type) folder.__meta.type = 'F'; // TODO: remove it later after migration M=>F
      set((s) => {
        s.explorer.tdpInstance?.addFolderItem(folder);
        const { collections, folders } = s.explorer;
        if (folder.__ref.folderId) {
          folders.map((f) => {
            if (f.__ref.id == folder.__ref.folderId) {
              f.__meta.fOrders.push(folder.__ref.id);
            }
          });
        } else if (folder.__ref.collectionId) {
          collections.map((c) => {
            if (c.__ref.id == folder.__ref.collectionId) {
              c.__meta.fOrders.push(folder.__ref.id);
            }
          });
        }
        return {
          explorer: {
            ...s.explorer,
            collections,
            folders: [...folders, folder],
          },
        };
      });
    },
    onUpdateFolder: (folder) => {
      set((s) => {
        s.explorer.tdpInstance?.updateFolderItem(folder);
        const folders = s.explorer.folders.map((f) => {
          if (f.__ref.id == folder.__ref.id) f = { ...f, name: folder.name }; //note: this condition is used considering only renaming use case
          return f;
        });
        return { explorer: { ...s.explorer, folders } };
      });
    },
    onDeleteFolder: (folder) => {
      const fId = typeof folder == 'string' ? folder : folder.__ref.id;
      set((s) => {
        s.explorer.tdpInstance?.deleteFolderItem(fId);
        const folders = s.explorer.folders.filter((f) => f.__ref.id != fId);
        return { explorer: { ...s.explorer, folders } };
      });
    },

    // request

    // when request is being created from request store then reflect it in explorer
    onNewRequestCreate: (request: any) => {
      set((s) => {
        s.explorer?.tdpInstance?.addRequestItem(request);

        let { collections, folders, requests } = s.explorer;
        const { url, method, __meta, __ref } = request;
        if (request.__ref.folderId) {
          folders = s.explorer.folders.map((f) => {
            if (f.__ref.id == request.__ref.folderId) {
              f.__meta.rOrders.push(request.__ref.id);
            }
            return f;
          });
        } else if (request.__ref?.collectionId) {
          collections = s.explorer.collections.map((c) => {
            if (c.__ref.id == request.__ref.collectionId) {
              c.__meta.rOrders.push(request.__ref.id);
            }
            return c;
          });
        }

        return {
          explorer: {
            ...s.explorer,
            folders,
            collections,
            requests: [...requests, { url, method, __meta, __ref }],
          },
        };
      });
    },

    // TODO: This is not in use for now, request is being saved from request store
    createRequest: async (payload: { [k: string]: any }) => {
      const state = get();
      const { workspace } = useWorkspaceStore.getState();
      const _request = {
        ...payload,
        __ref: { ...payload.__ref, workspaceId: workspace.__ref.id },
      };
      state.toggleProgressBar(true);
      const res = await Rest.request
        .create(_request)
        .then((r) => {
          state.onCreateRequest(_request);
          return r;
        })
        .catch((e) => {})
        .finally(() => {
          state.toggleProgressBar(false);
        });
      return res;
    },
    deleteRequest: async (rId: string) => {
      const state = get();
      state.toggleProgressBar(true);
      const res = await Rest.request
        .delete(rId)
        .then((r) => {
          state.onDeleteRequest(rId);
          return r;
        })
        .catch((e) => {
          if (e.message == 'Network Error') {
            //TODO: show error notification
          }
        })
        .finally(() => {
          state.toggleProgressBar(false);
        });
      return res;
    },

    onCreateRequest: (request: any) => {
      set((s) => {
        s.explorer?.tdpInstance?.addRequestItem(request);
        const { collections, folders } = s.explorer;
        if (request.__ref.folderId) {
          folders.map((f) => {
            if (f.__ref.id == request.__ref.folderId) {
              f.__meta.rOrders.push(request.__ref.id);
            }
          });
        } else if (request.__ref.collectionId) {
          collections.map((c) => {
            if (c.__ref.id == request.__ref.collectionId) {
              c.__meta.rOrders.push(request.__ref.id);
            }
          });
        }
        return {
          explorer: {
            ...s.explorer,
            collections,
            folders,
            requests: [...s.explorer.requests, request],
          },
        };
      });
    },
    onUpdateRequest: (request: any) => {
      set((s) => {
        s.explorer.tdpInstance?.updateRequestItem(request);
        const requests = s.explorer.requests.map((r) => {
          if (r.__ref.id == request.__ref.id)
            r = { ...r, __meta: { ...r.__meta, name: request.__meta.name } }; //note: this condition is used considering only renaming use case
          return r;
        });
        return { explorer: { ...s.explorer, requests } };
      });
    },
    onDeleteRequest: (request: TId | any) => {
      const rId = typeof request == 'string' ? request : request.__ref.id;
      set((s) => {
        const requests = s.explorer.requests.filter((r) => r.__ref.id != rId);
        s.explorer.tdpInstance?.deleteRequestItem(rId);
        return { explorer: { ...s.explorer, requests } };
      });
    },

    //organization
    // create a new workspace #v3
    createOrg: async (payload: TCreateOrgPayload) => {
      return Rest.organization.create(payload).then((res) => res.data);
    },
    // check the org name is available or not
    checkOrgNameAvailability: (name: string) => {
      return Rest.organization.availability({ name });
    },

    /** change collection orders in workspace */
    changeWorkspaceMetaOrders: async (itemId, position) => {
      const state = get();
      const { workspace, setWorkspace } = useWorkspaceStore.getState();
      state.toggleProgressBar(true);
      const res = await Rest.workspace
        .changeMetaOrders(workspace.__ref.id, itemId, position)
        .then((r) => r.data)
        .then(({ cOrders }) => {
          setWorkspace({
            ...workspace,
            __meta: { ...workspace.__meta, cOrders },
          } as IWorkspace);
        })
        .catch((e) => {
          if (e.message == 'Network Error') {
            //TODO: show error notification
          } else {
            // TODO show error
          }
        })
        .finally(() => {
          state.toggleProgressBar(false);
        });
      return res;
    },

    /** change folder and requests orders in collection */
    changeCollectionChildrenPosition: async (
      colId,
      itemId,
      position,
      itemType
    ) => {
      const state = get();
      state.toggleProgressBar(true);
      const res = await Rest.collection
        .changeChildrenPosition(colId, itemId, position, itemType)
        .then((r) => r.data)
        .then(({ fOrders, rOrders }) => {
          set((s) => {
            const { collections } = s.explorer;
            collections.map((c) => {
              if (c.__ref.id == colId) {
                if (Array.isArray(fOrders)) c.__meta.fOrders = fOrders;
                if (Array.isArray(rOrders)) c.__meta.rOrders = rOrders;
              }
              return c;
            });
            return { explorer: { ...s.explorer, collections } };
          });
        })
        .catch((e) => {
          if (e.message == 'Network Error') {
            //TODO: show error notification
          } else {
            // TODO show error
          }
        })
        .finally(() => {
          state.toggleProgressBar(false);
        });
      return res;
    },

    /** change folder and requests orders in folder */
    changeFolderChildrenPosition: async (folId, itemId, position, itemType) => {
      const state = get();
      state.toggleProgressBar(true);
      const res = await Rest.folder
        .changeChildrenPosition(folId, itemId, position, itemType)
        .then((r) => r.data)
        .then(({ fOrders, rOrders }) => {
          set((s) => {
            const { folders } = s.explorer;
            folders.map((f) => {
              if (f.__ref.id == folId) {
                if (Array.isArray(fOrders)) f.__meta.fOrders = fOrders;
                if (Array.isArray(rOrders)) f.__meta.rOrders = rOrders;
              }
              return f;
            });
            return { explorer: { ...s.explorer, folders } };
          });
        })
        .catch((e) => {
          if (e.message == 'Network Error') {
            //TODO: show error notification
          } else {
            // TODO show error
          }
        })
        .finally(() => {
          state.toggleProgressBar(false);
        });
      return res;
    },

    /** move folder */
    moveFolder: async (
      folderId: TId,
      to: { collectionId: string; folderId?: string }
    ) => {
      const state = get();
      state.toggleProgressBar(true);
      const res = await Rest.folder
        .move(folderId, to)
        .then(() => {
          state.fetchExplorer();
        })
        .catch((e) => {
          if (e.message == 'Network Error') {
            //TODO: show error notification
          } else {
            // TODO show error
          }
        })
        .finally(() => {
          state.toggleProgressBar(false);
        });
      return res;
    },

    /** move request */
    moveRequest: async (
      requestId: TId,
      to: { collectionId: string; folderId?: string }
    ) => {
      const state = get();
      state.toggleProgressBar(true);

      // console.log(requestId, to, 'move request...')
      const res = await Rest.request
        .move(requestId, to)
        .then(() => {
          state.fetchExplorer();
        })
        .catch((e) => {
          if (e.message == 'Network Error') {
            //TODO: show error notification
          } else {
            // TODO show error
          }
        })
        .finally(() => {
          state.toggleProgressBar(false);
        });
      return res;
    },

    // dispose whole store and reset to initial state
    dispose: () => {
      set((s) => {
        s.explorer?.tdpInstance?.init([], [], [], []);
        return {
          ...initialState,
          explorer: {
            ...initialState.explorer,
            tdpInstance: s.explorer.tdpInstance,
          },
        };
      });
    },
  }))
);

type TCreateOrgPayload = { name: string };
