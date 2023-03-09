import { useEffect } from 'react';
import {
  Container,
  Row,
  RootContainer,
  Column,
  Loader,
} from '@firecamp/ui';
import _cloneDeep from 'lodash/cloneDeep';
import _url from '@firecamp/url';
import { _array, _object } from '@firecamp/utils';
import UrlBarContainer from './common/urlbar/UrlBarContainer';
import ConnectionPanel from './connection-panel/ConnectionPanel';
import SidebarPanel from './sidebar-panel/SidebarPanel';
import { initialiseStoreFromRequest } from '../services/request.service';
import { StoreProvider, createStore, useStore, IStore } from '../store';
import '../sass/socket.sass';

const Socket = ({ tab, platformContext }) => {
  const {
    isFetchingRequest,
    initialise,
    initialiseCollection,
    setRequestSavedFlag,
    setIsFetchingReqFlag,
    setContext,
  } = useStore((s: IStore) => ({
    isFetchingRequest: s.ui.isFetchingRequest,
    initialise: s.initialise,
    initialiseCollection: s.initialiseCollection,
    setRequestSavedFlag: s.setRequestSavedFlag,
    setIsFetchingReqFlag: s.setIsFetchingReqFlag,
    setContext: s.setContext,
  }));

  //set context to store
  useEffect(() => {
    setContext(platformContext);
  }, []);

  useEffect(() => {
    setRequestSavedFlag(tab?.__meta.isSaved);
  }, [tab?.__meta.isSaved]);

  /** subscribe/ unsubscribe request changes (pull-actions) */
  useEffect(() => {
    const requestId = tab.entity?.__ref?.id;
    // subscribe request updates
    if (tab.__meta.isSaved && requestId) {
      platformContext.request.subscribeChanges(requestId, handlePull);
    }
    // unsubscribe request updates
    return () => {
      if (tab.__meta.isSaved && requestId) {
        platformContext.request.unsubscribeChanges(requestId);
      }
    };
  }, []);

  //fetch request
  useEffect(() => {
    const _fetchRequest = async () => {
      try {
        const requestId = tab.entity?.__ref?.id;
        const isRequestSaved = !!requestId;
        // prepare a minimal request payload
        let _request = { collection: { folders: [], items: [] } }; // initialise will normalize the reuqest to prepare minimal request for tab

        if (isRequestSaved === true) {
          setIsFetchingReqFlag(true);
          try {
            const request = await platformContext.request.fetch(requestId);
            _request = { ...request };
          } catch (error) {
            console.error(error);
            throw error;
          }
        }
        const { collection, ...request } = _request;
        /** initialise socket.io store on tab load */
        initialise(request, tab.id);
        if (collection && !_object.isEmpty(collection))
          initialiseCollection(collection);
        setIsFetchingReqFlag(false);
      } catch (e) {
        console.error(e);

        // TODO: close tab and show error popup
      }
    };
    _fetchRequest();
  }, []);

  const handlePull = () => {};

  if (isFetchingRequest === true) return <Loader />;
  return (
    <RootContainer className="h-full w-full">
      <Container className="h-full with-divider">
        <UrlBarContainer tab={tab} />
        <Container.Body>
          <Row flex={1} overflow="auto" className="with-divider h-full">
            <SidebarPanel />
            <Column className="h-full">
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
export default withStore(Socket);
