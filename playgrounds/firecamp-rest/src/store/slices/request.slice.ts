import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { CurlToFirecamp } from '@firecamp/curl-to-firecamp';
import { EHttpMethod, IHeader, IRest, TId } from '@firecamp/types';
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
  changeMethod: (method: EHttpMethod) => any;
  changeHeaders: (headers: IHeader[]) => any;
  changeMeta: (__meta: Partial<IRest['__meta']>) => any;
  changeScripts: (scriptType: string, value: string) => any;
  changeConfig: (configKey: string, configValue: any) => any;
  setRequestFromCurl: (snippet: string) => void;
  save: (tabId: TId) => void;
  /** prepare the request path after request save (add/update) */
  onRequestSave: (__requestRef: IRest['__ref']) => void;
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
    const _scripts = [
      {
        ...state.request[scriptType][0],
        value: value.split('\n'),
      },
    ];
    const updatedUiRequestPanel = prepareUIRequestPanelState({
      [scriptType]: _scripts,
    });
    set((s) => ({
      request: { ...s.request, [scriptType]: _scripts },
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          ...updatedUiRequestPanel,
        },
      },
    }));
    state.equalityChecker({ [scriptType]: _scripts });
  },

  /** setup the request configuration in firecamp on CURL request paste */
  setRequestFromCurl: async (snippet: string = '') => {
    // return if no curl or request is already saved
    if (!snippet) return;
    const state = get();
    const {
      request: { url },
      request,
    } = state;
    const isCurlSnippet = snippet.startsWith('curl');
    // console.log({ snippet, isCurlSnippet });
    if (!isCurlSnippet) {
      state.changeUrl({ ...url, raw: snippet });
    } else {
      // if request is saved then simply update the url with old value, ignore paste curl
      if (request.__ref?.collectionId) {
        state.context.app.notify.alert(
          'You cannot paste the CURL snippet onto the saved request, please open a new empty request tab instead.'
        );
        // console.log(url, 787798789);
        state.changeUrl({ ...url, raw: url.raw.replace(snippet, '') });
        return;
      } else {
        try {
          const curlRequest = new CurlToFirecamp(snippet.trim()).transform();
          let { url, body, headers, config } = curlRequest;
          // only set url, body, headers, config request in state
          const newRequest = {
            ...request,
            url,
            body,
            headers,
            config,
          };
          const updatedUiRequestPanel = prepareUIRequestPanelState(newRequest);
          set((s) => ({
            request: newRequest,
            ui: {
              ...s.ui,
              requestPanel: {
                ...s.ui.requestPanel,
                ...updatedUiRequestPanel,
              },
            },
          }));
          console.log({ curlRequest });
        } catch (e) {
          state.context.app.notify.alert('The CURL snippet is not valid');
          console.error(e);
        }
      }
    }
  },
  save: (tabId) => {
    const state = get();
    if (!state.runtime.isRequestSaved) {
      // save new request
      const _request = state.preparePayloadForSaveRequest();
      state.context.request.save(_request, tabId, true).then(({ __ref }) => {
        //reset the rcs state
        state.disposeRCS();
        state.onRequestSave(__ref);
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
      if (!_request) {
        state.context.app.notify.info(
          "The request doesn't have any changes to be saved."
        );
        return null;
      }
      state.toggleUpdatingReqFlag(true);
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
        __ref: { ...s.request.__ref, __requestRef },
      },
      runtime: {
        ...s.runtime,
        requestPath,
        isRequestSaved: true,
      },
    }));
  },
});

export { createRequestSlice, IRequestSlice, requestSliceKeys };
