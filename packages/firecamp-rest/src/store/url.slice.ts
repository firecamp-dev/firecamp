import { IUrl, IQueryParam, IPathParam } from '@firecamp/types';
import _url from '@firecamp/url';
import _cloneDeep from 'lodash/cloneDeep';

import { prepareUIRequestPanelState } from '../services/rest-service';

interface IUrlSlice {
  changeUrl: (urlObj: any) => void;
  changeQueryParams: (queryParams: IQueryParam[]) => void;
  changePathParams: (pathParams: IPathParam[]) => void;
}

const createUrlSlice = (set, get, initialUrl: IUrl) => ({
  changeUrl: (urlObj: IUrl) => {
    let lastUrl = get()?.last?.request.url;
    let updatedUrl = { ...(get()?.request.url || {}), ...urlObj };
    let updatedUiRequestPanel = prepareUIRequestPanelState({
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

    // Prepare commit action for url
    get()?.prepareUrlPushAction(lastUrl, updatedUrl);
  },
  changeQueryParams: (queryParams: IQueryParam[]) => {
    let existingURL = get().request.url;
    let url = _cloneDeep(existingURL);

    // Return URL object by updating query into raw URL from table
    const { raw } = _url.updateByQuery(url, queryParams);

    // console.log({ raw });

    // Update raw URL into state
    url.raw = raw;
    url.queryParams = queryParams;

    let updatedUiRequestPanel = prepareUIRequestPanelState({
      url: { queryParams: queryParams, raw: existingURL.raw },
    });
    // console.log({ updated_query_params_url: url });

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

    // Prepare commit action for url
    get()?.prepareUrlPushAction(get()?.last?.request.url, url);
  },
  changePathParams: (pathParams: IPathParam[]) => {
    let existingURL = get().request.url;
    let url = _cloneDeep({
      ...existingURL,
      pathParams: pathParams,
    });

    let updatedUiRequestPanel = prepareUIRequestPanelState({
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
        requestPanel: {
          ...s.ui.requestPanel,
          ...updatedUiRequestPanel,
        },
      },
    }));

    // Prepare commit action for url
    get()?.prepareUrlPushAction(get()?.last?.request.url, {
      pathParams: pathParams,
    });
  },
});

export { createUrlSlice, IUrlSlice };
