import _cloneDeep from 'lodash/cloneDeep';
import _url from '@firecamp/url';
import { IUrl, IQueryParam, IPathParam } from '@firecamp/types';
import { CurlToFirecamp } from '@firecamp/curl-to-firecamp';
import { prepareUIRequestPanelState } from '../../services/request.service';
import { TStoreSlice } from '../store.type';

interface IUrlSlice {
  changeUrl: (urlObj: any) => void;
  changeQueryParams: (queryParams: IQueryParam[]) => void;
  changePathParams: (pathParams: IPathParam[]) => void;
  onPasteCurl: (snippet: string) => void;
}

const createUrlSlice: TStoreSlice<IUrlSlice> = (set, get) => ({
  changeUrl: (urlObj: IUrl) => {
    const state = get();
    const updatedUrl = { ...state.request.url, ...urlObj };
    const updatedUiRequestPanel = prepareUIRequestPanelState({
      url: urlObj,
    });
    set((s) => ({
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

  /**
   * setup the request configuration in firecamp on CURL request paste
   */
  onPasteCurl: async (snippet: string) => {
    // return if no curl or request is already saved
    if (!snippet) return;
    const state = get();
    const {
      request: { url },
      request,
    } = state;
    const isCurlSnippet = snippet.startsWith('curl');
    console.log({ snippet, isCurlSnippet });
    if (!isCurlSnippet) {
      state.changeUrl({ ...url, raw: snippet });
    } else {
      // if request is saved then simply update the url with old value, ignore paste curl
      if (request.__ref?.collectionId) {
        state.context.app.notify.alert(
          'You can not paste the CURL snippet onto the saved request, please open a new empty request tab instead.'
        );
        state.changeUrl({ ...url, raw: url.raw.replace(snippet, '') });
        return;
      } else {
        try {
          const curlRequest = new CurlToFirecamp(snippet?.trim()).transform();
          console.log({ curlRequest });
          // TODO: set request in state
        } catch (e) {
          console.error(e);
        }
      }
    }
  },
});

export { createUrlSlice, IUrlSlice };
