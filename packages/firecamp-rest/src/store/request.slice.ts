import { EHttpMethod, IHeader } from '@firecamp/types';
import { _clipboard } from '@firecamp/utils';
import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { _object } from '@firecamp/utils';

import { prepareUIRequestPanelState } from '../services/request.service';
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
  'scripts',
  'config',
  '__meta',
  '__ref',
];

interface IRequestSlice extends IUrlSlice, IBodySlice, IAuthSlice {
  request: IRestClientRequest;

  initialiseRequest: (request: IRestClientRequest) => void;
  initialiseRequestByKeyValue: (key: string, value: any) => void;
  changeMethod: (method: EHttpMethod) => any;
  changeHeaders: (headers: IHeader[]) => any;
  changeMeta: (__meta: any) => any;
  changeScripts: (scriptType: string, value: string) => any;
  changeConfig: (configKey: string, configValue: any) => any;
}

const createRequestSlice = (set, get, initialRequest: IRestClientRequest) => ({
  request: initialRequest,

  ...createUrlSlice(set, get),
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
    const state = get();
    set((s) => ({
      request: { ...s.request, method },
    }));
    state.equalityChecker({ method });
  },
  changeHeaders: (headers: IHeader[]) => {
    const state = get();
    const headerCount = state.runtime.authHeaders?.length + headers.length;
    const updatedUiRequestPanel = {
      hasHeaders: headerCount ? true : false,
      headers: headerCount,
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
    state.equalityChecker({ headers });
  },
  changeConfig: (configKey: string, configValue: any) => {
    const state = get();
    const updatedConfig = { ...state.request.config, [configKey]: configValue };
    const updatedUiRequestPanel = prepareUIRequestPanelState({
      config: updatedConfig,
    });
    set((s) => ({
      request: { ...s.request, config: updatedConfig },
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          ...updatedUiRequestPanel,
        },
      },
    }));
    state.equalityChecker({ config: updatedConfig });
  },
  changeMeta: (__meta) => {
    const state = get();
    const updatedMeta = {
      ...state.request.__meta,
      ...__meta,
    };
    const updatedUiRequestPanel = prepareUIRequestPanelState({
      __meta: updatedMeta,
    });

    set((s) => ({
      request: { ...s.request, __meta: updatedMeta },
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          ...updatedUiRequestPanel,
        },
      },
    }));
    state.equalityChecker({ __meta: updatedMeta });
  },
  changeScripts: (scriptType: string, value: string) => {
    //todo: will create enum for pre,post,test
    const state = get();
    const updatedScripts = {
      ...state.request.scripts,
      [scriptType]: value,
    };
    const updatedUiRequestPanel = prepareUIRequestPanelState({
      scripts: updatedScripts,
    });

    set((s) => ({
      request: { ...s.request, scripts: updatedScripts },
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          ...updatedUiRequestPanel,
        },
      },
    }));
    state.equalityChecker({ scripts: updatedScripts });
  },
});

export { createRequestSlice, IRequestSlice, requestSliceKeys };
