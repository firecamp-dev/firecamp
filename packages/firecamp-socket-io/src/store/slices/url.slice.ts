import _url from '@firecamp/url';
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
    set((s) => ({ request: { ...s.request, url } }));
    state.equalityChecker({ url });
  },
  changeQueryParams: (qps: IQueryParam[]) => {
    const state = get();
    const { connection } = state.request;
    const newUrl = _url.updateByQuery(state.request.url, qps);
    set((s) => ({
      request: {
        ...s.request,
        url: newUrl,
        connection: { ...connection, queryParams: qps },
      },
      // manage ui state
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          hasParams: qps.length !== 0,
        },
      },
    }));
    state.equalityChecker({ url: newUrl });
  },
});

export { createUrlSlice, IUrlSlice };
