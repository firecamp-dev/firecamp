import { nanoid } from 'nanoid';
import { TId, IWebSocketMessage, IRequestFolder } from '@firecamp/types';
import { itemPathFinder } from '@firecamp/utils/dist/misc';
import { TStoreSlice } from '../store.type';
import { TreeDataProvider } from '../../components/sidebar-panel/tabs/collection-tree/TreeDataProvider';

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

  toggleColProgressBar: (flag?: boolean) => void;
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
  onAddItem: (message: IWebSocketMessage) => void;
  updateItem: () => void;
  onUpdateItem: (message: IWebSocketMessage) => void;
  deleteItem: (id: TId) => void;
  onDeleteItem: (id: TId) => void;

  // folders
  getFolder: (id: TId) => IRequestFolder | undefined;
  prepareCreateFolderPayload: (name: string, parentFolderId: TId) => void;
  promptCreateFolder: (parentFolderId?: TId) => void;
  onCreateFolder: (folder: IRequestFolder) => void;
  deleteFolder: (id: TId) => void;
  onDeleteFolder: (id: TId) => void;
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

  toggleColProgressBar: (flag?: boolean) => {
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

  // message/item
  getItem: (id: TId) => {
    const state = get();
    const item = state.collection.items.find((i) => i.__ref?.id === id);
    return item as IWebSocketMessage;
  },
  prepareCreateItemPayload: (name: string, parentFolderId?: TId) => {
    const state = get();
    const { playground } = state;
    const _item: IWebSocketMessage = {
      name,
      value: playground.message.value,
      __meta: {
        ...playground.message.__meta,
      },
      __ref: {
        id: nanoid(),
        requestId: state.request.__ref.id,
        requestType: state.request.__meta.type,
        collectionId: state.request.__ref.collectionId,
        folderId: parentFolderId,
      },
    };
    // state.toggleColProgressBar(true);
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
        state.onAddItem(res);
        state.openMessageInPlayground(res.__ref.id);
      });
  },

  onAddItem: (item: IWebSocketMessage) => {
    const state = get();
    const { tdpInstance } = state.collection;
    if (!item.__ref?.id) return;
    tdpInstance?.addItem(item);
    set((s) => ({
      collection: {
        ...s.collection,
        items: [...s.collection.items, item],
        __manualUpdates: ++s.collection.__manualUpdates,
      },
    }));
  },
  updateItem: () => {
    const { context, onUpdateItem, playground } = get();
    const item = playground.message;
    const _item = {
      name: item.name,
      value: item.value,
      __meta: item.__meta,
      __ref: item.__ref,
    };
    context.request.updateRequestItem(_item).then((res) => {
      console.log(res, 'update request item...');
      onUpdateItem(_item);
    });
  },
  onUpdateItem: (item) => {
    const state = get();
    if (!item.__ref?.id) return;
    state.collection.tdpInstance?.updateItem(item);
    const items = state.collection.items.map((i) => {
      if (item.__ref.id == i.__ref.id) {
        return { ...i, ...item };
      }
      return i;
    });
    set((s) => ({
      collection: {
        ...s.collection,
        items,
        __manualUpdates: ++s.collection.__manualUpdates,
      },
    }));
  },
  deleteItem: (id: TId) => {
    const {
      context,
      onDeleteItem,
      collection: { items },
    } = get();
    const item = items.find((i) => i.__ref.id == id);
    if (!item) return;
    const requestId = item.__ref.requestId;
    context.request.deleteRequestItem(requestId, id).then((res) => {
      console.log(res, 'delete request item...');
      onDeleteItem(id);
    });
  },
  onDeleteItem: (id: TId) => {
    set((s) => {
      const items = s.collection.items.filter((i) => i.__ref.id != id);
      s.collection.tdpInstance?.delete(id);
      return {
        collection: {
          ...s.collection,
          items,
          __manualUpdates: ++s.collection.__manualUpdates,
        },
      };
    });
    // TODO: if item/message is opened in the playground then reset the playgroundF
  },

  // folders
  getFolder: (id: TId) => {
    const state = get();
    const folder = state.collection.folders.find((f) => f.__ref?.id === id);
    return folder;
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
    state.toggleColProgressBar(true);
    return _folder;
  },
  promptCreateFolder: async (parentFolderId) => {
    if (typeof parentFolderId != 'string') parentFolderId = undefined;
    const {
      context,
      runtime: { isRequestSaved },
      prepareCreateFolderPayload,
      onCreateFolder,
    } = get();
    if (!isRequestSaved) {
      return context.app.notify.info(
        'Please save the websocket request first.'
      );
    }
    const _folder = prepareCreateFolderPayload('', parentFolderId);
    context.request.createRequestFolderPrompt(_folder).then(onCreateFolder);
  },
  onCreateFolder: (folder) => {
    if (!folder) return;
    const state = get();
    state.toggleColProgressBar(false);
    state.collection.tdpInstance?.addFolder(folder);
    const {
      request,
      collection: { folders },
    } = state;
    if (folder.__ref.folderId) {
      folders.map((f) => {
        if (f.__ref.id == folder.__ref.folderId) {
          f.__meta.fOrders.push(folder.__ref.id);
        }
      });
    } else {
      request.__meta.fOrders = [...request.__meta.fOrders, folder.__ref.id];
    }
    set((s) => {
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
    const {
      context,
      onDeleteFolder,
      collection: { folders },
    } = get();
    const folder = folders.find((i) => i.__ref.id == id);
    if (!folder) return;
    const requestId = folder.__ref.requestId;
    context.request.deleteRequestFolder(requestId, id).then((res) => {
      console.log(res, 'delete request folder...');
      onDeleteFolder(id);
    });
  },
  onDeleteFolder: (id: TId) => {
    set((s) => {
      const folders = s.collection.folders.filter((f) => f.__ref.id != id);
      s.collection.tdpInstance?.delete(id);
      return {
        collection: {
          ...s.collection,
          folders,
          __manualUpdates: ++s.collection.__manualUpdates,
        },
      };
    });
    //TODO: if any of the messages belonging tot he folder is opened in playground then reset the playground
  },
});

export { ICollection, ICollectionSlice, createCollectionSlice };
