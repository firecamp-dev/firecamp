import { EHttpMethod, IHeader, IGraphQL, TId } from '@firecamp/types';
import { normalizeRequest } from '../services/request.service';

import {
  IUrlSlice,
  createUrlSlice,
  // createBodySlice,
  // IBodySlice,
  // createAuthSlice,
  // IAuthSlice,
} from './index';

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
  changeMeta: (__meta: object) => any;
  // changeScripts: (scriptType: string, value: string) => any;
  changeConfig: (configKey: string, configValue: any) => any;
  save: (tabId: TId) => void;
}

const createRequestSlice = (set, get, initialRequest: IGraphQL) => ({
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
        hasHeaders: !!headersLength,
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
  changeMeta: (__meta: object) => {
    const state = get();
    set((s) => ({
      request: { ...s.request, __meta: { ...s.request.__meta, ...__meta } },
    }));
    state.equalityChecker({ __meta });
  },
  save: (tabId) => {
    const state = get();
    const {
      request,
      runtime: { isRequestSaved },
    } = state;
    if (!isRequestSaved) {
      const _request = normalizeRequest(request);
      state.context.request.save(_request, tabId);
    }
  },
});

export { createRequestSlice, IRequestSlice, IGraphQL, requestSliceKeys };
