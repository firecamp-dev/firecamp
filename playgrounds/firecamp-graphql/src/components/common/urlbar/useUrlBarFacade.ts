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
      fetchIntrospectionSchema: s.fetchIntrospectionSchema,
    }),
    shallow
  );
};

export default useUrlBarFacade;
