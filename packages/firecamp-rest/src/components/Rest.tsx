import { memo, useEffect } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import shallow from 'zustand/shallow';
import {
  Container,
  Row,
  Loader,
  ProgressBar,
  RootContainer,
} from '@firecamp/ui';
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
// import CodeSnippets from './common/code-snippets/CodeSnippets';
import { useStore, StoreProvider, createStore, IStore } from '../store';

const Rest = ({ tab, platformContext }) => {
  const {
    isFetchingRequest,
    initialise,
    setRequestSavedFlag,
    toggleFetchingReqFlag,
    setParentArtifacts,
    setContext,
  } = useStore(
    (s: IStore) => ({
      isFetchingRequest: s.ui.isFetchingRequest,
      initialise: s.initialise,
      changeAuthHeaders: s.changeAuthHeaders,
      changeMeta: s.changeMeta,
      toggleFetchingReqFlag: s.toggleFetchingReqFlag,
      setRequestSavedFlag: s.setRequestSavedFlag,
      setOAuth2LastFetchedToken: s.setOAuth2LastFetchedToken,
      setParentArtifacts: s.setParentArtifacts,
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
    const requestId = tab.entity?.__ref?.id;
    // subscribe request updates
    if (tab.__meta.isSaved && tab?.entity.__ref?.id) {
      platformContext.request.subscribeChanges(requestId, handlePull);
    }
    // unsubscribe request updates
    return () => {
      if (tab.__meta.isSaved && requestId) {
        platformContext.request.unsubscribeChanges(requestId);
      }
    };
  }, []);

  useEffect(() => {
    const _fetchRequest = async () => {
      const requestId = tab.entity?.__ref?.id;
      const isRequestSaved = !!requestId;
      // prepare a minimal request payload
      let _request: IRest = normalizeRequest({});

      if (isRequestSaved === true) {
        toggleFetchingReqFlag(true);
        try {
          const request = await platformContext.request.fetch(requestId);
          _request = { ...request };
        } catch (error) {
          console.error(error, 'fetch rest request');
          throw error;
        }
      }
      /** initialise rest store on tab load */
      initialise(_request, tab.id);
      toggleFetchingReqFlag(false);
    };

    const _fetchRequestParentArtifacts = async () => {
      const requestId = tab.entity?.__ref?.id;
      const isRequestSaved = !!requestId;
      if (isRequestSaved === true) {
        platformContext.request
          .fetchParentArtifacts(requestId)
          .then((res) => {
            setParentArtifacts(res);
            // console.log(res, 'artifacts');
          })
          .catch((e) => {
            console.error(e, 'fetch rest request parent artifacts');
          });
      }
    };
    _fetchRequest().then(() => {
      _fetchRequestParentArtifacts();
    });
  }, []);

  /**
   * Handle pull payload
   * 1. initialise/ merge request
   * 2. Generate pull action
   */
  const handlePull = async () => {};

  if (isFetchingRequest === true) return <Loader />;
  return (
    <RootContainer className="h-full w-full">
      <RootProgressBar />
      <Container className="h-full with-divider">
        <UrlBarContainer />
        <Container.Body>
          <Row flex={1} className="with-divider h-full" overflow="auto">
            <Request />
            <Response />
          </Row>
          {/* <CodeSnippets  getPlatformEnvironments={() => {}} /> */}
        </Container.Body>
      </Container>
    </RootContainer>
  );
};

const withStore = (WrappedComponent) => {
  const MyComponent = ({ tab, ...props }) => {
    const {
      id: tabId,
      entity,
      // __meta: { entityId }
    } = tab;
    const request = {
      url: entity.url,
      method: entity.method,
      __meta: entity.__meta,
      __ref: entity.__ref,
    };
    const initState = initialiseStoreFromRequest(request, { tabId });
    // console.log(initState);
    return (
      <StoreProvider createStore={() => createStore(initState)}>
        <WrappedComponent tab={tab} {...props} />
      </StoreProvider>
    );
  };

  return MyComponent;
};
export default withStore(memo(Rest));

const RootProgressBar = () => {
  const { isUpdatingRequest } = useStore(
    (s: IStore) => ({
      isUpdatingRequest: s.ui.isUpdatingRequest,
    }),
    shallow
  );
  return <ProgressBar active={isUpdatingRequest} />;
};
