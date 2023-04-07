import { nanoid } from 'nanoid';
import { TId, ISocketIOEmitter, IRequestFolder } from '@firecamp/types';
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
  toggleProgressBar: (flag?: boolean) => void;
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
  deleteFolder: (id: TId) => void;
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
  },

  isCollectionEmpty: () => {
    const { folders, items } = get().collection;
    return folders.length == 0 && items.length == 0;
  },

  // register TreeDatProvider instance
  // register TreeDatProvider instance
  registerTDP: () => {
    set((s) => {
      const rootOrders = [
        ...s.request.__meta.fOrders,
        ...s.request.__meta.iOrders,
      ];
      console.log(rootOrders, 'rootOrders... registerTDP');
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
      playgrounds,
      runtime: { activePlayground },
    } = state;
    const emitter = playgrounds[activePlayground]?.emitter;
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
    // state.toggleProgressBar(true);
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
        // state.openEmitterInPlayground(res.__ref.id);
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
      runtime: { activePlayground },
      playgrounds,
    } = get();
    const item = playgrounds[activePlayground].emitter;
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

    const {
      playgrounds,
      runtime: { activePlayground },
      changePlaygroundTab,
    } = state;
    const emitter = playgrounds[activePlayground]?.emitter;
    if (emitter?.__ref.id == item.__ref.id) {
      changePlaygroundTab(activePlayground, {
        __meta: {
          isSaved: true,
          hasChange: false,
        },
      });
    }
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
    state.toggleProgressBar(true);
    return _folder;
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
    set((s) => {
      const folders = s.collection.folders.filter((f) => f.__ref.id != id);
      return {
        collection: {
          ...s.collection,
          ...folders,
        },
      };
    });
  },
});

export { ICollection, ICollectionSlice, createCollectionSlice };
