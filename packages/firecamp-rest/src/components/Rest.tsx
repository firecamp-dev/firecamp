import { memo, useEffect } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import shallow from 'zustand/shallow';
import { Container, Row, Loader } from '@firecamp/ui-kit';
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

  if (isFetchingRequest === true) return <Loader />;

  return (
    <>
      <Container className="h-full with-divider" overflow="visible">
        <UrlBarContainer
          tab={tab}
          collectionId={tab?.request?.__ref?.collectionId || ''}
        />
        <Container.Body>
          <Row flex={1} className="with-divider h-full" overflow="auto">
            <Request tab={tab} />
            <Response />
          </Row>
          {/* <CodeSnippets tabId={tab.id} getPlatformEnvironments={() => {}} /> */}
        </Container.Body>
      </Container>
    </>
  );
};

const withStore = (WrappedComponent) => {
  const MyComponent = ({ tab, ...props }) => {
    const { request = {}, id } = tab;
    const initState = initialiseStoreFromRequest(request, id);
    console.log(initialiseStoreFromRequest, initState);
    return (
      <StoreProvider createStore={() => createStore(initState)}>
        <WrappedComponent tab={tab} {...props} />
      </StoreProvider>
    );
  };

  return MyComponent;
};
export default withStore(memo(Rest));
