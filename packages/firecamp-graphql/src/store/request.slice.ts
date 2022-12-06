import { EHttpMethod, IHeader, IGraphQL } from '@firecamp/types';

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
}

const createRequestSlice = (set, get, initialRequest: IGraphQL) => ({
  request: initialRequest,

  ...createUrlSlice(set, get, initialRequest.url),

  changeMethod: (method: EHttpMethod) => {
    const state = get();
    set((s) => ({
      request: { ...s.request, method },
    }));

    // prepare commit action for method in _root
    state.prepareRootPushAction(
      { method: state.last?.request.method },
      { method }
    );
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

    // prepare commit action for headers in _root
    state.prepareRootPushAction(
      { headers: state.last?.request.headers },
      { headers }
    );
  },
  changeConfig: (configKey: string, configValue: any) => {
    const state = get();
    const lastConfig = state.last?.request.config;
    const updatedConfig = {
      ...state.request.config,
      [configKey]: configValue,
    };

    set((s) => ({ ...s, request: { ...s.request, config: updatedConfig } }));

    // prepare commit action for headers in _root
    state.prepareRootPushAction({ config: lastConfig }, updatedConfig);
  },
  changeMeta: (__meta: object) => {
    const state = get();
    set((s) => ({
      request: { ...s.request, __meta: { ...s.request.__meta, ...__meta } },
    }));

    // prepare commit action for __meta
    state.prepareMetaPushAction(state.last?.request.__meta, __meta);
  },
});

export { createRequestSlice, IRequestSlice, IGraphQL, requestSliceKeys };
