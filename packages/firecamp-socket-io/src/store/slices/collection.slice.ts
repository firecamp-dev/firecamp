import {
  ISocketIOEmitter,
  IRequestFolder,
  TId,
  EPushActionType,
} from '@firecamp/types';

interface ICollection {
  emitters?: Array<ISocketIOEmitter>;
  directories?: Array<IRequestFolder>;
}

interface ICollectionSlice {
  collection: ICollection;

  initialiseConnection: (collection: ICollection) => void; // TODO: rename API
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
    emitters: [],
    directories: [],
  },

  // collection
  initialiseConnection: (collection: ICollection) => {},
  updateCollection: (
    key: string,
    value: Array<ISocketIOEmitter> | Array<IRequestFolder>
  ) => {
    set((s) => ({
      ...s,
      collection: {
        ...s.collection,
        [key]: value,
      },
    }));
  },

  // emitter

  getEmitter: (id: TId, getLast = false) => {
    // existing emitters
    let emitters = getLast
      ? get()?.last?.collection?.emitters
      : get().collection?.emitters;

    // emitter index
    let emitterIndex = emitters.findIndex(
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

    set((s) => ({
      ...s,
      collection: {
        ...s.collection,
        emitters: [...s.collection.emitters, emitter],
      },
    }));

    // Prepare push action for insert emitter
    get()?.prepareCollectionEmittersPushAction(
      emitter?.__ref.id,
      EPushActionType.Insert
    );
  },
  changeEmitter: (id: TId, updates: { key: string; value: any }) => {
    let emitterDetails = get().getEmitter(id);

    // If emitter found then update in store
    if (
      emitterDetails &&
      emitterDetails.emitter &&
      emitterDetails.emitterIndex !== -1
    ) {
      let { key, value } = updates;
      let { emitter, emitterIndex } = emitterDetails;
      let updatedEmitter = Object.assign({}, emitter, {
        [key]: value,
      });

      set((s) => ({
        ...s,
        collection: {
          ...s.collection,
          emitters: [
            ...s.collection.emitters.slice(0, emitterIndex),
            updatedEmitter,
            ...s.collection.emitters.slice(emitterIndex + 1),
          ],
        },
      }));

      let lastEmitter = get().getEmitter(id, true);
      // Prepare push action for update emitter
      get()?.prepareCollectionEmittersPushAction(
        id,
        EPushActionType.Update,
        lastEmitter,
        updatedEmitter
      );
    }
  },
  deleteEmitter: (id: TId) => {
    let emitterDetails = get().getEmitter(id);

    // If emitter found then update in store
    if (emitterDetails && emitterDetails.emitterIndex !== -1) {
      set((s) => ({
        ...s,
        collection: {
          ...s.collection,
          emitters: [
            ...s.collection.emitters.slice(0, emitterDetails.emitterIndex),
            ...s.collection.emitters.slice(emitterDetails.emitterIndex + 1),
          ],
        },
      }));
      // Prepare push action for delete emitter
      get()?.prepareCollectionEmittersPushAction(id, EPushActionType.Delete);
    }
  },
  setEmitter: (id: TId, emitterToSet: ISocketIOEmitter) => {
    let emitterDetails = get().getEmitter(id);

    // If emitter found then update in store
    if (
      emitterDetails &&
      emitterDetails.emitter &&
      emitterDetails.emitterIndex !== -1
    ) {
      let { emitter, emitterIndex } = emitterDetails;
      let updatedEmitter = Object.assign({}, emitter, emitterToSet);

      set((s) => ({
        ...s,
        collection: {
          ...s.collection,
          emitters: [
            ...s.collection.emitters.slice(0, emitterIndex),
            updatedEmitter,
            ...s.collection.emitters.slice(emitterIndex + 1),
          ],
        },
      }));

      let lastEmitter = get().getEmitter(id, true);
      // Prepare push action for update emitter
      get()?.prepareCollectionEmittersPushAction(
        id,
        EPushActionType.Update,
        lastEmitter,
        updatedEmitter
      );
    }
  },

  // directories
  getDirectory: (id: TId, getLast = false) => {
    // existing directories
    let directories = getLast
      ? get()?.last?.collection?.directories
      : get().collection?.directories;

    // directory index
    let directoryIndex = directories.findIndex(
      (directory: IRequestFolder) => directory?.__ref.id === id
    );

    // If directory found then update in store
    if (directoryIndex !== -1) {
      return { directory: directories[directoryIndex], directoryIndex };
    }

    return undefined;
  },
  addDirectory: (directory: IRequestFolder) => {
    if (!directory?.__ref.id) return;

    set((s) => ({
      ...s,
      collection: {
        ...s.collection,
        directories: [...s.collection.directories, directory],
      },
    }));

    // Prepare push action for insert emitter
    get()?.prepareCollectionDirectoriesPushAction(
      directory?.__ref.id,
      EPushActionType.Insert
    );
  },
  changeDirectory: (id: TId, updates: { key: string; value: any }) => {
    let directoryDetails = get().getDirectory(id);

    // If directory found then update in store
    if (
      directoryDetails &&
      directoryDetails.directory &&
      directoryDetails.directoryIndex !== -1
    ) {
      let { key, value } = updates;
      let { directory, directoryIndex } = directoryDetails;
      let updatedDirectory = Object.assign({}, directory, {
        [key]: value,
      });

      set((s) => ({
        ...s,
        collection: {
          ...s.collection,
          directories: [
            ...s.collection.directories.slice(0, directoryIndex),
            updatedDirectory,
            ...s.collection.directories.slice(directoryIndex + 1),
          ],
        },
      }));

      let lastDirectory = get().getDirectory(id, true);
      // Prepare push action for update emitter
      get()?.prepareCollectionDirectoriesPushAction(
        id,
        EPushActionType.Update,
        lastDirectory,
        updatedDirectory
      );
    }
  },
  deleteDirectory: (id: TId) => {
    let directoryDetails = get().getDirectory(id);

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

      // Prepare push action for delete directory
      get()?.prepareCollectionDirectoriesPushAction(id, EPushActionType.Delete);
    }
  },
});

export { ICollection, ICollectionSlice, createCollectionSlice };
