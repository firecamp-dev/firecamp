import {
  IWebSocketMessage,
  IDirectory,
  TId,
  EPushActionType,
} from '@firecamp/types';

interface ICollection {
  messages?: Array<IWebSocketMessage>;
  directories?: Array<IDirectory>;
}

interface ICollectionSlice {
  collection: ICollection;

  initialiseConnection: (collection: ICollection) => void; // TODO: rename API
  updateCollection: (
    key: string,
    value: Array<IWebSocketMessage> | Array<IDirectory>
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
  ) => { directory: IDirectory; directoryIndex: number } | undefined;
  addDirectory: (directory: IDirectory) => void;
  changeDirectory: (id: TId, updates: { key: string; value: any }) => void;
  deleteDirectory: (id: TId) => void;
}

const createCollectionSlice = (
  set,
  get,
  initialCollection: ICollection
): ICollectionSlice => ({
  collection: initialCollection || {
    messages: [],
    directories: [],
  },

  // collection
  initialiseConnection: (collection: ICollection) => {},
  updateCollection: (
    key: string,
    value: Array<IWebSocketMessage> | Array<IDirectory>
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
    // existing messages
    let messages = getLast
      ? get()?.last?.collection?.messages
      : get().collection?.messages;

    // message index
    let messageIndex = messages.findIndex(
      (message) => message?._meta?.id === id
    );

    // If message found then update in store
    if (messageIndex !== -1) {
      return { message: messages[messageIndex], messageIndex };
    }

    return undefined;
  },
  addMessage: (message: IWebSocketMessage) => {
    if (!message?._meta?.id) return;

    set((s) => ({
      ...s,
      collection: {
        ...s.collection,
        messages: [...s.collection.messages, message],
      },
    }));

    // Prepare push action for insert message
    get()?.prepareCollectionMessagesPushAction(
      message?._meta?.id,
      EPushActionType.Insert
    );
  },
  changeMessage: (id: TId, updates: { key: string; value: any }) => {
    let messageDetails = get().getMessage(id);

    // If message found then update in store
    if (
      messageDetails &&
      messageDetails.message &&
      messageDetails.messageIndex !== -1
    ) {
      let { key, value } = updates;
      let { message, messageIndex } = messageDetails;
      let updatedMessage = Object.assign({}, message, {
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

      let lastMessage = get().getMessage(id, true);
      // Prepare push action for update message
      get()?.prepareCollectionMessagesPushAction(
        id,
        EPushActionType.update,
        lastMessage,
        updatedMessage
      );
    }
  },
  deleteMessage: (id: TId) => {
    let messageDetails = get().getMessage(id);

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
      // Prepare push action for delete message
      get()?.prepareCollectionMessagesPushAction(id, EPushActionType.delete);
    }
  },
  setMessage: (id: TId, messageToSet: IWebSocketMessage) => {
    let messageDetails = get().getMessage(id);

    // If message found then update in store
    if (
      messageDetails &&
      messageDetails.message &&
      messageDetails.messageIndex !== -1
    ) {
      let { message, messageIndex } = messageDetails;
      let updatedMessage = Object.assign({}, message, messageToSet);

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

      let lastMessage = get().getMessage(id, true);
      // Prepare push action for update message
      get()?.prepareCollectionMessagesPushAction(
        id,
        EPushActionType.update,
        lastMessage,
        updatedMessage
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
      (directory: IDirectory) => directory?._meta?.id === id
    );

    // If directory found then update in store
    if (directoryIndex !== -1) {
      return { directory: directories[directoryIndex], directoryIndex };
    }

    return undefined;
  },
  addDirectory: (directory: IDirectory) => {
    if (!directory?._meta?.id) return;

    set((s) => ({
      ...s,
      collection: {
        ...s.collection,
        directories: [...s.collection.directories, directory],
      },
    }));

    // Prepare push action for insert message
    get()?.prepareCollectionDirectoriesPushAction(
      directory?._meta?.id,
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
      // Prepare push action for update message
      get()?.prepareCollectionDirectoriesPushAction(
        id,
        EPushActionType.update,
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
      get()?.prepareCollectionDirectoriesPushAction(id, EPushActionType.delete);
    }
  },
});

export { ICollection, ICollectionSlice, createCollectionSlice };
