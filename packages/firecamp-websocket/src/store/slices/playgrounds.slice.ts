import equal from 'deep-equal';
import { IExecutor } from '@firecamp/ws-executor/dist/esm';

import {
  IWebSocketMessage,
  TId,
  EMessageBodyType,
  ERequestTypes,
  EEnvelope,
} from '@firecamp/types';

import { EConnectionState } from '../../constants';
import { _object } from '@firecamp/utils';

const initialPlaygroundMessage = {
  name: '',
  body: '',
  meta: {
    type: EMessageBodyType.Text,
    envelope: EEnvelope.Int8Array,
  },
  _meta: {
    id: '',
    collection_id: '',
    request_id: '',
    request_type: ERequestTypes.WebSocket,
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

  getPlayground: (connection_id: TId) => void;
  addPlayground: (connection_id: TId, playground: IPlayground) => void;
  changePlayground: (connection_id: TId, updates: object) => void;

  changePlaygroundConnectionState: (
    connection_id: TId,
    connectionState: EConnectionState
  ) => void;
  changePlaygroundLogFilters: (
    connection_id: TId,
    updates: { type: string }
  ) => void;

  setPlaygroundMessage: (connection_id: TId, message: IMessage) => void;
  changePlaygroundMessage: (connection_id: TId, updates: object) => void;
  resetPlaygroundMessage: (connection_id: TId) => void;

  setSelectedCollectionMessage: (
    connection_id: TId,
    message_id: TId | string
  ) => void;

  deletePlayground: (connection_id: TId) => void;

  deleteExecutor: (connection_id: TId) => void;
}

const createPlaygroundsSlice = (
  set,
  get,
  initialPlaygrounds: IPlaygrounds
): IPlaygroundSlice => ({
  playgrounds: initialPlaygrounds,

  getPlayground: (connection_id: TId) => {
    return get()?.playgrounds?.[connection_id];
  },
  addPlayground: (connection_id: TId, playground: IPlayground) => {
    set((s) => ({
      ...s,
      playgrounds: {
        ...s.playgrounds,
        [connection_id]: playground,
      },
    }));
  },

  changePlayground: (connection_id: TId, updates: object) => {
    set((s) => ({
      ...s,
      playgrounds: {
        ...s.playgrounds,
        [connection_id]: {
          ...(s.playgrounds[connection_id] || {}),
          ...updates,
        },
      },
    }));
  },

  changePlaygroundConnectionState: (
    connection_id: TId,
    connectionState: EConnectionState
  ) => {
    let existingPlayground = get()?.playgrounds?.[connection_id];
    if (existingPlayground && existingPlayground?.id === connection_id) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.connectionState = connectionState;

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connection_id]: updatedPlayground,
        },
      }));
    }
  },
  changePlaygroundLogFilters: (
    connection_id: TId,
    updates: { type: string }
  ) => {
    let existingPlayground = get()?.playgrounds?.[connection_id];
    if (existingPlayground && existingPlayground?.id === connection_id) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.logFilters = { type: updates.type };

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connection_id]: updatedPlayground,
        },
      }));
    }
  },

  setPlaygroundMessage: (connection_id: TId, message: IMessage) => {
    let existingPlayground = get()?.playgrounds?.[connection_id];
    if (existingPlayground && existingPlayground?.id === connection_id) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.message = message;

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connection_id]: updatedPlayground,
        },
      }));
    }
  },
  changePlaygroundMessage: async (connection_id: TId, updates: object) => {
    let existingPlayground = await get()?.playgrounds?.[connection_id];

    if (existingPlayground && existingPlayground?.id === connection_id) {
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
            [connection_id]: updatedPlayground,
          },
        }));
        get()?.changePlaygroundTab(connection_id, {
          meta: {
            is_saved: !!updatedPlayground.message?._meta?.id,
            hasChange: true,
          },
        });
      } else {
        get()?.changePlaygroundTab(connection_id, {
          meta: {
            is_saved: !!updatedPlayground.message?._meta?.id,
            hasChange: false,
          },
        });
      }
    }
  },
  resetPlaygroundMessage: (connection_id: TId) => {
    let existingPlayground = get()?.playgrounds?.[connection_id];
    if (existingPlayground && existingPlayground?.id === connection_id) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.message = initialPlaygroundMessage;

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connection_id]: updatedPlayground,
        },
      }));
    }
  },

  setSelectedCollectionMessage: (
    connection_id: TId,
    message_id: TId | string
  ) => {
    let existingPlayground = get()?.playgrounds?.[connection_id];
    if (existingPlayground && existingPlayground?.id === connection_id) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.selectedCollectionMessage = message_id;

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connection_id]: updatedPlayground,
        },
      }));
    }
  },

  deletePlayground: (connection_id: TId) => {
    let playgroundsCount = Object.keys(get()?.playgrounds)?.length;

    // Do not allow to remove playground if only one exists
    if (playgroundsCount === 1) return;

    let existingPlayground = get()?.playgrounds?.[connection_id];
    if (existingPlayground && existingPlayground?.id === connection_id) {
      set((s) => ({
        ...s,
        playgrounds: s.playgrounds?.filter((c) => c.id != connection_id),
      }));
    }
  },

  deleteExecutor: (connection_id: TId) => {
    let existingPlayground = get()?.playgrounds?.[connection_id];
    if (existingPlayground && existingPlayground?.id === connection_id) {
      let updatedPlayground = existingPlayground;
      updatedPlayground.executor = {};

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connection_id]: updatedPlayground,
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
