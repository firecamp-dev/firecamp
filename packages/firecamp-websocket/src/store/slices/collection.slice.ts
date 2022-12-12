import { IWebSocketMessage, IRequestFolder, TId } from '@firecamp/types';

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
  updateCollection: (
    key: string,
    value: Array<IWebSocketMessage> | Array<IRequestFolder>
  ) => void;

  // message
  getMessage: (
    id: TId
  ) => { message: IWebSocketMessage; messageIndex: number } | undefined;
  addMessage: (message: IWebSocketMessage) => void;
  changeMessage: (id: TId, updates: { key: string; value: any }) => void;
  deleteMessage: (id: TId) => void;
  setMessage: (id: TId, messageToSet: IWebSocketMessage) => void; // TODO: check usage

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
  updateCollection: (
    key: string,
    value: Array<IWebSocketMessage> | Array<IRequestFolder>
  ) => {
    set((s) => ({
      collection: {
        ...s.collection,
        [key]: value,
      },
    }));
  },

  // message

  getMessage: (id: TId, getLast = false) => {
    const state = get();
    // existing messages
    const messages = getLast
      ? state.last?.collection?.messages
      : state.collection?.messages;

    // message index
    const messageIndex = messages.findIndex(
      (message) => message?.__ref?.id === id
    );

    // If message found then update in store
    if (messageIndex !== -1) {
      return { message: messages[messageIndex], messageIndex };
    }

    return undefined;
  },
  addMessage: (message: IWebSocketMessage) => {
    if (!message.__ref?.id) return;
    const state = get();
    set((s) => ({
      collection: {
        ...s.collection,
        messages: [...s.collection.messages, message],
      },
    }));

    // state.prepareCollectionMessagesPushAction(message.__ref?.id, 'i');
  },
  changeMessage: (id: TId, updates: { key: string; value: any }) => {
    const state = get();
    const messageDetails = state.getMessage(id);

    // If message found then update in store
    if (
      messageDetails &&
      messageDetails.message &&
      messageDetails.messageIndex !== -1
    ) {
      const { key, value } = updates;
      const { message, messageIndex } = messageDetails;
      const updatedMessage = Object.assign({}, message, {
        [key]: value,
      });

      set((s) => ({
        collection: {
          ...s.collection,
          messages: [
            ...s.collection.messages.slice(0, messageIndex),
            updatedMessage,
            ...s.collection.messages.slice(messageIndex + 1),
          ],
        },
      }));

      const lastMessage = state.getMessage(id, true);

      // state.prepareCollectionMessagesPushAction(
      //   id,
      //   'u',
      //   lastMessage,
      //   updatedMessage
      // );
    }
  },
  deleteMessage: (id: TId) => {
    const state = get();
    const messageDetails = state.getMessage(id);

    // If message found then update in store
    if (messageDetails && messageDetails.messageIndex !== -1) {
      set((s) => ({
        collection: {
          ...s.collection,
          messages: [
            ...s.collection.messages.slice(0, messageDetails.messageIndex),
            ...s.collection.messages.slice(messageDetails.messageIndex + 1),
          ],
        },
      }));
      // state.prepareCollectionMessagesPushAction(id, 'd');
    }
  },
  setMessage: (id: TId, messageToSet: IWebSocketMessage) => {
    const state = get();
    const messageDetails = state.getMessage(id);

    // If message found then update in store
    if (
      messageDetails &&
      messageDetails.message &&
      messageDetails.messageIndex !== -1
    ) {
      const { message, messageIndex } = messageDetails;
      const updatedMessage = Object.assign({}, message, messageToSet);

      set((s) => ({
        collection: {
          ...s.collection,
          messages: [
            ...s.collection.messages.slice(0, messageIndex),
            updatedMessage,
            ...s.collection.messages.slice(messageIndex + 1),
          ],
        },
      }));

      const lastMessage = state.getMessage(id, true);
      // state.prepareCollectionMessagesPushAction(
      //   id,
      //   'u',
      //   lastMessage,
      //   updatedMessage
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
      (directory: IRequestFolder) => directory?.__ref?.id === id
    );

    // If directory found then update in store
    if (directoryIndex !== -1) {
      return { directory: directories[directoryIndex], directoryIndex };
    }

    return undefined;
  },
  addDirectory: (directory: IRequestFolder) => {
    if (!directory?.__ref?.id) return;
    const state = get();

    set((s) => ({
      collection: {
        ...s.collection,
        directories: [...s.collection.directories, directory],
      },
    }));
    // state.prepareCollectionDirectoriesPushAction(directory?.__ref?.id, 'i');
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

      const lastDirectory = state.getDirectory(id, true);
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
