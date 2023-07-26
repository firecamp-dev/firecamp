import { shallow } from 'zustand/shallow';
import { IStore, useStore } from '../../store';

const useRequestFacade = () => {
  return useStore(
    (s: IStore) => ({
      tabId: s.runtime.tabId,
      preScripts: s.request.preScripts,
      postScripts: s.request.postScripts,
      requestPanel: s.ui.requestPanel,
      changeScripts: s.changeScripts,
      changeUiActiveTab: s.changeUiActiveTab,
      toggleOpenCodeSnippet: s.toggleOpenCodeSnippet,
    }),
    shallow
  );
};
export default useRequestFacade;

export const useRequestBodyFacade = () => {
  return useStore(
    (s: IStore) => ({
      // request: s.request,
      body: s.request.body,
      changeBodyValue: s.changeBodyValue,
      changeBodyType: s.changeBodyType,
      changeHeaders: s.changeHeaders,
    }),
    shallow
  );
};

export const useRequestParamsFacade = () => {
  return useStore(
    (s: IStore) => ({
      queryParams: s.request.url?.queryParams || [],
      pathParams: s.request.url?.pathParams || [],
      changeQueryParams: s.changeQueryParams,
      changePathParams: s.changePathParams,
    }),
    shallow
  );
};

export const useRequestHeadersFacade = () => {
  return useStore(
    (s: IStore) => ({
      headers: s.request.headers,
      authHeaders: s.runtime.authHeaders,
      //   runtime: s.runtime,
      changeHeaders: s.changeHeaders,
    }),
    shallow
  );
};

export const useRequestAuthFacade = () => {
  return useStore(
    (s: IStore) => ({
      auth: s.request.auth,
      runtimeAuths: s.runtime.auths,
      oauth2LastFetchedToken: s.runtime.oauth2LastFetchedToken,
      resetAuthHeaders: s.resetAuthHeaders,
      changeAuthType: s.changeAuthType,
      changeAuth: s.changeAuth,
    }),
    shallow
  );
};

export const useRequestConfigFacade = () => {
  return useStore((s: any) => [s.request.config, s.changeConfig], shallow);
};
