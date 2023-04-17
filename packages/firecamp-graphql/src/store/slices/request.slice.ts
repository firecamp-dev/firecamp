import { getIntrospectionQuery } from 'graphql';
import {
  TId,
  EHttpMethod,
  IHeader,
  IGraphQL,
  IRestResponse,
  ERestBodyTypes,
  ERequestTypes,
} from '@firecamp/types';
import { TStoreSlice } from '../store.type';
import { IUrlSlice, createUrlSlice } from './index';

const requestSliceKeys = [
  'url',
  'method',
  'headers',
  'config',
  '__meta',
  '__ref',
];

interface IRequestSlice extends IUrlSlice {
  request: IGraphQL;
  changeMethod: (method: EHttpMethod) => any;
  changeHeaders: (headers: IHeader[]) => any;
  changeMeta: (__meta: Partial<IGraphQL['__meta']>) => any;
  changeConfig: (configKey: string, configValue: any) => any;
  fetchIntrospectionSchema: () => Promise<void>;
  save: (tabId: TId) => void;
  /** prepare the request path after request save (add/update) */
  onRequestSave: (requestId: TId) => void;
}

const createRequestSlice: TStoreSlice<IRequestSlice> = (
  set,
  get,
  initialRequest: IGraphQL
) => ({
  request: initialRequest,

  ...createUrlSlice(set, get, initialRequest.url),

  changeMethod: (method: EHttpMethod) => {
    const state = get();
    set((s) => ({
      request: { ...s.request, method },
    }));
    state.equalityChecker({ method });
  },

  changeHeaders: (headers: IHeader[]) => {
    const state = get();
    const headersLength = headers.length;
    set((s) => ({
      ...s,
      request: { ...s.request, headers },
      ui: {
        ...s.ui,
        headers: headersLength,
      },
    }));
    state.equalityChecker({ headers });
  },
  changeConfig: (configKey: string, configValue: any) => {
    const state = get();
    const config = {
      ...state.request.config,
      [configKey]: configValue,
    };
    set((s) => ({ ...s, request: { ...s.request, config } }));
    state.equalityChecker({ config });
  },
  changeMeta: (__meta) => {
    const state = get();
    const updatedMeta = {
      ...state.request.__meta,
      ...__meta,
    };
    set((s) => ({
      request: { ...s.request, __meta: updatedMeta },
    }));
    state.equalityChecker({ __meta: updatedMeta });
  },
  fetchIntrospectionSchema: async () => {
    const state = get();
    const {
      request,
      runtime: { isFetchingIntrospection },
    } = state;
    if (isFetchingIntrospection) return;

    const query = getIntrospectionQuery();
    const _request = Object.assign(
      {},
      {
        ...request,
        __meta: request.__meta,
        body: {
          value: { query, variables: {} },
          type: ERestBodyTypes.GraphQL,
        },
      }
    );
    state.setFetchIntrospectionFlag(true);
    state.context.request
      .execute(_request)
      .then((r: { data: string }) => {
        try {
          const schema = JSON.parse(r.data).data;
          state.setSchema(schema);
        } catch (e) {}
      })
      .catch((e: any) => {
        console.log(e, 'e...');
      })
      .finally(() => {
        state.setFetchIntrospectionFlag(false);
      });
  },
  save: (tabId) => {
    const state = get();
    if (!state.runtime.isRequestSaved) {
      // save new request
      const _request = state.preparePayloadForSaveRequest();
      state.context.request.save(_request, tabId, true).then(() => {
        //reset the rcs state
        state.disposeRCS();
        state.onRequestSave(_request.__ref.id);
      });
      // TODO: // state.context.request.subscribeChanges(_request.__ref.id, handlePull);
    } else {
      if (!state.requestHasChanges) {
        state.context.app.notify.info(
          "The request doesn't have any changes to be saved."
        );
        return null;
      }
      // update request
      const _request = state.preparePayloadForUpdateRequest();
      state.toggleUpdatingReqFlag(true);
      if (!_request) {
        state.context.app.notify.info(
          "The request doesn't have any changes to be saved."
        );
        return null;
      }
      state.context.request
        .save(_request, tabId)
        .then(() => {
          //reset the rcs state
          state.disposeRCS();
          state.onRequestSave(_request.__ref.id);
        })
        .finally(() => {
          state.toggleUpdatingReqFlag(false);
        });
    }
  },
  onRequestSave: (requestId) => {
    const state = get();
    const requestPath = requestId
      ? state.context?.request.getPath(requestId)
      : { path: '', items: [] };

    set((s) => ({
      runtime: {
        ...s.runtime,
        requestPath,
      },
    }));
  },
});

export { createRequestSlice, IRequestSlice, IGraphQL, requestSliceKeys };
