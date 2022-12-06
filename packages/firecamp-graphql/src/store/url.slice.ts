import { IUrl, IQueryParam, IPathParam } from '@firecamp/types';
import _url from '@firecamp/url';
import _cloneDeep from 'lodash/cloneDeep';

import { prepareUiState } from '../services/request.service';

interface IUrlSlice {
  changeUrl: (urlObj: any) => void;
  changeQueryParams: (queryParams: IQueryParam[]) => void;
  changePathParams: (pathParams: IPathParam[]) => void;
}

const createUrlSlice = (set, get, initialUrl: IUrl) => ({
  /** change url */
  changeUrl: (urlObj: IUrl) => {
    const state = get();
    const lastUrl = state.last?.request.url;
    const updatedUrl = _cloneDeep({ ...(state.request.url || {}), ...urlObj });
    const updatedUiState = prepareUiState({
      url: urlObj,
    });

    set((s) => ({
      request: { ...s.request, url: updatedUrl },
      ui: {
        ...s.ui,
        ...updatedUiState,
      },
    }));

    /** prepare commit action for url */
    state.prepareUrlPushAction(lastUrl, updatedUrl);
  },

  /** change query params */
  changeQueryParams: (queryParams: IQueryParam[]) => {
    const state = get();
    const existingURL = state.request.url;
    const url = _cloneDeep(existingURL);

    // Return URL object by updating query into raw URL from table
    const { raw } = _url.updateByQuery(url, queryParams);

    // console.log({ raw });

    // update raw URL into state
    url.raw = raw;
    url.queryParams = queryParams;

    const updatedUiState = prepareUiState({
      url: { queryParams: queryParams, raw: existingURL.raw },
    });

    set((s) => ({
      ...s,
      request: {
        ...s.request,
        url,
      },
      ui: {
        ...s.ui,
        ...updatedUiState,
      },
    }));

    /** Prepare commit action for url */
    state.prepareUrlPushAction(state.last?.request.url, url);
  },

  /** change path params */
  changePathParams: (pathParams: IQueryParam[]) => {
    const state = get();
    const existingURL = state.request.url;
    const url = _cloneDeep({
      ...existingURL,
      pathParams: pathParams,
    });

    const updatedUiState = prepareUiState({
      url: { pathParams: pathParams, raw: existingURL.raw },
    });

    set((s) => ({
      ...s,
      request: {
        ...s.request,
        url,
      },
      ui: {
        ...s.ui,
        ...updatedUiState,
      },
    }));

    /** prepare push action for url */
    state.prepareUrlPushAction(state.last?.request.url, url);
  },
});

export { createUrlSlice, IUrlSlice };
