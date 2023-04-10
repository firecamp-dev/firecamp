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
