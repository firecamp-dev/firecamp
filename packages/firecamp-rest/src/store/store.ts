import _cloneDeep from 'lodash/cloneDeep';
import create from 'zustand';
import createContext from 'zustand/context';
import { TId, IRest, IRestResponse, EFirecampAgent } from '@firecamp/types';
import { _object, _env, _array, _string } from '@firecamp/utils';
import {
  prepareUIRequestPanelState,
  normalizeVariables,
  normalizeSendRequestPayload,
  initialiseStoreFromRequest,
} from '../services/request.service';
import {
  createRequestSlice,
  requestSliceKeys,
  createRuntimeSlice,
  createResponseSlice,
  createUiSlice,
  createPullActionSlice,
  createRequestChangeStateSlice,
} from './slices/index';
import { IRestClientRequest } from '../types';
import { IStoreState, IStore, TOnChangeVariables } from './store.type';

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
            // @ts-ignore
            originalRequest: _cloneDeep(initState.request) as IRest,
        }));
        // update auth type, generate auth headers
        state.changeAuthType(request.auth?.type);
      },
      ...createRequestSlice(
        set,
        get,
        _object.pick(
          initialState.request,
          requestSliceKeys
        ) as IRestClientRequest
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
      ...createPullActionSlice(set, get),
      ...createRequestChangeStateSlice(set, get),

      execute: async (
        variables: {
          collection?: {};
        },
        fcAgent: EFirecampAgent,
        onChangeVariables: TOnChangeVariables
      ) => {
        const state = get();
        try {
          // set response empty
          set({ response: { statusCode: 0 } });

          // Check if request is running or not. stop running request if already true
          if (state.runtime.isRequestRunning === true) {
            await state.context.request.cancelExecution(
              state.request.__ref.id,
              fcAgent
            );
            // set request running state as false
            state.setRequestRunningFlag(false);
            return;
          }
          state.setRequestRunningFlag(true);

          // normalize request
          // const normalizedRequest = await normalizeSendRequestPayload(
          //   request,
          //   state.request
          // );

          // console.log({ normalizedRequest, request });
          // execute request
          await state.context.request
            .execute(state.request)
            .then((response) => {
              console.log({ response: response });
              if (response?.error) {
                const error = response.error;
                console.log(
                  error.message,
                  error.code,
                  error.e.response,
                  error.e,
                  9090
                );
              }
              return response;
            })
            .then(async (response) => {
              if (!response) return;
              // TODO: add cookies

              set((s) => ({ response })); // TODO: check what to set/ response or testScriptResponse
              state.setRequestRunningFlag(false);
            })
            .catch((e) => {
              console.log(e.message, e.stack, e.response, e, 9090);
            });
        } catch (e) {
          state.setRequestRunningFlag(false);
          console.error({
            api: 'execute',
            e,
          });
        }
      },
    };
  });

export { StoreProvider, useStore, createStore, useStoreApi };
