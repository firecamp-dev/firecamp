import { TId, EHttpMethod, IHeader, IGraphQL, IRest } from '@firecamp/types';
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
  save: (tabId: TId) => void;
  /** prepare the request path after request save (add/update) */
  onRequestSave: (__requestRef: Partial<IRest['__ref']>) => void;
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
  save: (tabId) => {
    const state = get();
    if (!state.runtime.isRequestSaved) {
      // save new request
      const _request = state.preparePayloadForSaveRequest();
      state.context.request
        .save(_request, tabId, true)
        .then(({ __ref }) => {
          //reset the rcs state
          state.disposeRCS();
          state.onRequestSave(__ref);
        })
        .then(() => {
          setTimeout(() => {
            for (var pId in state.playgrounds) {
              const plg = state.playgrounds[pId];
              state.addItem(plg.request.name, pId, true);
            }
          });
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
          state.onRequestSave(_request.__ref);
        })
        .finally(() => {
          state.toggleUpdatingReqFlag(false);
        });
    }
  },
  onRequestSave: (__requestRef) => {
    const state = get();
    const { id } = __requestRef;
    const requestPath = id
      ? state.context?.request.getPath(id)
      : { path: '', items: [] };
    set((s) => ({
      request: {
        ...s.request,
        __ref: { ...s.request.__ref, ...__requestRef },
      },
      runtime: {
        ...s.runtime,
        requestPath,
        isRequestSaved: true,
      },
    }));
  },
});

export { createRequestSlice, IRequestSlice, IGraphQL, requestSliceKeys };
