import create from 'zustand';
import createContext from 'zustand/context';
import _cloneDeep from 'lodash/cloneDeep';
import { TId, IGraphQL } from '@firecamp/types';
import { _object } from '@firecamp/utils';
import { initialiseStoreFromRequest } from '../services/request.service';
import {
  createRequestSlice,
  createPlaygroundsSlice,
  createCollectionSlice,
  createRuntimeSlice,
  createPullActionSlice,
  createUiSlice,
  createRequestChangeStateSlice,
} from './slices';
import { IStore, IStoreState } from './store.type';

const {
  Provider: StoreProvider,
  useStore: useStore,
  useStoreApi: useStoreApi,
} = createContext();

const createStore = (initialState: IStoreState) =>
  create<IStore>((set, get): IStore => {
    return {
      ...createRequestSlice(
        set,
        get,
        initialState.request //_object.pick(initialState.request, requestSliceKeys)
      ),
      ...createPlaygroundsSlice(set, get),
      ...createRuntimeSlice(set, get, initialState.runtime),
      ...createCollectionSlice(set, get),
      ...createPullActionSlice(set, get),
      ...createUiSlice(set, get, initialState.ui),
      ...createRequestChangeStateSlice(set, get),

      initialise: (_request: Partial<IGraphQL>, tabId: TId) => {
        const initState = initialiseStoreFromRequest(_request, tabId);
        // console.log(initState, 'initState');
        set((s) => ({
          ...s,
          ...initState,
          originalRequest: _cloneDeep(initState.request) as IGraphQL,
        }));
      },
      setContext: (ctx: any) => set({ context: ctx }),
    };
  });

export { StoreProvider, createStore, useStore, useStoreApi };
