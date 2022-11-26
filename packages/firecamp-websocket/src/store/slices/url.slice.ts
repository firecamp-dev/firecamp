import { IUrl, IQueryParam } from '@firecamp/types';

interface IUrlSlice {
  changeUrl: (urlObj: any) => void;
  changeQueryParams: (queryParams: IQueryParam[]) => void;
}

const getPathFromUrl = (url: string) => {
  return url.split(/[?#]/)[0];
};

const createUrlSlice = (set, get): IUrlSlice => ({
  changeUrl: (urlObj: IUrl) => {
    console.log(urlObj, 'this is the url');
    const url = { raw: getPathFromUrl(urlObj.raw) };

    set((s) => {
      const { activePlayground } = s.runtime;
      const connections = s.request.connections.map((c) => {
        if (c.id == activePlayground) {
          c.queryParams = urlObj.queryParams;
        }
        return c;
      });
      return {
        ...s,
        request: { ...s.request, url, connections },
        runtime: { ...s.runtime, displayUrl: urlObj.raw },
      };
    });

    // state.prepareUrlPushAction(lastUrl, updatedUrl);
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
