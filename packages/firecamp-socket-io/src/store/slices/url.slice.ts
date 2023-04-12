import _url from '@firecamp/url';
import { IUrl, IQueryParam } from '@firecamp/types';
import { TStoreSlice } from '../store.type';
import { prepareConnectionPanelUiState } from '../../services/request.service';
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
    const _request = { ...state.request, url };
    const cPanelUi = prepareConnectionPanelUiState(_request);
    set((s) => ({
      request: _request,
      ui: { ...s.ui, connectionPanel: cPanelUi },
    }));
    state.equalityChecker({ url });
  },
  changeQueryParams: (qps: IQueryParam[]) => {
    const state = get();
    const { connection } = state.request;
    const newUrl = _url.updateByQuery(state.request.url, qps);
    const _request = {
      ...state.request,
      url: newUrl,
      connection: { ...connection, queryParams: qps },
    };
    const cPanelUi = prepareConnectionPanelUiState(_request);
    set((s) => ({
      request: _request,
      ui: { ...s.ui, connectionPanel: cPanelUi },
    }));
    state.equalityChecker({ url: newUrl });
  },
});

export { createUrlSlice, IUrlSlice };
