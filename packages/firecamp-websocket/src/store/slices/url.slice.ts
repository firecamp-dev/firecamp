import { IUrl, IQueryParam } from '@firecamp/types';

// TODO: check for path params

interface IUrlSlice {
  changeUrl: (urlObj: any) => void;
  changeQueryParams: (queryParams: IQueryParam[]) => void;
}

const createUrlSlice = (set, get): IUrlSlice => ({
  changeUrl: (urlObj: IUrl) => {
    const state = get();
    const lastUrl = state.last?.request.url;
    let updatedUrl = { ...(state.request.url || {}), ...urlObj };

    set((s) => ({ ...s, request: { ...s.request, url: updatedUrl } }));

    // Prepare push action for url
    state.prepareUrlPushAction(lastUrl, updatedUrl);
  },
  changeQueryParams: (queryParams: IQueryParam[]) => {
    const state = get();
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
    state.prepareUrlPushAction(state.last?.request.url, {
      queryParams,
    });
  },
});

export { createUrlSlice, IUrlSlice };
