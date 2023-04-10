import create from 'zustand';
import createContext from 'zustand/context';
import _cloneDeep from 'lodash/cloneDeep';
import { _object } from '@firecamp/utils';
import { IWebSocket, TId } from '@firecamp/types';
import { initialiseStoreFromRequest } from '../services/request.service';
import { IStore, IStoreState } from './store.type';
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

  // ui
  createUiSlice,
} from './slices';

const {
  Provider: StoreProvider,
  useStore: useStore,
  useStoreApi: useStoreApi,
} = createContext();

const createStore = (initialState: IStoreState) =>
  create<IStore>((set, get): IStore => {
    return {
      setContext: (ctx: any) => set({ context: ctx }),
      initialise: async (request: Partial<IWebSocket>, tabId: TId) => {
        const state = get();
        const requestId = request.__ref?.id;
        const requestPath = requestId
          ? state.context?.request.getPath(requestId)
          : { path: '', items: [] };
        const initState = initialiseStoreFromRequest(request, {
          tabId,
          requestPath,
        });
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
      ...createPlaygroundsSlice(set, get, initialState.playground),
      ...createLogsSlice(set, get),
      ...createHandleConnectionExecutor(set, get),
      ...createUiSlice(set, get, initialState.ui),
      ...createRequestChangeStateSlice(set, get),
    };
  });

export { StoreProvider, useStore, useStoreApi, createStore };
