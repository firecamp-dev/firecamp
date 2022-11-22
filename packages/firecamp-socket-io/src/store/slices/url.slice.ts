import { IUrl, IQueryParam } from '@firecamp/types';

// TODO: check for path params

interface IUrlSlice {
  changeUrl: (urlObj: any) => void;
  changeQueryParams: (queryParams: IQueryParam[]) => void;
}

const createUrlSlice = (set, get): IUrlSlice => ({
  changeUrl: (urlObj: IUrl) => {
    let lastUrl = get()?.last?.request.url;
    let updatedUrl = { ...(get()?.request.url || {}), ...urlObj };

    set((s) => ({ ...s, request: { ...s.request, url: updatedUrl } }));

    // Prepare push action for url
    get()?.prepareUrlPushAction(lastUrl, updatedUrl);
  },
  changeQueryParams: (queryParams: IQueryParam[]) => {
    set((s) => ({
      ...s,
      request: {
        ...s.request,
        url: { ...s.request.url, queryParams },
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

    // Prepare push action for url
    get()?.prepareUrlPushAction(get()?.last?.request.url, {
      queryParams: queryParams,
    });
  },
});

export { createUrlSlice, IUrlSlice };
