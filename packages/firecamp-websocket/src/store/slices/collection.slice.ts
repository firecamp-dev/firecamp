import { nanoid } from 'nanoid';
import {
  TId,
  IWebSocketMessage,
  IRequestFolder,
  EMessageBodyType,
} from '@firecamp/types';
import { TStoreSlice } from '../store.type';
import { TreeDataProvider } from '../../components/sidebar-panel/tabs/collection-tree/TreeDataProvider';
import { itemPathFinder } from '@firecamp/utils/dist/misc';

interface ICollection {
  isProgressing?: boolean;
  tdpInstance?: any;
  items?: Partial<IWebSocketMessage & { __ref: { isItem?: boolean } }>[];
  folders?: Partial<IRequestFolder & { __ref: { isFolder?: boolean } }>[];
  /**
   * in create the number on each action/event happens within collection
   * react component will not re-render when tdpInstance will change in store, at that time update __manualUpdates to re-render the component
   */
  __manualUpdates?: number;
}

interface ICollectionSlice {
  collection: ICollection;
  isCollectionEmpty: () => boolean;
  getItemPath: (itemId: TId) => string;

  toggleProgressBar: (flag?: boolean) => void;
  registerTDP: () => void;
  unRegisterTDP: () => void;

  initialiseCollection: (collection: ICollection, rootOrders?: TId[]) => void; // TODO: rename API

  // message
  getItem: (id: TId) => IWebSocketMessage | undefined;
  prepareCreateItemPayload: (
    name: string,
    parentFolderId?: TId
  ) => IWebSocketMessage;
  promptSaveItem: () => void;
  addItem: (message: IWebSocketMessage) => void;
  deleteItem: (id: TId) => void;

  // folders
  getFolder: (id: TId) => IRequestFolder | undefined;
  prepareCreateFolderPayload: (name: string, parentFolderId: TId) => void;
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

  isCollectionEmpty: () => {
    const { folders, items } = get().collection;
    return folders.length == 0 && items.length == 0;
  },

  getItemPath: (itemId: TId) => {
    const {
      collection: { items, folders },
    } = get();
    const { path } = itemPathFinder([...folders, ...items], itemId);
    return path;
  },

  // register TreeDatProvider instance
  registerTDP: () => {
    set((s) => {
      const rootOrders = [
        ...s.request.__meta.fOrders,
        ...s.request.__meta.iOrders,
      ];
      // console.log(rootOrders, 'rootOrders...');
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
  initialiseCollection: (collection: ICollection, rootOrders) => {
    // console.log(collection?.items?.length, 'collection?.items?.length...');
    const state = get();
    // console.log(state.request.__meta.fOrders, state.request.__meta.iOrders);
    set((s) => ({
      collection: {
        ...s.collection,
        ...collection,
        __manualUpdates: ++s.collection.__manualUpdates,
      },
      ui: {
        ...s.ui,
        playgrounds: collection?.items?.length,
      },
    }));
    state.collection.tdpInstance?.init(
      collection.folders || [],
      collection.items || [],
      rootOrders || [
        ...state.request.__meta.fOrders,
        ...state.request.__meta.iOrders,
      ]
    );
  },

  // message
  getItem: (id: TId) => {
    const state = get();
    const item = state.collection.items.find((i) => i.__ref?.id === id);
    return item as IWebSocketMessage;
  },
  prepareCreateItemPayload: (name: string, parentFolderId?: TId) => {
    const state = get();
    const {
      playgrounds,
      runtime: { activePlayground },
    } = state;
    const playground = playgrounds[activePlayground];
    const _item: IWebSocketMessage = {
      name,
      value: playground.message.value,
      __meta: {
        type: playground.message.__meta.type,
      },
      __ref: {
        id: nanoid(),
        requestId: state.request.__ref.id,
        requestType: state.request.__meta.type,
        collectionId: state.request.__ref.collectionId,
        folderId: parentFolderId,
      },
    };
    // state.toggleProgressBar(true);
    console.log(_item, 'prepare the item');
    return _item;
  },
  promptSaveItem: () => {
    const state = get();
    const { folders } = state.collection;
    const { fOrders: folderRootOrders } = state.request.__meta;

    // name and folderId will be added from prompt
    const item = state.prepareCreateItemPayload('', '');

    state.context.request
      .createRequestItemPrompt(item, {
        items: folders,
        rootOrders: folderRootOrders,
      })
      .then((res) => {
        console.log(res, 1111);
        state.addItem(res);
      });
  },
  addItem: (item: IWebSocketMessage) => {
    const state = get();
    const { tdpInstance } = state.collection;
    if (!item.__ref?.id) return;
    if (tdpInstance) tdpInstance.addItem(item);
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
    return folder as IRequestFolder;
  },
  prepareCreateFolderPayload: (name: string, parentFolderId?: TId) => {
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
    return _folder;
  },
  onCreateFolder: (folder) => {
    if (!folder) return;
    const state = get();
    state.toggleProgressBar(false);
    //@ts-ignore
    if (folder.__meta?.type) folder.__meta.type = 'F'; // TODO: remove it later after migration dir=>F
    set((s) => {
      s.collection.tdpInstance?.addFolder(folder);
      const { request } = s;
      const { folders } = s.collection;
      if (folder.__ref.folderId) {
        folders.map((f) => {
          if (f.__ref.id == folder.__ref.folderId) {
            f.__meta.fOrders.push(folder.__ref.id);
          }
        });
      } else {
        request.__meta.fOrders = [...request.__meta.fOrders, folder.__ref.id];
      }
      return {
        request,
        collection: {
          ...s.collection,
          folders: [...folders, folder],
          __manualUpdates: ++s.collection.__manualUpdates,
        },
      };
    });
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
});

export { ICollection, ICollectionSlice, createCollectionSlice };
