import isEqual from 'react-fast-compare';
import _cloneDeep from 'lodash/cloneDeep';
import { IExecutor } from '@firecamp/ws-executor/dist/esm';
import {
  TId,
  IWebSocketMessage,
  EMessageBodyType,
  ERequestTypes,
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

interface IPlaygroundSlice {
  playground: IPlayground;
  setPlaygroundExecutor: (executor: any) => void;
  deleteExecutor: () => void;
  changePlaygroundConnectionState: (connectionState: EConnectionState) => void;
  changePlaygroundLogFilters: (updates: { type: string }) => void;
  openMessageInPlayground: (msgId: TId) => void;
  changePlaygroundMessage: (updates: object) => void;
  resetPlaygroundMessage: () => void;
}

const createPlaygroundsSlice: TStoreSlice<IPlaygroundSlice> = (
  set,
  get,
  initialPlayground: IPlayground
) => ({
  playground: initialPlayground,

  setPlaygroundExecutor: (executor) => {
    set((s) => ({
      playground: {
        ...s.playground,
        executor,
      },
    }));
  },

  deleteExecutor: () => {
    const state = get();
    state.setPlaygroundExecutor(null);
  },

  changePlaygroundConnectionState: (connectionState: EConnectionState) => {
    set((s) => ({
      playground: {
        ...s.playground,
        connectionState,
      },
    }));
  },
  changePlaygroundLogFilters: (updates: { type: string }) => {
    set((s) => ({
      playground: {
        ...s.playground,
        logFilters: { type: updates.type },
      },
    }));
  },

  openMessageInPlayground: (msgId: TId) => {
    const {
      collection: { items },
    } = get();

    //@ts-ignore TODO: fix type here later
    const item: IMessage = items.find((i) => i.__ref.id == msgId);

    set((s) => ({
      playground: {
        ...s.playground,
        message: item,
        selectedMessageId: msgId,
      },
    }));
  },
  changePlaygroundMessage: async (updates) => {
    const {
      collection: { items },
    } = get();
    //TODO: manage is message changed?
    set((s) => ({
      playground: {
        ...s.playground,
        message: { ...s.playground.message, ...updates },
      },
    }));
  },
  resetPlaygroundMessage: () => {
    set((s) => ({
      playground: {
        ...s.playground,
        message: _cloneDeep(initialPlaygroundMessage),
        selectedMessageId: null,
      },
    }));
  },
});

export {
  IPlayground,
  IPlaygroundSlice,
  createPlaygroundsSlice,
  initialPlaygroundMessage,
};
