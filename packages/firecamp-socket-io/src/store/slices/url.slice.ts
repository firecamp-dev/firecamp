import { IUrl, IQueryParam } from '@firecamp/types';
import { TStoreSlice } from '../store.type';
interface IUrlSlice {
  changeUrl: (urlObj: any) => void;
  changeQueryParams: (queryParams: IQueryParam[]) => void;
}

const getPathFromUrl = (url: string) => {
  return url.split(/[?#]/)[0];
};

const createUrlSlice: TStoreSlice<IUrlSlice> = (set, get) => ({
  changeUrl: (urlObj: IUrl) => {
    const state = get();
    const url = { raw: getPathFromUrl(urlObj.raw) };
    set((s) => {
      const { activePlayground } = s.runtime;
      const connections = s.request.connections.map((c) => {
        if (c.id == activePlayground) {
          c.queryParams = urlObj.queryParams;
        }
        return c;
      });
      return {
        request: { ...s.request, url, connections },
        runtime: { ...s.runtime, displayUrl: urlObj.raw },
      };
    });
    state.equalityChecker({ url });
  },
  changeQueryParams: (queryParams: IQueryParam[]) => {
    const state = get();
    const url = { ...state.request.url, queryParams };
    set((s) => ({
      request: {
        ...s.request,
        url,
      },
      // manage ui state
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          hasParams: queryParams.length !== 0,
        },
      },
    }));
    state.equalityChecker({ url });
  },
});

export { createUrlSlice, IUrlSlice };
