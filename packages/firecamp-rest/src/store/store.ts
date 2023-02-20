import _cloneDeep from 'lodash/cloneDeep';
import create from 'zustand';
import createContext from 'zustand/context';
import { TId, IRest } from '@firecamp/types';
import { _object, _env, _array, _string } from '@firecamp/utils';
import {
  prepareUIRequestPanelState,
  initialiseStoreFromRequest,
} from '../services/request.service';
import {
  createRequestSlice,
  requestSliceKeys,
  createRuntimeSlice,
  createResponseSlice,
  createUiSlice,
  createRequestChangeStateSlice,
  createExecutionSlice,
} from './slices/index';
import { IStoreState, IStore } from './store.type';

const {
  Provider: StoreProvider,
  useStore: useStore,
  useStoreApi: useStoreApi,
} = createContext();

const createStore = (initialState: IStoreState) =>
  create<IStore>((set, get): IStore => {
    const uiRequestPanel = prepareUIRequestPanelState(initialState.request);
    return {
      ...initialState,
      setContext: (ctx: any) => set({ context: ctx }),
      initialise: (request: Partial<IRest>, tabId: TId) => {
        const state = get();
        const initState = initialiseStoreFromRequest(request, tabId);
        // console.log(initState, 'initState');
        set((s) => ({
          ...s,
          ...initState,
          originalRequest: _cloneDeep(initState.request) as IRest,
        }));
        // update auth type, generate auth headers
        state.changeAuthType(initState.request.auth.type);
      },
      ...createRequestSlice(
        set,
        get,
        _object.pick(initialState.request, requestSliceKeys) as IRest
      ),
      ...createRuntimeSlice(set, get, initialState.runtime),
      ...createResponseSlice(set, get),
      ...createUiSlice(set, get, {
        ...initialState.ui,
        requestPanel: {
          ...initialState.ui.requestPanel,
          ...uiRequestPanel,
        },
      }),
      ...createRequestChangeStateSlice(set, get),
      ...createExecutionSlice(set, get),
    };
  });

export { StoreProvider, useStore, createStore, useStoreApi };
