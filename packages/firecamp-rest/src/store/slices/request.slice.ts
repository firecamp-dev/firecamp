import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { EFirecampAgent, EHttpMethod, IHeader, TId } from '@firecamp/types';
import { _clipboard } from '@firecamp/utils';
import { _object } from '@firecamp/utils';
import { prepareUIRequestPanelState } from '../../services/request.service';
import { IRestClientRequest } from '../../types';
import { TStoreSlice } from '../store.type';
import {
  IUrlSlice,
  createUrlSlice,
  createBodySlice,
  IBodySlice,
  createAuthSlice,
  IAuthSlice,
} from './index';

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
  execute(
    variables: {
      collection?: {};
    },
    fcAgent: EFirecampAgent
  ): void;
  save: (tabId: TId) => void;
}

const createRequestSlice: TStoreSlice<IRequestSlice> = (
  set,
  get,
  initialRequest: IRestClientRequest
) => ({
  request: initialRequest,
  ...createUrlSlice(set, get),
  ...createBodySlice(set, get, initialRequest.body),
  ...createAuthSlice(set, get),
  initialiseRequest: (request: IRestClientRequest) => {
    // console.log({initReq: request});
    set((s) => ({
      request,
    }));
  },
  initialiseRequestByKeyValue: (key: string, value: any) => {
    set((s) => ({
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
  execute: async (
    variables: {
      collection?: {};
    },
    fcAgent: EFirecampAgent
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
  save: (tabId) => {
    const state = get();
    if (!state.runtime.isRequestSaved) {
      // sae new request
      const _request = state.preparePayloadForSaveRequest();
      state.context.request.save(_request, tabId, true).then(console.log);
      // TODO: // state.context.request.subscribeChanges(_request.__ref.id, handlePull);
    } else {
      // update request
      const _request = state.preparePayloadForUpdateRequest();
      if (!_request) {
        state.context.app.notify.info(
          "The request doesn't have any changes to be saved."
        );
        return null;
      }
      state.context.request.save(_request, tabId).then(() => {
        //reset the rcs state
        state.disposeRCS();
      });
    }
  },
});

export { createRequestSlice, IRequestSlice, requestSliceKeys };
