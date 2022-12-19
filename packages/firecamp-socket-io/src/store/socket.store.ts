import create from 'zustand';
import createContext from 'zustand/context';
import { ISocketIO, TId } from '@firecamp/types';

import {
  // request
  createRequestSlice,
  requestSliceKeys,

  // runtime
  createRuntimeSlice,

  // collection
  createCollectionSlice,

  // playground
  createPlaygroundsSlice,

  // connections logs
  createLogsSlice,

  // req changes
  createRequestChangeStateSlice,

  // execute slice
  createHandleConnectionExecutor,

  // ui
  createUiSlice,
} from './slices';
import { _object } from '@firecamp/utils';
import { initialiseStoreFromRequest } from '../services/request.service';
import { ISocket, ISocketStore } from './store.type';

const {
  Provider: SocketStoreProvider,
  useStore: useSocketStore,
  useStoreApi: useSocketStoreApi,
} = createContext();

const createSocketStore = (initialState: ISocket) =>
  create<ISocketStore>((set, get) => {
    return {
      initialise: (request: Partial<ISocketIO>, tabId: TId) => {
        const initState = initialiseStoreFromRequest(request, tabId);
        set((s) => ({
          ...s,
          ...initState,
        }));
      },
      ...createRequestSlice(
        set,
        get,
        _object.pick(initialState.request, requestSliceKeys) as ISocketIO
      ),
      ...createRuntimeSlice(set, get, initialState.runtime),
      ...createCollectionSlice(set, get, initialState.collection),
      ...createPlaygroundsSlice(set, get, initialState.playgrounds),
      ...createLogsSlice(set, get),
      ...createHandleConnectionExecutor(set, get),
      ...createRequestChangeStateSlice(set, get),
      ...createUiSlice(set, get, initialState.ui),
    };
  });

export {
  SocketStoreProvider,
  useSocketStore,
  useSocketStoreApi,
  createSocketStore,
};
