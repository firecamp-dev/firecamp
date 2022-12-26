import { nanoid } from 'nanoid';
import {
  TId,
  ISocketIOEmitter,
  IRequestFolder,
  EArgumentBodyType,
} from '@firecamp/types';
import { TStoreSlice } from '../store.type';

interface ICollection {
  isProgressing?: boolean;
  tdpInstance?: any;
  items?: Partial<ISocketIOEmitter & { __ref: { isItem?: boolean } }>[];
  folders?: Partial<IRequestFolder & { __ref: { isFolder?: boolean } }>[];
}

interface ICollectionSlice {
  collection: ICollection;
  toggleProgressBar: (flag?: boolean) => void;
  registerTDP: (instance: any) => void;
  unRegisterTDP: () => void;
  initialiseCollection: (collection: ICollection) => void;

  // emitter
  getItem: (id: TId) => ISocketIOEmitter;
  addItem: (obj: { name: string; label?: string }, folderId: TId) => void;
  deleteItem: (id: TId) => void;

  // folders
  getFolder: (id: TId) => IRequestFolder;
  createFolder: (name: string, parentFolderId: TId) => void;
  deleteFolder: (id: TId) => void;
  onCreateFolder: (folder: IRequestFolder) => void;
}

const createCollectionSlice: TStoreSlice<> = (
  set,
  get,
  initialCollection: ICollection
) => ({
  collection: initialCollection || {
    folders: [],
    items: [],
  },

  // register TreeDatProvider instance
  registerTDP: (instance: any) => {
    set((s) => ({ collection: { ...s.collection, tdpInstance: instance } }));
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
    state.collection.tdpInstance?.init(
      collection.folders || [],
      collection.items || [],
      [...state.request.__meta.fOrders, ...state.request.__meta.iOrders]
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
    if (
      [EArgumentBodyType.NoBody, EArgumentBodyType.File].includes(
        emitter.__meta.type
      )
    ) {
      return;
    }

    const item = {
      ...emitter,
      name,
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
  getFolder: (id: TId, getLast = false) => {
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
        },
      };
    });
  },
});

export { ICollection, ICollectionSlice, createCollectionSlice };
