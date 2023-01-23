import { useEffect } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import shallow from 'zustand/shallow';
import { _array, _object } from '@firecamp/utils';
import {
  Container,
  Column,
  Row,
  RootContainer,
  Loader,
} from '@firecamp/ui-kit';

import { initialiseStoreFromRequest } from '../services/request.service';
import UrlBarContainer from './common/urlbar/UrlBarContainer';
import ConnectionPanel from './connection-panel/ConnectionPanel';
import SidebarPanel from './sidebar-panel/SidebarPanel';
import '../sass/ws.sass';

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
    setIsFetchingReqFlag,
    initialise,
    initialiseCollection,
    setContext,
  } = useStore(
    (s: IStore) => ({
      isFetchingRequest: s.ui.isFetchingRequest,
      connect: s.connect,
      setRequestSavedFlag: s.setRequestSavedFlag,
      setIsFetchingReqFlag: s.setIsFetchingReqFlag,
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
    // subscribe request updates
    if (tab.__meta.isSaved && tab.request?.__ref?.id) {
      platformContext.request.subscribeChanges(
        tab.request.__ref.id,
        handlePull
      );
    }

    // unsubscribe request updates
    return () => {
      if (tab.__meta.isSaved && tab.request?.__ref?.id) {
        platformContext.request.unsubscribeChanges(tab.request.__ref.id);
      }
    };
  }, []);

  /** fetch request */
  useEffect(() => {
    const _fetchRequest = async () => {
      try {
        const isRequestSaved = !!tab?.request?.__ref?.id || false;
        // prepare a minimal request payload
        let _request = { collection: { folders: [], items: [] } }; // initialise will normalize the reuqest to prepare minimal request for tab

        if (isRequestSaved === true) {
          setIsFetchingReqFlag(true);
          try {
            const request = await platformContext.request.fetch(
              tab.request.__ref.id
            );
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
        setIsFetchingReqFlag(false);
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
      <Container className="h-full with-divider">
        <UrlBarContainer
          tab={tab}
          // onPasteCurl={onPasteCurl}
        />
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

export default withStore(WebSocket);
