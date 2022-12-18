import { TId, IWebSocketMessage, IRequestFolder } from '@firecamp/types';
import { nanoid } from 'nanoid';

interface ICollection {
  isProgressing?: boolean;
  tdpInstance?: any;
  items?: Partial<IWebSocketMessage & { __ref: { isItem?: boolean } }>[];
  folders?: Partial<IRequestFolder & { __ref: { isFolder?: boolean } }>[];
}

interface ICollectionSlice {
  collection: ICollection;

  toggleProgressBar: (flag?: boolean) => void;
  registerTDP: (instance: any) => void;
  unRegisterTDP: () => void;

  initialiseCollection: (collection: ICollection) => void; // TODO: rename API

  // message
  getItem: (id: TId) => IWebSocketMessage | undefined;
  addItem: (message: IWebSocketMessage) => void;
  deleteItem: (id: TId) => void;

  // folders
  getFolder: (id: TId) => IRequestFolder | undefined;
  createFolder: (folder: Partial<IRequestFolder>) => void;
  deleteFolder: (id: TId) => void;
  onCreateFolder: (folder: IRequestFolder) => void;
}

const createCollectionSlice = (
  set,
  get,
  initialCollection: ICollection
): ICollectionSlice => ({
  collection: initialCollection || {
    items: [],
    folders: [],
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
      isProgressing: typeof flag == 'boolean' ? flag : !s.isProgressing,
    }));
  },

  // collection
  initialiseCollection: (collection: ICollection) => {
    console.log(collection?.items?.length, 'collection?.items?.length...');
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
      collection.items || []
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
  createFolder: async (folder: Partial<IRequestFolder>) => {
    if (!folder?.__ref?.id) return;
    const state = get();
    const _folder = {
      name: folder?.name,
      // @ts-ignore
      description: folder?.description,
      __ref: {
        id: nanoid(),
        workspaceId: state.workspace.__ref.id,
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
      s.collection.tdpInstance?.addFolderItem(folder);
      const { folders } = s.collection;
      if (folder.__ref.folderId) {
        folders.map((f) => {
          if (f.__ref.id == folder.__ref.folderId) {
            f.__meta.fOrders.push(folder.__ref.id);
          }
        });
      } else {
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
