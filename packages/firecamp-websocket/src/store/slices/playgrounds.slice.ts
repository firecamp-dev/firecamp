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

interface IMessage extends IWebSocketMessage {}

// TODO: add key for active_message from collection

interface IPlayground {
  id: TId;
  connectionState: EConnectionState;
  logFilters: {
    type: string;
  };
  message: IMessage;
  selectedMessageId: TId | string;
  executor?: IExecutor;
}

interface IPlaygrounds {
  [key: string]: IPlayground;
}

interface IPlaygroundSlice {
  playgrounds: IPlaygrounds;
  addPlayground: (connectionId: TId, playground: IPlayground) => void;
  setPlaygroundExecutor: (connectionId: TId, executor: any) => void;
  deleteExecutor: (connectionId: TId) => void;
  changePlaygroundConnectionState: (
    connectionId: TId,
    connectionState: EConnectionState
  ) => void;
  changePlaygroundLogFilters: (
    connectionId: TId,
    updates: { type: string }
  ) => void;
  openMessageInPlayground: (msgId: TId) => void;
  changePlaygroundMessage: (updates: object) => void;
  resetPlaygroundMessage: () => void;
  deletePlayground: (connectionId: TId) => void;
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

  setPlaygroundExecutor: (connectionId: TId, executor) => {
    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [connectionId]: {
          ...s.playgrounds[connectionId],
          executor,
        },
      },
    }));
  },

  deleteExecutor: (connectionId: TId) => {
    const state = get();
    let existingPlayground = state.playgrounds?.[connectionId];
    if (existingPlayground?.id === connectionId) {
      state.setPlaygroundExecutor(connectionId, null);
    }
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

  openMessageInPlayground: (msgId: TId) => {
    const {
      runtime: { activePlayground: connectionId },
      collection: { items },
      playgrounds,
      changePlaygroundTab,
    } = get();

    //@ts-ignore TODO: fix type here later
    const item: IMessage = items.find((i) => i.__ref.id == msgId);
    // console.log(item, 1100099);

    const existingPlayground = playgrounds?.[connectionId];
    if (!existingPlayground) return;
    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [connectionId]: {
          ...existingPlayground,
          message: item,
          selectedMessageId: msgId,
        },
      },
    }));
    changePlaygroundTab(connectionId, {
      __meta: {
        isSaved: true,
        hasChange: false,
      },
    });
  },
  changePlaygroundMessage: async (updates) => {
    const {
      collection: { items },
      runtime: { activePlayground: connectionId },
      playgrounds,
      changePlaygroundTab,
    } = get();
    // console.log(updates, 'change plg');
    const plg = playgrounds[connectionId];
    if (plg?.id != connectionId) return;

    const newPlg = {
      ...plg,
      message: { ...plg.message, ...updates },
    };

    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [connectionId]: newPlg,
      },
    }));

    const originalMsg = items.find((i) => i.__ref.id == plg.message?.__ref?.id);
    const isMsgChanged = !isEqual(originalMsg, newPlg.message);
    changePlaygroundTab(connectionId, {
      __meta: {
        isSaved: !!newPlg.message.__ref?.id,
        hasChange: isMsgChanged,
      },
    });
  },
  resetPlaygroundMessage: () => {
    const {
      runtime: { activePlayground: connectionId },
      playgrounds,
      changePlaygroundTab,
    } = get();

    const existingPlayground = playgrounds[connectionId];
    if (existingPlayground?.id != connectionId) return;
    set((s) => ({
      playgrounds: {
        ...s.playgrounds,
        [connectionId]: {
          ...existingPlayground,
          message: initialPlaygroundMessage,
          selectedMessageId: null,
        },
      },
    }));
    changePlaygroundTab(connectionId, {
      __meta: {
        isSaved: false,
        hasChange: false,
      },
    });
  },

  deletePlayground: (connectionId: TId) => {
    const { playgrounds } = get();
    const playgroundsCount = Object.keys(playgrounds)?.length;
    // do not allow to remove playground if only one exists
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
});

export {
  IPlayground,
  IPlaygrounds,
  IPlaygroundSlice,
  createPlaygroundsSlice,
  initialPlaygroundMessage,
};
