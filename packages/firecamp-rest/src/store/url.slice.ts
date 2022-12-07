import { IUrl, IQueryParam, IPathParam } from '@firecamp/types';
import _url from '@firecamp/url';
import _cloneDeep from 'lodash/cloneDeep';

import { prepareUIRequestPanelState } from '../services/request.service';

interface IUrlSlice {
  changeUrl: (urlObj: any) => void;
  changeQueryParams: (queryParams: IQueryParam[]) => void;
  changePathParams: (pathParams: IPathParam[]) => void;
}

const createUrlSlice = (set, get) => ({
  changeUrl: (urlObj: IUrl) => {
    const state = get();
    const updatedUrl = { ...state.request.url, ...urlObj };
    const updatedUiRequestPanel = prepareUIRequestPanelState({
      url: urlObj,
    });

    set((s) => ({
      ...s,
      request: { ...s.request, url: updatedUrl },
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          ...updatedUiRequestPanel,
        },
      },
    }));
    state.equalityChecker({ url: urlObj });
  },
  changeQueryParams: (queryParams: IQueryParam[]) => {
    const state = get();
    const url = _cloneDeep(state.request.url);

    // return URL object by updating query into raw URL from table
    const { raw } = _url.updateByQuery(url, queryParams);
    // update raw URL into state
    url.raw = raw;
    url.queryParams = queryParams;

    const updatedUiRequestPanel = prepareUIRequestPanelState({
      url: { queryParams: queryParams, raw: url.raw },
    });

    set((s) => ({
      ...s,
      request: {
        ...s.request,
        url,
      },
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          ...updatedUiRequestPanel,
        },
      },
    }));
    state.equalityChecker({ url });
  },
  changePathParams: (pathParams: IPathParam[]) => {
    const state = get();
    const url = _cloneDeep({
      ...state.request.url,
      pathParams: pathParams,
    });

    const updatedUiRequestPanel = prepareUIRequestPanelState({
      url: { pathParams: pathParams, raw: url.raw },
    });

    set((s) => ({
      ...s,
      request: {
        ...s.request,
        url,
      },
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          ...updatedUiRequestPanel,
        },
      },
    }));
    state.equalityChecker({ url });
  },
});

export { createUrlSlice, IUrlSlice };
