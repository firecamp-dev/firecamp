import { EHttpMethod, IHeader } from '@firecamp/types';
import { _clipboard } from '@firecamp/utils';
import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { _object } from '@firecamp/utils';

import { prepareUIRequestPanelState } from '../services/rest-service';
import {
  IUrlSlice,
  createUrlSlice,
  createBodySlice,
  IBodySlice,
  createAuthSlice,
  IAuthSlice,
} from './index';

import { IRestClientRequest } from '../types';

const requestSliceKeys = [
  'url',
  'method',
  'headers',
  'body',
  'auth',
  'meta',
  'scripts',
  'config',
  '_meta',
];

interface IRequestSlice extends IUrlSlice, IBodySlice, IAuthSlice {
  request: IRestClientRequest;

  initialiseRequest: (request: IRestClientRequest) => void;
  initialiseRequestByKeyValue: (key: string, value: any) => void;
  changeMethod: (method: EHttpMethod) => any;
  changeHeaders: (headers: IHeader[]) => any;
  changeMeta: (meta: any) => any;
  changeScripts: (scriptType: string, value: string) => any;
  changeConfig: (configKey: string, configValue: any) => any;
}

const createRequestSlice = (set, get, initialRequest: IRestClientRequest) => ({
  request: initialRequest,

  ...createUrlSlice(set, get, initialRequest.url),
  ...createBodySlice(set, get, initialRequest.body),
  ...createAuthSlice(set, get, initialRequest.auth),

  initialiseRequest: (request: IRestClientRequest) => {
    // console.log({initReq: request});
    set((s) => ({
      ...s,
      request,
    }));

    // console.log({req: get().request});
  },

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
    // let updatedUiRequestPanel = prepareUIRequestPanelState({ headers });

    let headersLength = get().runtime.auth_headers?.length + headers.length;
    let updatedUiRequestPanel = {
      hasHeaders: headersLength ? true : false,
      headers: headersLength,
    };

    set((s) => ({
      ...s,
      request: { ...s.request, headers },
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          ...updatedUiRequestPanel,
        },
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
    let updatedUiRequestPanel = prepareUIRequestPanelState({
      config: updatedConfig,
    });

    set((s) => ({
      ...s,
      request: { ...s.request, config: updatedConfig },
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          ...updatedUiRequestPanel,
        },
      },
    }));

    // Prepare commit action for headers in _root
    get()?.prepareRootPushAction(
      { config: lastConfig },
      { config: updatedConfig }
    );
  },
  changeMeta: (meta) => {
    let lastMeta = get()?.last?.request.meta;
    let updatedMeta = {
      ...(get()?.request.meta || {}),
      ...meta,
    };

    let updatedUiRequestPanel = prepareUIRequestPanelState({
      meta: updatedMeta,
    });

    set((s) => ({
      ...s,
      request: { ...s.request, meta: updatedMeta },
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          ...updatedUiRequestPanel,
        },
      },
    }));

    // Prepare commit action for meta
    get()?.prepareMetaPushAction(lastMeta, updatedMeta);
  },
  changeScripts: (scriptType: string, value: string) => {
    //todo: will create enum for pre,post,test

    let lastScripts = get()?.last?.request.scripts;
    let udpatedScripts = {
      ...(get()?.request.scripts || {}),
      [scriptType]: value,
    };
    let updatedUiRequestPanel = prepareUIRequestPanelState({
      scripts: udpatedScripts,
    });

    set((s) => ({
      ...s,
      request: { ...s.request, scripts: udpatedScripts },
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          ...updatedUiRequestPanel,
        },
      },
    }));

    // Prepare commit action for headers in scripts
    get()?.prepareScriptsPushAction(lastScripts, udpatedScripts);
  },
});

export { createRequestSlice, IRequestSlice, requestSliceKeys };
