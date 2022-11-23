import create from 'zustand';
import createContext from 'zustand/context';

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

  // pull
  IPullSlice,
  createPullActionSlice,

  // ui
  IUi,
  createUiSlice,
  IUiSlice,
  initialPlaygroundMessage,
} from './index';
import { _object } from '@firecamp/utils';
import { IWebSocket } from '@firecamp/types';
import {
  normalizeRequest,
  prepareUIRequestPanelState,
} from '../services/reqeust.service';
import { EConnectionState, ERequestPanelTabs } from '../types';
import { DefaultConnectionState } from '../constants';

const {
  Provider: WebsocketStoreProvider,
  useStore: useWebsocketStore,
  useStoreApi: useWebsocketStoreApi,
} = createContext();

interface IWebsocketStoreState {
  request?: IWebSocket;
  collection?: ICollection;
  pushAction?: IPushAction;
  runtime?: IRuntime;
  playgrounds?: IPlaygrounds;
  connectionsLogs?: IConnectionsLogs;
  ui?: IUi;
}

interface IWebsocketStore
  extends IRequestSlice,
    IRuntimeSlice,
    ICollectionSlice,
    IPlaygroundSlice,
    IConnectionsLogsSlice,
    IPushActionSlice,
    IPullSlice,
    IHandleConnectionExecutorSlice,
    IUiSlice {
  last: any;

  initialise: (request: IWebSocket, memoiseRequest: boolean) => void;

  setLast: (initialState: IWebsocketStoreState) => void;
}

const createWebsocketStore = (initialState: IWebsocketStoreState) =>
  create<IWebsocketStore>((set, get): IWebsocketStore => {
    return {
      last: initialState,

      initialise: async (_request, memoiseRequest) => {
        const state = get();
        const request: IWebSocket = await normalizeRequest(_request);
        // const uiActiveTab = hasPull
        //   ? state.ui?.requestPanel?.activeTab || ERequestPanelTabs.Playgrounds
        //   : ERequestPanelTabs.Playgrounds;

        const requestPanel = prepareUIRequestPanelState(request);

        const defaultConnection =
          request.connections?.find((c) => c.isDefault === true) ||
          DefaultConnectionState;
        const playgroundId = defaultConnection.id;

        const playgrounds = {
          // Add logic for init playgrounds by connections
          [playgroundId]: {
            id: playgroundId,
            connectionState: EConnectionState.Ideal,
            logFilters: {
              type: '',
            },
            message: initialPlaygroundMessage,
            selectedCollectionMessage: '',
          },
        };

        const runtime = {
          ...state.runtime,
          activePlayground: playgroundId,
          playgroundTabs: request.connections.map((c) => {
            return {
              id: c.id,
              name: c.name,
              meta: {
                isSaved: true,
                hasChange: false,
              },
            };
          }),
        };
        const ui = {
          ...state.ui,
          requestPanel: {
            ...requestPanel,
            activeTab: ERequestPanelTabs.Playgrounds, //uiActiveTab,
          },
        };

        const last = memoiseRequest ? { request } : {};
        set((s) => {
          return {
            last: { ...s.last, ...last },
            request,
            playgrounds,
            runtime,
            ui,
          };
        });
      },

      setLast: (initialState: IWebsocketStoreState) => {
        set((s) => ({
          ...s,
          last: initialState,
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
      ...createConnectionsLogsSlice(set, get),
      ...createPushActionSlice(set, get),
      ...createHandleConnectionExecutor(set, get),
      ...createPullActionSlice(set, get),
      ...createUiSlice(set, get, initialState.ui),

      //   ...createPushActionSlice(set, get),
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
