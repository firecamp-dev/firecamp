import { IWebSocketMessage, IRequestFolder, TId } from '@firecamp/types';

interface ICollection {
  items?: Array<IWebSocketMessage>;
  folders?: Array<IRequestFolder>;
}

interface ICollectionSlice {
  collection: ICollection;

  initialiseConnection: (collection: ICollection) => void; // TODO: rename API
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

  // collection
  initialiseConnection: (collection: ICollection) => {},
  updateCollection: (
    key: string,
    value: Array<IWebSocketMessage> | Array<IRequestFolder>
  ) => {
    set((s) => ({
      ...s,
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
      ...s,
      collection: {
        ...s.collection,
        messages: [...s.collection.messages, message],
      },
    }));

    // prepare push action for insert message
    state.prepareCollectionMessagesPushAction(message.__ref?.id, 'i');
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
        ...s,
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
      // Prepare push action for update message
      state.prepareCollectionMessagesPushAction(
        id,
        'u',
        lastMessage,
        updatedMessage
      );
    }
  },
  deleteMessage: (id: TId) => {
    const state = get();
    const messageDetails = state.getMessage(id);

    // If message found then update in store
    if (messageDetails && messageDetails.messageIndex !== -1) {
      set((s) => ({
        ...s,
        collection: {
          ...s.collection,
          messages: [
            ...s.collection.messages.slice(0, messageDetails.messageIndex),
            ...s.collection.messages.slice(messageDetails.messageIndex + 1),
          ],
        },
      }));
      // prepare push action for delete message
      state.prepareCollectionMessagesPushAction(id, 'd');
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
        ...s,
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
      // prepare push action for update message
      state.prepareCollectionMessagesPushAction(
        id,
        'u',
        lastMessage,
        updatedMessage
      );
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
      ...s,
      collection: {
        ...s.collection,
        directories: [...s.collection.directories, directory],
      },
    }));

    // Prepare push action for insert message
    state.prepareCollectionDirectoriesPushAction(directory?.__ref?.id, 'i');
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

      const lastDirectory = state.getDirectory(id, true);
      // Prepare push action for update message
      state.prepareCollectionDirectoriesPushAction(
        id,
        'u',
        lastDirectory,
        updatedDirectory
      );
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

      // prepare push action for delete directory
      state.prepareCollectionDirectoriesPushAction(id, 'd');
    }
  },
});

export { ICollection, ICollectionSlice, createCollectionSlice };
