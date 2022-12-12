import create from 'zustand';
import createContext from 'zustand/context';
import { ISocketIO, TId } from '@firecamp/types';

import {
  // request
  IRequestSlice,
  createRequestSlice,
  requestSliceKeys,

  // runtime
  IRuntime,
  IRuntimeSlice,
  createRuntimeSlice,

  // collection
  createCollectionSlice,
  ICollection,
  ICollectionSlice,

  // playground
  IPlaygrounds,
  IPlaygroundSlice,
  createPlaygroundsSlice,

  // connections logs
  IConnectionsLogsSlice,
  IConnectionsLogs,
  createConnectionsLogsSlice,

  // req changes
  IRequestChangeStateSlice,
  createRequestChangeStateSlice,

  // execute slice
  IHandleConnectionExecutorSlice,
  createHandleConnectionExecutor,

  // ui
  IUiSlice,
  IUi,
  createUiSlice,
} from './slices';
import { _object } from '@firecamp/utils';
import { initialiseStoreFromRequest } from '../services/request.service';

const {
  Provider: SocketStoreProvider,
  useStore: useSocketStore,
  useStoreApi: useSocketStoreApi,
} = createContext();

interface ISocket {
  request?: ISocketIO;
  collection?: ICollection;
  runtime?: IRuntime;
  playgrounds?: IPlaygrounds;
  connectionsLogs?: IConnectionsLogs;
  ui?: IUi;
}

interface ISocketStore
  extends IRequestSlice,
    IRuntimeSlice,
    ICollectionSlice,
    IPlaygroundSlice,
    IConnectionsLogsSlice,
    IHandleConnectionExecutorSlice,
    IUiSlice,
    IRequestChangeStateSlice {
  originalRequest?: ISocketIO;

  initialise: (request: Partial<ISocketIO>, tabId: TId) => void;
}

const createSocketStore = (initialState: ISocket) =>
  create<ISocketStore>((set, get): ISocketStore => {
    return {
      initialise: async (request: Partial<ISocketIO>, tabId: TId) => {
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
      ...createConnectionsLogsSlice(set, get),
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
  ISocketStore,
  ISocket,
};
