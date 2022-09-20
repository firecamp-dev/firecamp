import create from 'zustand';
import createContext from 'zustand/context';
import { buildClientSchema, getIntrospectionQuery } from 'graphql';

import {
  IRequestSlice,
  createRequestSlice,
  requestSliceKeys,
  IPlaygrounds,
  IPlaygroundsSlice,
  createPlaygroundsSlice,
  ICollection,
  ICollectionSlice,
  createCollectionSlice,
  IPushActionSlice,
  IPushAction,
  createPushActionSlice,
  createRuntimeSlice,
  IRuntime,
  IRuntimeSlice,
  IPullslice,
  createPullActionSlice,
  createUiSlice,
  IUi,
  IUiSlice,
} from './index';
import { ERestBodyTypes, IGraphQL, IRest } from '@firecamp/types';
import { IRestResponse } from '@firecamp/types';
import { _object } from '@firecamp/utils';

const {
  Provider: GraphQLStoreProvider,
  useStore: useGraphQLStore,
  useStoreApi: useGraphQLStoreApi,
} = createContext();

interface IGraphQLStore
  extends IRequestSlice,
    IPlaygroundsSlice,
    IRuntimeSlice,
    IPushActionSlice,
    ICollectionSlice,
    IPullslice,
    IUiSlice {
  last: any;

  setLast: (initialState: IGraphQLStoreState) => void;
  initialise: (
    initialState: IGraphQLStoreState,
    collection: ICollection,
    isFresh: boolean
  ) => void;
  context?: any;
  setContext: (ctx: any) => void;
  getRequest: () => IRest;
  execute?: (query?: string, variables?: string) => Promise<IRestResponse>;
  fetchIntrospectionSchema: () => Promise<void>;
}

interface IGraphQLStoreState {
  request: IGraphQL;
  pushAction?: IPushAction;
  playgrounds: IPlaygrounds;
  runtime?: IRuntime;
  ui?: IUi;
}

const createGraphQLStore = (initialState: IGraphQLStoreState) =>
  create<IGraphQLStore>((set, get): IGraphQLStore => {
    return {
      ...createRequestSlice(
        set,
        get,
        initialState.request //_object.pick(initialState.request, requestSliceKeys)
      ),
      ...createPlaygroundsSlice(set, get),
      ...createRuntimeSlice(set, get),
      ...createPushActionSlice(set, get),
      ...createCollectionSlice(set, get),
      ...createPullActionSlice(set, get),
      ...createUiSlice(set, get, initialState.ui),

      last: initialState,

      setLast: (initialState: IGraphQLStoreState) => {
        set((s) => ({
          ...s,
          last: initialState,
        }));
      },

      initialise: (initialState, collection: ICollection, isFresh: boolean) => {
        const state = get();

        // request
        let initialRequest: IGraphQL = _object.pick(
          initialState.request,
          requestSliceKeys
        ) as IGraphQL;

        // console.log({ initialRequest, initialState });

        if (!_object.isEmpty(initialRequest))
          state.initialiseRequest(initialRequest);

        if (initialState.ui) state.initializeUi(initialState.ui);

        if (!_object.isEmpty(collection))
          state.initialiseCollection(collection);

        if (initialState.pushAction)
          state.initializePushAction(initialState.pushAction);

        // console.log({ initialState });

        if (isFresh) set({ last: initialState });

        // runtime
      },

      setContext: (ctx: any) => set({ context: ctx }),

      getRequest: (): any | Partial<IGraphQL> => {
        // request
        const state = get();
        const request: Partial<IGraphQL> = {
          ..._object.pick(state.request, [
            'url',
            'method',
            'headers',
            'meta',
            '_meta',
          ]),
        };

        // request.meta = { active_body_type: ERestBodyTypes.GraphQL };
        // console.log({ request });
        return request;
      },

      execute: async (opsName: string, query?: string, variables?: string) => {
        const state = get();
        const request = state.getRequest();
        // const certificates = [],
        // proxies = [];
        const activePlayground = state.runtime.activePlayground;
        if(!request?.url?.raw) return;

        request.body = {
          [ERestBodyTypes.GraphQL]: {
            value: query,
            variables,
          },
        };
        request.meta.active_body_type = ERestBodyTypes.GraphQL;

        // let response: IRestResponse = { statusCode: 0 };
        state.setRequestRunningFlag(activePlayground, true);
        return state.context.request
          .execute(request)
          .then((r: IRestResponse) => {
            state.setPlaygroundResponse(r);
            return r;
          })
          .catch((e: IRestResponse) => {
            state.setPlaygroundResponse(e);
            return e;
          })
          .finally(() => {
            state.setRequestRunningFlag(activePlayground, false);
          });
      },

      fetchIntrospectionSchema: async () => {
        const state = get();
        if(state.runtime.isFetchingIntrospection) return;
        
        const query = getIntrospectionQuery();
        const request = state.getRequest();
        // let response;
        // const certificates = [],
        // proxies = [];

        request.body = {
          [ERestBodyTypes.GraphQL]: {
            value: query,
            // variables
          },
        };
        request.meta.active_body_type = ERestBodyTypes.GraphQL;

        state.setFetchIntrospectionFlag(true);
        state.context.request
          .execute(request)
          .then((r: { data: string }) => {
            try {
              const schema = JSON.parse(r.data).data;
              state.setSchema(schema);
            } catch (e) {}
          })
          .catch((e: any) => {
            console.log(e, 'e...');
          })
          .finally(()=> {
            state.setFetchIntrospectionFlag(false);
          });
      },
    };
  });

export {
  IGraphQLStore,
  GraphQLStoreProvider,
  createGraphQLStore,
  useGraphQLStore,
  useGraphQLStoreApi,
  IGraphQLStoreState,
};
