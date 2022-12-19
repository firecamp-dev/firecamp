import create from 'zustand';
import createContext from 'zustand/context';
import _cloneDeep from 'lodash/cloneDeep';
import equal from 'react-fast-compare';

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
  ILogsSlice,
  ILogs,
  createLogsSlice,

  // request changes
  IRequestChangeStateSlice,
  createRequestChangeStateSlice,

  // handle execution
  IHandleConnectionExecutorSlice,
  createHandleConnectionExecutor,

  // pull
  IPullSlice,
  createPullActionSlice,

  // ui
  IUi,
  createUiSlice,
  IUiSlice,
} from './index';
import { _object } from '@firecamp/utils';
import { IWebSocket, TId } from '@firecamp/types';
import { initialiseStoreFromRequest } from '../services/reqeust.service';

const {
  Provider: WebsocketStoreProvider,
  useStore: useWebsocketStore,
  useStoreApi: useWebsocketStoreApi,
} = createContext();

interface IWebsocketStoreState {
  request?: IWebSocket;
  collection?: ICollection;
  runtime?: IRuntime;
  playgrounds?: IPlaygrounds;
  logs?: ILogs;
  ui?: IUi;
}

interface IWebsocketStore
  extends IRequestSlice,
    IRuntimeSlice,
    ICollectionSlice,
    IPlaygroundSlice,
    ILogsSlice,
    IPullSlice,
    IHandleConnectionExecutorSlice,
    IUiSlice,
    IRequestChangeStateSlice {
  last: any;
  originalRequest?: IWebSocket;
  initialise: (request: Partial<IWebSocket>, tabId: TId) => void;
}

const createWebsocketStore = (initialState: IWebsocketStoreState) =>
  create<IWebsocketStore>((set, get): IWebsocketStore => {
    return {
      last: initialState,

      initialise: async (request: Partial<IWebSocket>, tabId: TId) => {
        const initState = initialiseStoreFromRequest(request, tabId);
        // console.log(initState.request, 'initState.request');
        set((s) => ({
          ...s,
          ...initState,
          originalRequest: _cloneDeep(initState.request),
        }));
      },

      ...createRequestSlice(
        set,
        get,
        _object.pick(initialState.request, requestSliceKeys) as IWebSocket
      ),

      ...createRuntimeSlice(set, get, initialState.runtime),
      ...createCollectionSlice(set, get, initialState.collection),
      ...createPlaygroundsSlice(set, get, initialState.playgrounds),
      ...createLogsSlice(set, get),
      ...createHandleConnectionExecutor(set, get),
      ...createPullActionSlice(set, get),
      ...createUiSlice(set, get, initialState.ui),
      ...createRequestChangeStateSlice(set, get),
    };
  });

export {
  WebsocketStoreProvider,
  useWebsocketStore,
  useWebsocketStoreApi,
  createWebsocketStore,
  IWebsocketStore,
  IWebsocketStoreState,
};
