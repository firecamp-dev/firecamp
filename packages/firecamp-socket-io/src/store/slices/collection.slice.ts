import { nanoid } from 'nanoid';
import {
  TId,
  ISocketIOEmitter,
  IRequestFolder,
  EArgumentBodyType,
} from '@firecamp/types';
import { TStoreSlice } from '../store.type';
import { TreeDataProvider } from '../../components/sidebar-panel/tabs/collection-tree/TreeDataProvider';

interface ICollection {
  isProgressing?: boolean;
  tdpInstance?: any;
  items?: Partial<ISocketIOEmitter & { __ref: { isItem?: boolean } }>[];
  folders?: Partial<IRequestFolder & { __ref: { isFolder?: boolean } }>[];
  /**
   * increate the number on each action/event happens within collection
   * react component will not re-render when tdpIntance will change in store, at that time update __manualUpdates to re-render the compoenent
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
  getItem: (id: TId) => ISocketIOEmitter;
  addItem: (obj: { name: string; label?: string }, folderId: TId) => void;
  deleteItem: (id: TId) => void;

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
    return item;
  },
  addItem: ({ name, label }, folderId?: TId) => {
    const state = get();
    const {
      runtime: { activePlayground },
      playgrounds,
    } = state;
    const emitter = playgrounds[activePlayground]?.emitter;

    const item = {
      name,
      value: emitter.value,
      __meta: { ...emitter.__meta, label },
      __ref: {
        ...emitter.__ref,
        id: nanoid(),
        folderId,
      },
    };

    set((s) => ({
      collection: {
        ...s.collection,
        items: [...s.collection.items, item],
      },
    }));

    state.changePlaygroundTab(activePlayground, {
      __meta: {
        isSaved: true,
        hasChange: false,
      },
    });

    // TODO: Update parent orders on add emitter
    // TODO: check update playground emitter
    // TODO: check update active emitter
    // TODO: update request
  },
  deleteItem: (id: TId) => {
    set((s) => {
      const items = s.collection.items.filter((i) => i.__ref.id != id);
      return {
        collection: {
          ...s.collection,
          ...items,
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
