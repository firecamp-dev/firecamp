import { ISocketIOEmitter, IRequestFolder, TId } from '@firecamp/types';

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
  addEmitter: (emitter: ISocketIOEmitter) => void;
  changeEmitter: (id: TId, updates: { key: string; value: any }) => void;
  deleteEmitter: (id: TId) => void;
  setEmitter: (id: TId, emitterToSet: ISocketIOEmitter) => void; // TODO: check usage

  // directories
  getDirectory: (
    id: TId
  ) => { directory: IRequestFolder; directoryIndex: number } | undefined;
  addDirectory: (directory: IRequestFolder) => void;
  changeDirectory: (id: TId, updates: { key: string; value: any }) => void;
  deleteDirectory: (id: TId) => void;
}

const createCollectionSlice = (
  set,
  get,
  initialCollection: ICollection
): ICollectionSlice => ({
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
  addEmitter: (emitter: ISocketIOEmitter) => {
    if (!emitter?.__ref.id) return;
    const state = get();

    set((s) => ({
      collection: {
        ...s.collection,
        emitters: [...s.collection.emitters, emitter],
      },
    }));
    // state.prepareCollectionEmittersPushAction(emitter?.__ref.id, 'i');
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

  // directories
  getDirectory: (id: TId, getLast = false) => {
    const state = get();
    // existing directories
    const directories = getLast
      ? state.last?.collection?.directories
      : state.collection?.directories;

    // directory index
    const directoryIndex = directories.findIndex(
      (directory: IRequestFolder) => directory?.__ref.id === id
    );

    // If directory found then update in store
    if (directoryIndex !== -1) {
      return { directory: directories[directoryIndex], directoryIndex };
    }

    return undefined;
  },
  addDirectory: (directory: IRequestFolder) => {
    const state = get();
    if (!directory?.__ref.id) return;

    set((s) => ({
      collection: {
        ...s.collection,
        directories: [...s.collection.directories, directory],
      },
    }));
    // state.prepareCollectionDirectoriesPushAction(directory?.__ref.id, 'i');
  },
  changeDirectory: (id: TId, updates: { key: string; value: any }) => {
    const state = get();
    const directoryDetails = state.getDirectory(id);

    // If directory found then update in store
    if (
      directoryDetails &&
      directoryDetails.directory &&
      directoryDetails.directoryIndex !== -1
    ) {
      const { key, value } = updates;
      const { directory, directoryIndex } = directoryDetails;
      const updatedDirectory = Object.assign({}, directory, {
        [key]: value,
      });

      set((s) => ({
        collection: {
          ...s.collection,
          directories: [
            ...s.collection.directories.slice(0, directoryIndex),
            updatedDirectory,
            ...s.collection.directories.slice(directoryIndex + 1),
          ],
        },
      }));
      // prepare push action for update emitter
      // state.prepareCollectionDirectoriesPushAction(
      //   id,
      //   'u',
      //   lastDirectory,
      //   updatedDirectory
      // );
    }
  },
  deleteDirectory: (id: TId) => {
    const state = get();
    const directoryDetails = state.getDirectory(id);

    // If directory found then update in store
    if (directoryDetails && directoryDetails.directoryIndex !== -1) {
      set((s) => ({
        ...s,
        collection: {
          ...s.collection,
          directories: [
            ...s.collection.directories.slice(
              0,
              directoryDetails.directoryIndex
            ),
            ...s.collection.directories.slice(
              directoryDetails.directoryIndex + 1
            ),
          ],
        },
      }));
      // state.prepareCollectionDirectoriesPushAction(id, 'd');
    }
  },
});

export { ICollection, ICollectionSlice, createCollectionSlice };
