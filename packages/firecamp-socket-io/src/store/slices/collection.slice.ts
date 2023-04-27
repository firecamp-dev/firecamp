import { nanoid } from 'nanoid';
import { itemPathFinder } from '@firecamp/utils/dist/misc';
import {
  TId,
  ISocketIOEmitter,
  IRequestFolder,
  ERequestTypes,
} from '@firecamp/types';
import { TStoreSlice } from '../store.type';
import { TreeDataProvider } from '../../components/sidebar-panel/panes/collection-tree/TreeDataProvider';

interface ICollection {
  isProgressing?: boolean;
  tdpInstance?: any;
  items?: Partial<ISocketIOEmitter & { __ref: { isItem?: boolean } }>[];
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
  initialiseCollection: (collection: ICollection) => void;

  // emitter
  getItem: (id: TId) => ISocketIOEmitter | any;
  prepareCreateItemPayload: (
    label?: string,
    folderId?: TId
  ) => ISocketIOEmitter;
  promptSaveItem: () => void;
  onAddItem: (message: ISocketIOEmitter) => void;
  updateItem: () => void;
  onUpdateItem: (message: ISocketIOEmitter) => void;
  deleteItem: (id: TId) => void;
  onDeleteItem: (id: TId) => void;

  // folders
  getFolder: (id: TId) => IRequestFolder;
  prepareCreateFolderPayload: (name: string, parentFolderId: TId) => void;
  promptCreateFolder: (parentFolderId?: TId) => void;
  deleteFolder: (id: TId) => void;
  onDeleteFolder: (id: TId) => void;

  onCreateFolder: (folder: IRequestFolder) => void;
}

const createCollectionSlice: TStoreSlice<ICollectionSlice> = (
  set,
  get,
  initialCollection: ICollection
) => ({
  collection: initialCollection || {
    folders: [],
    items: [],
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
      // console.log(rootOrders, 'rootOrders... registerTDP');
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
        isProgressing: !s.collection.isProgressing,
      },
    }));
  },

  // collection
  initialiseCollection: (collection: ICollection) => {
    // console.log(collection?.items?.length, 'collection?.items?.length...');
    const state = get();
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
    const rootOrders = [
      ...state.request.__meta.fOrders,
      ...state.request.__meta.iOrders,
    ];
    console.log(rootOrders, 'rootOrders... initialiseCollection');
    state.collection.tdpInstance?.init(
      collection.folders || [],
      collection.items || [],
      rootOrders
    );
  },

  // emitter
  getItem: (id: TId) => {
    const state = get();
    const item = state.collection.items.find((i) => i.__ref?.id === id);
    return item as ISocketIOEmitter;
  },
  prepareCreateItemPayload: (label, folderId?: TId) => {
    const state = get();
    const {
      playground: { emitter },
    } = state;

    const _item: ISocketIOEmitter = {
      name: emitter.name,
      value: emitter.value,
      __meta: {
        ...emitter.__meta,
        label,
      },
      __ref: {
        ...emitter.__ref,
        id: nanoid(),
        requestId: state.request.__ref.id,
        requestType: state.request.__meta.type,
        collectionId: state.request.__ref.collectionId,
        folderId,
      },
    };
    // state.toggleColProgressBar(true);
    console.log(_item, 'prepare the item');
    return _item;
  },
  promptSaveItem: () => {
    const state = get();
    if (!state.runtime.isRequestSaved) {
      state.context.app.notify.info('Please save the socket.io request first.');
      return;
    }
    // label and folderId will be added from prompt
    const item = state.prepareCreateItemPayload('', '');
    if (!item.name) return;
    const { folders } = state.collection;
    const { fOrders: folderRootOrders } = state.request.__meta;

    state.context.request
      .createRequestItemPrompt(
        item,
        { items: folders, rootOrders: folderRootOrders },
        {
          header: 'Create Emitter',
          label: `Type Label for the emitter - "${item.name}"`,
        }
      )
      .then((res) => {
        console.log(res, 1111);
        state.onAddItem(res);
        state.openEmitterInPlayground(res.__ref.id, true);
      });
  },

  addItem: async (addSilently = false) => {
    const state = get();
    const { emitter } = state.playground;
    if (!emitter.name) return;

    const item: ISocketIOEmitter = {
      name: emitter.name,
      value: emitter.value,
      __meta: emitter.__meta,
      __ref: {
        id: nanoid(),
        requestId: state.request.__ref.id,
        requestType: ERequestTypes.SocketIO,
        collectionId: state.request.__ref.collectionId,
      },
    };

    await state.context.request
      .createRequestItem(item)
      .then((_item) => {
        set((s) => {
          console.log(_item);
          const newItem = { ..._item, value: _item.value };
          const items = [...s.collection.items, newItem];
          s.collection.tdpInstance?.addItem(newItem);
          return {
            collection: {
              ...s.collection,
              items,
              __manualUpdates: ++s.collection.__manualUpdates,
            },
            playground: {
              ...s.playground,
              emitter: newItem,
            },
          };
        });
        return _item;
      })
      .then((_item) => {
        state.openEmitterInPlayground(_item.__ref.id, true);
        if (addSilently == true) return;
        state.context.app.notify.success(
          'The message has been saved successfully'
        );
      })
      .catch((e) => {
        console.log(e);
        if (e.message == 'Network Error') {
          //TODO: show error notification
        }
        state.context.app.notify.alert(e.response?.data.message || e.message);
      })
      .finally(() => {
        state.toggleColProgressBar(false);
      });
  },
  onAddItem: (item: ISocketIOEmitter) => {
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
    const {
      context,
      onUpdateItem,
      playground: { emitter: item },
    } = get();
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
    state.checkPlaygroundEquality();
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
    state.toggleColProgressBar(true);
    return _folder;
  },

  promptCreateFolder: async (parentFolderId?: TId) => {
    if (typeof parentFolderId != 'string') parentFolderId = undefined;
    const {
      context,
      runtime: { isRequestSaved },
      prepareCreateFolderPayload,
      onCreateFolder,
    } = get();
    if (!isRequestSaved) {
      return context.app.notify.info(
        'Please save the socket.io request first.'
      );
    }
    const _folder = prepareCreateFolderPayload('', parentFolderId);
    context.request.createRequestFolderPrompt(_folder).then(onCreateFolder);
  },

  onCreateFolder: (folder) => {
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
      s.collection.tdpInstance?.deleteItem(id);
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
