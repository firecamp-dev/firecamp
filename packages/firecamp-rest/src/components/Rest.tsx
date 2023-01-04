import { memo, useEffect } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import shallow from 'zustand/shallow';
import { Container, Row, Loader } from '@firecamp/ui-kit';
import { CurlToFirecamp } from '@firecamp/curl-to-firecamp';
import { IRest } from '@firecamp/types';
import _url from '@firecamp/url';
import { _misc, _object, _table, _auth } from '@firecamp/utils';

import {
  initialiseStoreFromRequest,
  normalizeRequest,
} from '../services/request.service';
import UrlBarContainer from './common/urlbar/UrlBarContainer';
import Request from './request/Request';
import Response from './response/Response';
import CodeSnippets from './common/code-snippets/CodeSnippets';
import {
  useStore,
  StoreProvider,
  createStore,
  useStoreApi,
  IStore,
} from '../store';

const Rest = ({ tab, platformContext }) => {
  const restStoreApi: any = useStoreApi();
  const {
    isFetchingRequest,
    initialise,
    changeUrl,
    setRequestSavedFlag,
    setIsFetchingReqFlag,
    setContext,
  } = useStore(
    (s: IStore) => ({
      isFetchingRequest: s.ui.isFetchingRequest,
      initialise: s.initialise,
      changeAuthHeaders: s.changeAuthHeaders,
      changeMeta: s.changeMeta,
      changeUrl: s.changeUrl,
      setIsFetchingReqFlag: s.setIsFetchingReqFlag,
      setRequestSavedFlag: s.setRequestSavedFlag,
      setOAuth2LastFetchedToken: s.setOAuth2LastFetchedToken,
      getMergedRequestByPullAction: s.getMergedRequestByPullAction,
      setContext: s.setContext,
    }),
    shallow
  );

  //set context to store
  useEffect(() => {
    setContext(platformContext);
  }, []);

  useEffect(() => {
    setRequestSavedFlag(tab.__meta?.isSaved);
  }, [tab?.__meta?.isSaved]);

  /** subscribe/ unsubscribe request changes (pull-actions) */
  useEffect(() => {
    // subscribe request updates
    if (tab.__meta.isSaved && tab?.request.__ref?.id) {
      platformContext.request.subscribeChanges(
        tab.request.__ref.id,
        handlePull
      );
    }
    // unsubscribe request updates
    return () => {
      if (tab.__meta.isSaved && tab?.request?.__ref.id) {
        platformContext.request.unsubscribeChanges(tab.request.__ref.id);
      }
    };
  }, []);

  useEffect(() => {
    const _fetchRequest = async () => {
      try {
        const isRequestSaved = !!tab?.request?.__ref?.id || false;
        // prepare a minimal request payload
        let _request: IRest = normalizeRequest({});

        if (isRequestSaved === true) {
          setIsFetchingReqFlag(true);
          try {
            const response = await platformContext.request.onFetch(
              tab.request.__ref.id
            );
            _request = response.data;
          } catch (error) {
            console.error({
              API: 'fetch rest request',
              error,
            });
            throw error;
          }
        }

        /** initialise rest store on tab load */
        initialise(_request, tab.id);
        setIsFetchingReqFlag(false);
      } catch (e) {
        console.error(e);
      }
    };
    _fetchRequest();
  }, []);

  /**
   * Handle pull payload
   * 1. initialise/ merge request
   * 2. Generate pull action
   */
  const handlePull = async () => {};

  /**
   * on paste url, call CurlToFirecamp(curl).transform() and set resultant request data to state
   * @param curl: <type: string>
   */
  const onPasteCurl = async (curlString: string) => {
    // return if no curl or request is already saved
    if (!curlString) return;

    let { url } = restStoreApi.getState()?.request;

    let curl = curlString;

    /**
     * If not same existing url and curlString, do set substring of url
     * i.e: url= 'https://' and curlString= 'https://', do not set substring of curlString
     */
    if (
      url.raw !== curlString &&
      curlString.substring(0, (url.raw || '').length) !== url.raw
    ) {
      // Set Trimmed/ substring of curlString with the length of current state URL
      curl = curlString.substring((url.raw || '').length) || '';
    }

    if (
      url.raw === curlString.substring(0, (url.raw || '').length) &&
      curl !== curlString
    ) {
      // TODO: check usage
      // _update_request_config_fns._onChangeURLbar('raw_url', curl);
    } else {
      curl = curlString;
    }

    if (curl.substring(0, 4) !== 'curl') {
      return;
    }

    // Reset url and return is request is saved as data can not be replaced in saved request
    if (tab?.__meta?.isSaved) {
      /*  firecampFunctions.notification.alert(
         'You can not paste the CURL snippet into the saved request, please open a new empty request tab instead.',
         {    
           labels: { success: 'curl request' }
         }
       ); */

      changeUrl(url);
      return;
    }

    try {
      let curlRequest = new CurlToFirecamp(curl?.trim() || '').transform();
      console.log({ curlRequest });

      // initialiseRequest(curlRequest, false, emptyPushAction, false, true);
    } catch (error) {
      console.error({
        API: 'Rest _onPasteCurl',
        curl,
        error,
      });
    }
  };

  if (isFetchingRequest === true) return <Loader />;

  return (
    <>
      <Container className="h-full with-divider" overflow="visible">
        <UrlBarContainer
          tab={tab}
          collectionId={tab?.request?.__ref?.collectionId || ''}
          onPasteCurl={onPasteCurl}
        />
        <Container.Body>
          <Row flex={1} className="with-divider h-full" overflow="auto">
            <Request tab={tab} />
            <Response />
          </Row>
          <CodeSnippets
            tabId={tab.id}
            getPlatformEnvironments={
              platformContext.environment.getVariablesByTabId
            }
          />
        </Container.Body>
      </Container>
    </>
  );
};

const withStore = (WrappedComponent) => {
  const MyComponent = ({ tab, ...props }) => {
    const { request = {}, id } = tab;
    const initState = initialiseStoreFromRequest(request, id);
    return (
      <StoreProvider createStore={() => createStore(initState)}>
        <WrappedComponent tab={tab} {...props} />
      </StoreProvider>
    );
  };

  return MyComponent;
};
export default withStore(memo(Rest));
