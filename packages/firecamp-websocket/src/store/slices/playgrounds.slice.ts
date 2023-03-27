import isEqual from 'react-fast-compare';
import { IExecutor } from '@firecamp/ws-executor/dist/esm';
import {
  TId,
  IWebSocketMessage,
  EMessageBodyType,
  ERequestTypes,
  ETypedArrayView,
} from '@firecamp/types';
import { _object } from '@firecamp/utils';

import { EConnectionState } from '../../types';
import { TStoreSlice } from '../store.type';

const initialPlaygroundMessage = {
  name: '',
  path: '',
  value: '',
  __meta: {
    type: EMessageBodyType.Text,
    // typedArrayView: ETypedArrayView.Int8Array,
  },
  __ref: {
    id: '',
    collectionId: '',
    requestId: '',
    requestType: ERequestTypes.WebSocket,
  },
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
  [key: string]: IPlayground;
}

interface IPlaygroundSlice {
  playgrounds: IPlaygrounds;

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

const createPlaygroundsSlice: TStoreSlice<IPlaygroundSlice> = (
  set,
  get,
  initialPlaygrounds: IPlaygrounds
) => ({
  playgrounds: initialPlaygrounds,

  addPlayground: (connectionId: TId, playground: IPlayground) => {
    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [connectionId]: playground,
      },
    }));
  },

  changePlayground: (connectionId: TId, updates: object) => {
    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [connectionId]: {
          ...s.playgrounds[connectionId],
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
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },

  setPlaygroundMessage: (connectionId: TId, message: IMessage) => {
    const existingPlayground = get().playgrounds?.[connectionId];
    if (existingPlayground?.id === connectionId) {
      set((s) => ({
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: {
            ...existingPlayground,
            message,
          },
        },
      }));
    }
  },
  changePlaygroundMessage: async (connectionId: TId, updates: object) => {
    console.log(updates, 'change plg');
    const state = get();
    const plg = await state.playgrounds?.[connectionId];

    if (plg?.id === connectionId) {
      const newPlg = {
        ...plg,
        message: { ...plg.message, ...updates },
      };

      if (
        !isEqual(
          _object.omit(plg.message, ['path']),
          _object.omit(newPlg.message, ['path'])
        )
      ) {
        set((s) => ({
          playgrounds: {
            ...s.playgrounds,
            [connectionId]: newPlg,
          },
        }));
        state.changePlaygroundTab(connectionId, {
          __meta: {
            isSaved: !!newPlg.message?.__ref?.id,
            hasChange: true,
          },
        });
      } else {
        state.changePlaygroundTab(connectionId, {
          __meta: {
            isSaved: !!newPlg.message?.__ref?.id,
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
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: updatedPlayground,
        },
      }));
    }
  },

  deletePlayground: (connectionId: TId) => {
    const { playgrounds } = get();
    const playgroundsCount = Object.keys(playgrounds)?.length;

    // Do not allow to remove playground if only one exists
    if (playgroundsCount === 1) return;
    const existingPlayground = playgrounds[connectionId];
    if (existingPlayground?.id === connectionId) {
      set((s) => {
        delete s.playgrounds[connectionId];
        const { [connectionId]: plg, ...plgs } = s.playgrounds;
        return {
          playgrounds: plgs,
        };
      });
    }
  },

  deleteExecutor: (connectionId: TId) => {
    const { playgrounds } = get();
    let existingPlayground = playgrounds?.[connectionId];
    if (existingPlayground?.id === connectionId) {
      set((s) => ({
        playgrounds: {
          ...s.playgrounds,
          [connectionId]: {
            ...existingPlayground,
            executor: null,
          },
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
