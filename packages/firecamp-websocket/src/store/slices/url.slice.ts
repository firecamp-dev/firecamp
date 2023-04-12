import { IUrl } from '@firecamp/types';
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
    set((s) => {
      return {
        request: {
          ...s.request,
          url,
          connection: {
            ...s.request.connection,
            queryParams: urlObj.queryParams
          },
        },
      };
    });
    state.equalityChecker({ url, connection });
  },
});

export { createUrlSlice, IUrlSlice };
