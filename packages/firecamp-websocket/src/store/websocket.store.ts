import create from 'zustand';
import createContext from 'zustand/context';
import _cloneDeep from 'lodash/cloneDeep';
import { _object } from '@firecamp/utils';
import { IWebSocket, TId } from '@firecamp/types';
import { initialiseStoreFromRequest } from '../services/reqeust.service';

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

  // request changes
  createRequestChangeStateSlice,

  // handle execution
  createHandleConnectionExecutor,

  // pull
  createPullActionSlice,

  // ui
  createUiSlice,
} from './slices';
import { IStore, IStoreState } from './store.type';

const {
  Provider: WebsocketStoreProvider,
  useStore: useWebsocketStore,
  useStoreApi: useWebsocketStoreApi,
} = createContext();

const createWebsocketStore = (initialState: IStoreState) =>
  create<IStore>((set, get): IStore => {
    return {
      setContext: (ctx: any) => set({ context: ctx }),
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
  IStore,
  IStoreState,
};
