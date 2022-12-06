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
  initialiseRequestByKeyValue: (key: string, value: any) => void;
  changeMethod: (method: EHttpMethod) => any;
  changeHeaders: (headers: IHeader[]) => any;
  changeMeta: (meta: object) => any;
  // changeScripts: (scriptType: string, value: string) => any;
  changeConfig: (configKey: string, configValue: any) => any;
}

const createRequestSlice = (set, get, initialRequest: IGraphQL) => ({
  request: initialRequest,

  ...createUrlSlice(set, get, initialRequest.url),
  initialiseRequestByKeyValue: (key: string, value: any) => {
    set((s) => ({
      ...s,
      request: {
        ...s.request,
        [key]: value,
      },
    }));
  },

  changeMethod: (method: EHttpMethod) => {
    set((s) => ({
      ...s,
      request: { ...s.request, method },
    }));

    // Prepare commit action for method in _root
    get()?.prepareRootPushAction(
      { method: get()?.last?.request.method },
      { method }
    );
  },

  changeHeaders: (headers: IHeader[]) => {
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

    // Prepare commit action for headers in _root
    get()?.prepareRootPushAction(
      { headers: get()?.last?.request.headers },
      { headers }
    );
  },
  changeConfig: (configKey: string, configValue: any) => {
    let lastConfig = get()?.last?.request.config;
    let updatedConfig = {
      ...(get()?.request.config || {}),
      [configKey]: configValue,
    };

    set((s) => ({ ...s, request: { ...s.request, config: updatedConfig } }));

    // Prepare commit action for headers in _root
    get()?.prepareRootPushAction({ config: lastConfig }, updatedConfig);
  },
  changeMeta: (meta: object) => {
    set((s) => ({
      ...s,
      request: { ...s.request, meta: { ...s.request.meta, ...meta } },
    }));

    // Prepare commit action for meta
    get()?.prepareMetaPushAction(get()?.last?.request.meta, meta);
  },
});

export { createRequestSlice, IRequestSlice, IGraphQL, requestSliceKeys };
