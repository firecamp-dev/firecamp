import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import {
  EFirecampAgent,
  EHttpMethod,
  IHeader,
  IRest,
  TId,
} from '@firecamp/types';
import { _clipboard } from '@firecamp/utils';
import { _object } from '@firecamp/utils';
import { prepareUIRequestPanelState } from '../../services/request.service';
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
  request: IRest;
  initialiseRequest: (request: IRest) => void;
  initialiseRequestByKeyValue: (key: string, value: any) => void;
  changeMethod: (method: EHttpMethod) => any;
  changeHeaders: (headers: IHeader[]) => any;
  changeMeta: (__meta: Partial<IRest['__meta']>) => any;
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
  initialRequest: IRest
) => ({
  request: initialRequest,
  ...createUrlSlice(set, get),
  ...createBodySlice(set, get, initialRequest.body),
  ...createAuthSlice(set, get),
  initialiseRequest: (request: IRest) => {
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
    set((s) => ({
      request: { ...s.request, __meta: updatedMeta },
    }));
    state.equalityChecker({ __meta: updatedMeta });
  },
  changeScripts: (scriptType: 'preScripts' | 'postScripts', value: string) => {
    //todo: will create enum for preScripts, postScripts
    const state = get();
    const _script = {
      ...state.request[scriptType][0],
      value: value.split('\n'),
    };
    const updatedUiRequestPanel = prepareUIRequestPanelState({
      [scriptType]: _script,
    });
    set((s) => ({
      request: { ...s.request, [scriptType]: [_script] },
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          ...updatedUiRequestPanel,
        },
      },
    }));
    state.equalityChecker({ [scriptType]: [_script] });
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
      // save new request
      const _request = state.preparePayloadForSaveRequest();
      state.context.request.save(_request, tabId, true).then(() => {
        //reset the rcs state
        state.disposeRCS();
      });
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
