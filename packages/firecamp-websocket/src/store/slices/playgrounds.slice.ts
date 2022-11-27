import equal from 'deep-equal';
import { IExecutor } from '@firecamp/ws-executor/dist/esm';

import {
  IWebSocketMessage,
  TId,
  EMessageBodyType,
  ERequestTypes,
  EEnvelope,
} from '@firecamp/types';

import { EConnectionState } from '../../types';
import { _object } from '@firecamp/utils';

const initialPlaygroundMessage = {
  name: '',
  body: '',
  __meta: {
    type: EMessageBodyType.Text,
    envelope: EEnvelope.Int8Array,
  },
  __ref: {
    id: '',
    collectionId: '',
    requestId: '',
    requestType: ERequestTypes.WebSocket,
  },
  path: '',
};

interface IMessage extends IWebSocketMessage {
  path: string;
}

// TODO: add key for active_message from collection

interface IPlayground {
  id: TId;
  connectionState: EConnectionState;
  logFilters: {
    type: string;
  };
  message: IMessage;
  selectedCollectionMessage: TId | string;
  executor?: IExecutor;
}

interface IPlaygrounds {
  [key: TId]: IPlayground;
}

interface IPlaygroundSlice {
  playgrounds: IPlaygrounds;

  getPlayground: (connectionId: TId) => void;
  addPlayground: (connectionId: TId, playground: IPlayground) => void;
  changePlayground: (connectionId: TId, updates: object) => void;

  changePlaygroundConnectionState: (
    connectionId: TId,
    connectionState: EConnectionState
  ) => void;
  changePlaygroundLogFilters: (
    connectionId: TId,
    updates: { type: string }
  ) => void;

  setPlaygroundMessage: (connectionId: TId, message: IMessage) => void;
  changePlaygroundMessage: (connectionId: TId, updates: object) => void;
  resetPlaygroundMessage: (connectionId: TId) => void;

  setSelectedCollectionMessage: (
    connectionId: TId,
    messageId: TId | string
  ) => void;

  deletePlayground: (connectionId: TId) => void;

  deleteExecutor: (connectionId: TId) => void;
}

const createPlaygroundsSlice = (
  set,
  get,
  initialPlaygrounds: IPlaygrounds
): IPlaygroundSlice => ({
  playgrounds: initialPlaygrounds,

  getPlayground: (connectionId: TId) => {
    return get().playgrounds?.[connectionId];
  },
  addPlayground: (connectionId: TId, playground: IPlayground) => {
    set((s) => ({
      ...s,
      playgrounds: {
        ...s.playgrounds,
        [connectionId]: playground,
      },
    }));
  },

  changePlayground: (connectionId: TId, updates: object) => {
    set((s) => ({
      ...s,
      playgrounds: {
        ...s.playgrounds,
        [connectionId]: {
          ...(s.playgrounds[connectionId] || {}),
          ...updates,
        },
      },
    }));
  },

  changePlaygroundConnectionState: (
    connectionId: TId,
    connectionState: EConnectionState
  ) => {
    const plg = get().playgrounds?.[connectionId];
    if (plg?.id === connectionId) {
      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: {
            ...s.playgrounds[connectionId],
            connectionState,
          },
        },
      }));
    }
  },
  changePlaygroundLogFilters: (
    connectionId: TId,
    updates: { type: string }
  ) => {
    const existingPlayground = get().playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.logFilters = { type: updates.type };

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },

  setPlaygroundMessage: (connectionId: TId, message: IMessage) => {
    const existingPlayground = get().playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.message = message;

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },
  changePlaygroundMessage: async (connectionId: TId, updates: object) => {
    const state = get();
    const existingPlayground = await state.playgrounds?.[connectionId];

    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = Object.assign({}, existingPlayground);
      updatedPlayground.message = { ...updatedPlayground.message, ...updates };

      if (
        !equal(
          _object.omit(existingPlayground.message, ['path']),
          _object.omit(updatedPlayground.message, ['path'])
        )
      ) {
        set((s) => ({
          ...s,
          playgrounds: {
            ...s.playgrounds,
            [connectionId]: updatedPlayground,
          },
        }));
        state.changePlaygroundTab(connectionId, {
          meta: {
            isSaved: !!updatedPlayground.message?._meta?.id,
            hasChange: true,
          },
        });
      } else {
        state.changePlaygroundTab(connectionId, {
          meta: {
            isSaved: !!updatedPlayground.message?._meta?.id,
            hasChange: false,
          },
        });
      }
    }
  },
  resetPlaygroundMessage: (connectionId: TId) => {
    const existingPlayground = get().playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.message = initialPlaygroundMessage;

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },

  setSelectedCollectionMessage: (
    connectionId: TId,
    messageId: TId | string
  ) => {
    const existingPlayground = get().playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.selectedCollectionMessage = messageId;

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },

  deletePlayground: (connectionId: TId) => {
    const state = get();
    const playgroundsCount = Object.keys(state.playgrounds)?.length;

    // Do not allow to remove playground if only one exists
    if (playgroundsCount === 1) return;
    const existingPlayground = state.playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      set((s) => ({
        ...s,
        playgrounds: s.playgrounds?.filter((c) => c.id != connectionId),
      }));
    }
  },

  deleteExecutor: (connectionId: TId) => {
    let existingPlayground = get().playgrounds?.[connectionId];
    if (existingPlayground && existingPlayground?.id === connectionId) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.executor = {};

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },
});

export {
  IPlayground,
  IPlaygrounds,
  IPlaygroundSlice,
  createPlaygroundsSlice,
  initialPlaygroundMessage,
};
