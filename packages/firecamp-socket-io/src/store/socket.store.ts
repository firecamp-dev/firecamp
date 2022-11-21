import create from 'zustand';
import createContext from 'zustand/context';
import { ISocketIO } from '@firecamp/types';

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

  // push actions
  IPushAction,
  IPushActionSlice,
  createPushActionSlice,
  IHandleConnectionExecutorSlice,
  createHandleConnectionExecutor,

  // ui
  IUiSlice,
  IUi,
  createUiSlice,
} from './index';
import { _object } from '@firecamp/utils';

const {
  Provider: SocketStoreProvider,
  useStore: useSocketStore,
  useStoreApi: useSocketStoreApi,
} = createContext();

interface ISocket {
  request?: ISocketIO;
  collection?: ICollection;
  pushAction?: IPushAction;
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
    IPushActionSlice,
    IHandleConnectionExecutorSlice,
    IUiSlice {
  last: any;

  setLast: (initialState: ISocket) => void;
  initialise: (initialState: ISocket, isFresh: boolean) => void;
}

const createSocketStore = (initialState: ISocket) =>
  create<ISocketStore>((set, get): ISocketStore => {
    return {
      last: initialState,
      setLast: (initialState: ISocket) => {
        set((s) => ({
          ...s,
          last: initialState,
        }));
      },

      initialise: (initialState, isFresh: boolean) => {
        // request
        let initialRequest: ISocketIO = _object.pick(
          initialState.request,
          requestSliceKeys
        ) as ISocketIO;

        // console.log({ initialRequest, initialState });

        if (!_object.isEmpty(initialRequest))
          get().initialiseRequest(initialRequest);

        if (initialState.ui) get().initializeUi(initialState.ui);

        // if (initialState.pushAction)
        //   get().initializePushAction(initialState.pushAction);

        // console.log({ initialState });

        if (isFresh) {
          set((s) => ({
            ...s,
            last: initialState,
          }));
        }

        // runtime
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
      ...createPushActionSlice(set, get),
      ...createHandleConnectionExecutor(set, get),

      //   ...createPushActionSlice(set, get),
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
