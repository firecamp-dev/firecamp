import {
  ISocketIOEmitter,
  IRequestFolder,
  TId,
  EArgumentBodyType,
} from '@firecamp/types';
import { nanoid } from 'nanoid';
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
  updateCollection: (
    key: string,
    value: Array<ISocketIOEmitter> | Array<IRequestFolder>
  ) => void;

  // emitter
  getEmitter: (
    id: TId
  ) => { emitter: ISocketIOEmitter; emitterIndex: number } | undefined;
  addEmitter: (obj: { name: string; label?: string }, folderId: TId) => void;
  changeEmitter: (id: TId, updates: { key: string; value: any }) => void;
  deleteEmitter: (id: TId) => void;
  setEmitter: (id: TId, emitterToSet: ISocketIOEmitter) => void; // TODO: check usage

  // folders
  getFolder: (
    id: TId
  ) => { folder: IRequestFolder; folderIndex: number } | undefined;
  addFolder: (folder: IRequestFolder) => void;
  changeFolder: (id: TId, updates: { key: string; value: any }) => void;
  deleteFolder: (id: TId) => void;
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

  updateCollection: (
    key: string,
    value: Array<ISocketIOEmitter> | Array<IRequestFolder>
  ) => {
    set((s) => ({
      collection: {
        ...s.collection,
        [key]: value,
      },
    }));
  },

  // emitter

  getEmitter: (id: TId, getLast = false) => {
    const state = get();
    // existing emitters
    const emitters = getLast
      ? state.last?.collection?.emitters
      : state.collection?.emitters;

    // emitter index
    const emitterIndex = emitters.findIndex(
      (emitter) => emitter?.__ref.id === id
    );

    // If emitter found then update in store
    if (emitterIndex !== -1) {
      return { emitter: emitters[emitterIndex], emitterIndex };
    }
    return undefined;
  },

  addEmitter: ({ name, label }, folderId?: TId) => {
    const state = get();
    const emitterId = nanoid();
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
        id: emitterId,
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

  changeEmitter: (id: TId, updates: { key: string; value: any }) => {
    const state = get();
    const emitterDetails = state.getEmitter(id);

    // If emitter found then update in store
    if (
      emitterDetails &&
      emitterDetails.emitter &&
      emitterDetails.emitterIndex !== -1
    ) {
      const { key, value } = updates;
      const { emitter, emitterIndex } = emitterDetails;
      const updatedEmitter = Object.assign({}, emitter, {
        [key]: value,
      });

      set((s) => ({
        collection: {
          ...s.collection,
          emitters: [
            ...s.collection.emitters.slice(0, emitterIndex),
            updatedEmitter,
            ...s.collection.emitters.slice(emitterIndex + 1),
          ],
        },
      }));

      const lastEmitter = state.getEmitter(id, true);
      // state.prepareCollectionEmittersPushAction(
      //   id,
      //   'u',
      //   lastEmitter,
      //   updatedEmitter
      // );
    }
  },

  deleteEmitter: (id: TId) => {
    const state = get();
    const emitterDetails = state.getEmitter(id);

    // If emitter found then update in store
    if (emitterDetails && emitterDetails.emitterIndex !== -1) {
      set((s) => ({
        collection: {
          ...s.collection,
          emitters: [
            ...s.collection.emitters.slice(0, emitterDetails.emitterIndex),
            ...s.collection.emitters.slice(emitterDetails.emitterIndex + 1),
          ],
        },
      }));
      // state.prepareCollectionEmittersPushAction(id, 'd');
    }
  },

  setEmitter: (id: TId, emitterToSet: ISocketIOEmitter) => {
    const state = get();
    const emitterDetails = state.getEmitter(id);

    // If emitter found then update in store
    if (
      emitterDetails &&
      emitterDetails.emitter &&
      emitterDetails.emitterIndex !== -1
    ) {
      const { emitter, emitterIndex } = emitterDetails;
      const updatedEmitter = Object.assign({}, emitter, emitterToSet);

      set((s) => ({
        collection: {
          ...s.collection,
          emitters: [
            ...s.collection.emitters.slice(0, emitterIndex),
            updatedEmitter,
            ...s.collection.emitters.slice(emitterIndex + 1),
          ],
        },
      }));

      const lastEmitter = state.getEmitter(id, true);
      // state.prepareCollectionEmittersPushAction(
      //   id,
      //   'u',
      //   lastEmitter,
      //   updatedEmitter
      // );
    }
  },

  // folders
  getFolder: (id: TId, getLast = false) => {
    const state = get();
    // existing folders
    const folders = getLast
      ? state.last?.collection?.folders
      : state.collection?.folders;

    // folder index
    const folderIndex = folders.findIndex(
      (folder: IRequestFolder) => folder?.__ref.id === id
    );

    // If folder found then update in store
    if (folderIndex !== -1) {
      return { folder: folders[folderIndex], folderIndex };
    }

    return undefined;
  },

  addFolder: (folder: IRequestFolder) => {
    const state = get();
    if (!folder?.__ref.id) return;

    set((s) => ({
      collection: {
        ...s.collection,
        folders: [...s.collection.folders, folder],
      },
    }));
    // state.prepareCollectionDirectoriesPushAction(folder?.__ref.id, 'i');
  },

  changeFolder: (id: TId, updates: { key: string; value: any }) => {
    const state = get();
    const folderDetails = state.getFolder(id);

    // If folder found then update in store
    if (
      folderDetails &&
      folderDetails.folder &&
      folderDetails.folderIndex !== -1
    ) {
      const { key, value } = updates;
      const { folder, folderIndex } = folderDetails;
      const updatedFolder = Object.assign({}, folder, {
        [key]: value,
      });

      set((s) => ({
        collection: {
          ...s.collection,
          folders: [
            ...s.collection.folders.slice(0, folderIndex),
            updatedFolder,
            ...s.collection.folders.slice(folderIndex + 1),
          ],
        },
      }));
      // prepare push action for update emitter
      // state.prepareCollectionDirectoriesPushAction(
      //   id,
      //   'u',
      //   lastFolder,
      //   updatedFolder
      // );
    }
  },

  deleteFolder: (id: TId) => {
    const state = get();
    const folderDetails = state.getFolder(id);

    // If folder found then update in store
    if (folderDetails && folderDetails.folderIndex !== -1) {
      set((s) => ({
        ...s,
        collection: {
          ...s.collection,
          folders: [
            ...s.collection.folders.slice(0, folderDetails.folderIndex),
            ...s.collection.folders.slice(folderDetails.folderIndex + 1),
          ],
        },
      }));
      // state.prepareCollectionDirectoriesPushAction(id, 'd');
    }
  },
});

export { ICollection, ICollectionSlice, createCollectionSlice };
