import { nanoid } from 'nanoid';
import { TId, IWebSocketMessage, IRequestFolder } from '@firecamp/types';
import { TStoreSlice } from '../store.type';
import { TreeDataProvider } from '../../components/sidebar-panel/tabs/collection-tree/TreeDataProvider';

interface ICollection {
  isProgressing?: boolean;
  tdpInstance?: any;
  items?: Partial<IWebSocketMessage & { __ref: { isItem?: boolean } }>[];
  folders?: Partial<IRequestFolder & { __ref: { isFolder?: boolean } }>[];
  /**
   * increate the number on each action/event happens within collection
   * react component will not re-render when tdpIntance will change in store, at that time update __manualUpdates to re-render the compoenent
   */
  __manualUpdates?: number;
}

interface ICollectionSlice {
  collection: ICollection;

  toggleProgressBar: (flag?: boolean) => void;
  registerTDP: () => void;
  unRegisterTDP: () => void;

  initialiseCollection: (collection: ICollection) => void; // TODO: rename API

  // message
  getItem: (id: TId) => IWebSocketMessage | undefined;
  addItem: (message: IWebSocketMessage) => void;
  deleteItem: (id: TId) => void;

  // folders
  getFolder: (id: TId) => IRequestFolder | undefined;
  createFolder: (name: string, parentFolderId: TId) => void;
  deleteFolder: (id: TId) => void;
  onCreateFolder: (folder: IRequestFolder) => void;
}

const createCollectionSlice: TStoreSlice<ICollectionSlice> = (
  set,
  get,
  initialCollection: ICollection
) => ({
  collection: initialCollection || {
    items: [],
    folders: [],
    __manualUpdates: 0,
  },

  // register TreeDatProvider instance
  registerTDP: () => {
    set((s) => {
      const rootOrders = [
        ...s.request.__meta.fOrders,
        ...s.request.__meta.iOrders,
      ];
      console.log(rootOrders, 'rootOrders...');
      const instance = new TreeDataProvider(
        s.collection.folders,
        s.collection.items,
        rootOrders
      );
      return {
        collection: {
          ...s.collection,
          tdpInstance: instance,
          __manualUpdates: ++s.collection.__manualUpdates,
        },
      };
    });
  },

  // unregister TreeDatProvider instance
  unRegisterTDP: () => {
    set((s) => ({ collection: { ...s.collection, tdpInstance: null } }));
  },

  toggleProgressBar: (flag?: boolean) => {
    set((s) => ({
      collection: {
        ...s.collection,
        isProgressing:
          typeof flag == 'boolean' ? flag : !s.collection.isProgressing,
      },
    }));
  },

  // collection
  initialiseCollection: (collection: ICollection) => {
    // console.log(collection?.items?.length, 'collection?.items?.length...');
    const state = get();
    // console.log(state.request.__meta.fOrders, state.request.__meta.iOrders);
    set((s) => ({
      collection: {
        ...s.collection,
        ...collection,
        __manualUpdates: 0,
      },
      ui: {
        ...s.ui,
        playgrounds: collection?.items?.length,
      },
    }));
    state.collection.tdpInstance?.init(
      collection.folders || [],
      collection.items || [],
      [...state.request.__meta.fOrders, ...state.request.__meta.iOrders]
    );
  },

  // message
  getItem: (id: TId) => {
    const state = get();
    const item = state.collection.items.find((i) => i.__ref?.id === id);
    return item;
  },
  addItem: (item: IWebSocketMessage) => {
    if (!item.__ref?.id) return;
    set((s) => ({
      collection: {
        ...s.collection,
        items: [...s.collection.items, item],
        __manualUpdates: ++s.collection.__manualUpdates,
      },
    }));
  },
  deleteItem: (id: TId) => {
    set((s) => {
      const items = s.collection.items.filter((i) => i.__ref.id != id);
      return {
        collection: {
          ...s.collection,
          ...items,
          __manualUpdates: ++s.collection.__manualUpdates,
        },
      };
    });
  },

  // folders
  getFolder: (id: TId) => {
    const state = get();
    const folder = state.collection.folders.find((f) => f.__ref?.id === id);
    return folder;
  },
  createFolder: async (name: string, parentFolderId?: TId) => {
    const state = get();
    const _folder: IRequestFolder = {
      name,
      __meta: { fOrders: [], iOrders: [] },
      __ref: {
        id: nanoid(),
        requestId: state.request.__ref.id,
        requestType: state.request.__meta.type,
        collectionId: state.request.__ref.collectionId,
        folderId: parentFolderId,
      },
    };
    state.toggleProgressBar(true);
    return Promise.resolve().then(() => {
      state.onCreateFolder(_folder);
    });
    // const res = await Rest.requestFolder
    //   .create(_folder)
    //   .then((r) => {
    //     state.onCreateFolder(r.data);
    //     return r;
    //   })
    //   .finally(() => {
    //     state.toggleProgressBar(false);
    //   });
    // return res;
  },
  deleteFolder: (id: TId) => {
    set((s) => {
      const folders = s.collection.folders.filter((f) => f.__ref.id != id);
      return {
        collection: {
          ...s.collection,
          ...folders,
          __manualUpdates: ++s.collection.__manualUpdates,
        },
      };
    });
  },

  onCreateFolder: (folder) => {
    //@ts-ignore
    if (folder.__meta?.type) folder.__meta.type = 'F'; // TODO: remove it later after migration dir=>F
    set((s) => {
      s.collection.tdpInstance?.addFolder(folder);
      const { folders } = s.collection;
      if (folder.__ref.folderId) {
        folders.map((f) => {
          if (f.__ref.id == folder.__ref.folderId) {
            f.__meta.fOrders.push(folder.__ref.id);
          }
        });
      } else {
        // TODO: add root folder id in request.__meta.fOrders
      }
      return {
        collection: {
          ...s.collection,
          folders: [...folders, folder],
          __manualUpdates: ++s.collection.__manualUpdates,
        },
      };
    });
  },
});

export { ICollection, ICollectionSlice, createCollectionSlice };
