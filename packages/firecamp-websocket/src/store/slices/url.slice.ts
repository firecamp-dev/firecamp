import { IUrl, IQueryParam } from '@firecamp/types';
import { TStoreSlice } from '../store.type';

interface IUrlSlice {
  changeUrl: (urlObj: any) => void;
}
const getPathFromUrl = (url: string) => {
  return url.split(/[?#]/)[0];
};

const createUrlSlice: TStoreSlice<IUrlSlice> = (set, get) => ({
  changeUrl: (urlObj: IUrl) => {
    const state = get();
    const url = { ...state.request.url, raw: getPathFromUrl(urlObj.raw) };
    const { activePlayground } = state.runtime;
    const connections = state.request.connections.map((c) => {
      if (c.id == activePlayground) {
        c.queryParams = urlObj.queryParams;
      }
      return c;
    });
    set((s) => {
      return {
        request: { ...s.request, url, connections },
        runtime: { ...s.runtime, displayUrl: urlObj.raw },
      };
    });
    state.equalityChecker({ url, connections });
  },
});

export { createUrlSlice, IUrlSlice };
