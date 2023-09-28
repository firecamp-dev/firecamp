import { useEffect } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import { shallow } from 'zustand/shallow';
import { _array, _object } from '@firecamp/utils';
import {
  Container,
  Column,
  Row,
  RootContainer,
  Loader,
  ProgressBar,
} from '@firecamp/ui';
import { initialiseStoreFromRequest } from '../services/request.service';
import UrlBarContainer from './common/urlbar/UrlBarContainer';
import ConnectionPanel from './connection-panel/ConnectionPanel';
import SidebarPanel from './sidebar-panel/SidebarPanel';

// store
import {
  createStore,
  useStore,
  StoreProvider,
  IStore,
  IWebSocket,
} from '../store';

const WebSocket = ({ tab, platformContext }) => {
  const {
    isFetchingRequest,
    setRequestSavedFlag,
    toggleFetchingReqFlag,
    initialise,
    initialiseCollection,
    setContext,
  } = useStore(
    (s: IStore) => ({
      isFetchingRequest: s.ui.isFetchingRequest,
      connect: s.connect,
      setRequestSavedFlag: s.setRequestSavedFlag,
      toggleFetchingReqFlag: s.toggleFetchingReqFlag,
      initialise: s.initialise,
      initialiseCollection: s.initialiseCollection,
      setContext: s.setContext,
    }),
    shallow
  );

  //set context to store
  useEffect(() => {
    setContext(platformContext);
  }, []);

  useEffect(() => {
    setRequestSavedFlag(tab?.__meta?.isSaved);
  }, [tab?.__meta?.isSaved]);

  /** subscribe/ unsubscribe request changes (pull-actions) */
  useEffect(() => {
    const requestId = tab.entity?.__ref?.id;
    let unsubscribe: Function = () => {};
    // subscribe request updates
    if (tab.__meta.isSaved && requestId) {
      unsubscribe = platformContext.request.subscribeChanges(
        requestId,
        handlePull
      );
    }
    // unsubscribe request updates
    return () => {
      unsubscribe();
    };
  }, []);

  /** fetch request */
  useEffect(() => {
    const _fetchRequest = async () => {
      try {
        const requestId = tab.entity?.__ref?.id;
        const isRequestSaved = !!requestId;
        // prepare a minimal request payload
        let _request = { collection: { folders: [], items: [] } }; // initialise will normalize the request to prepare minimal request for tab

        if (isRequestSaved === true) {
          toggleFetchingReqFlag(true);
          try {
            const request = await platformContext.request.fetch(requestId);
            _request = { ...request };
          } catch (error) {
            console.error({
              api: 'fetch rest request',
              error,
            });
            throw error;
          }
        }
        const { collection, ...request } = _request as IWebSocket & {
          collection: any;
        };
        /** initialise ws store on tab load */
        initialise(request, tab.id);
        if (collection && !_object.isEmpty(collection))
          setTimeout(() => initialiseCollection(collection));
        toggleFetchingReqFlag(false);
      } catch (e) {
        console.error(e);
      }
    };
    _fetchRequest();
  }, []);

  const handlePull = () => {};

  if (isFetchingRequest === true) return <Loader />;
  // console.log(tab, 'tab...');
  return (
    <RootContainer className="h-full w-full">
      <RootProgressBar />
      <Container className="h-full with-divider">
        <UrlBarContainer />
        <Container.Body>
          <Row flex={1} overflow="auto" className="with-divider h-full">
            <SidebarPanel />
            <Column>
              <ConnectionPanel />
            </Column>
          </Row>
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
      __meta: entity.__meta,
      __ref: entity.__ref,
    };
    const initState = initialiseStoreFromRequest(request, { tabId });
    return (
      <StoreProvider createStore={() => createStore(initState)}>
        <WrappedComponent tab={tab} {...props} />
      </StoreProvider>
    );
  };

  return MyComponent;
};
export default withStore(WebSocket);

const RootProgressBar = () => {
  const { isUpdatingRequest } = useStore(
    (s: IStore) => ({
      isUpdatingRequest: s.ui.isUpdatingRequest,
    }),
    shallow
  );
  return <ProgressBar active={isUpdatingRequest} />;
};
