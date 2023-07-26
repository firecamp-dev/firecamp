import { shallow } from 'zustand/shallow';
import { IStore, useStore } from '../../../store';

const useUrlBarFacade = () => {
  return useStore(
    (s: IStore) => ({
      tabId: s.runtime.tabId,
      url: s.request.url,
      method: s.request.method,
      __meta: s.request.__meta,
      __ref: s.request.__ref,
      requestPath: s.runtime.requestPath,
      isRequestSaved: s.runtime.isRequestSaved,
      context: s.context,
      changeUrl: s.changeUrl,
      changeMethod: s.changeMethod,
      execute: s.execute,
      setRequestFromCurl: s.setRequestFromCurl,
    }),
    shallow
  );
};
export default useUrlBarFacade;

export const useUrlBarSuffixButtonsFacade = () => {
  return useStore(
    (s: IStore) => ({
      tabId: s.runtime.tabId,
      isRequestRunning: s.runtime.isRequestRunning,
      // isRequestSaved: s.runtime.isRequestSaved,
      isUpdatingRequest: s.ui.isUpdatingRequest,
      // requestHasChanges: s.requestHasChanges,
      execute: s.execute,
      save: s.save,
    }),
    shallow
  );
};
