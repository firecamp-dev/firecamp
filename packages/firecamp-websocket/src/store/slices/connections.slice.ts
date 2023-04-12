import { IQueryParam } from '@firecamp/types';
import _url from '@firecamp/url';
import { TStoreSlice } from '../store.type';

interface IConnectionsSlice {
  updateConnection: (key: string, value: any) => void;
  changeConQueryParams: (qps: IQueryParam[]) => void;
}

const createConnectionSlice: TStoreSlice<IConnectionsSlice> = (set, get) => ({
  updateConnection: (key: string, value: any) => {
    //if connection id not provided, queryParams has dedicated change fn below
    if (!key || key == 'queryParams') return;

    set((s) => ({
      request: {
        ...s.request,
        connection: {
          ...s.request.connection,
          [key]: value,
        },
      },
    }));
  },

  changeConQueryParams: (qps) => {
    const state = get();
    const { connection } = state.request;
    const newUrl = _url.updateByQuery(state.request.url, qps);

    set((s) => ({
      request: {
        ...s.request,
        url: newUrl,
        connection: {
          ...s.request.connection,
          queryParams: qps,
        },
      },
    }));
    state.equalityChecker({ connection });
  },
});

export { IConnectionsSlice, createConnectionSlice };
