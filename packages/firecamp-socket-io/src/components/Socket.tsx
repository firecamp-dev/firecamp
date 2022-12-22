import { useEffect } from 'react';
import { Container, Row, RootContainer, Column } from '@firecamp/ui-kit';
import equal from 'deep-equal';
import _cloneDeep from 'lodash/cloneDeep';
import _url from '@firecamp/url';
import { _array, _object } from '@firecamp/utils';

import UrlBarContainer from './common/urlbar/UrlBarContainer';
import ConnectionPanel from './connection-panel/ConnectionPanel';
import SidebarPanel from './sidebar-panel/SidebarPanel';
import {
  SocketStoreProvider,
  createSocketStore,
  useSocketStoreApi,
  useSocketStore,
} from '../store';
import { ISocketStore } from '../store/store.type';
import { initialiseStoreFromRequest } from '../services/request.service';
import '../sass/socket.sass';

const Socket = ({ tab, platformContext, activeTab, platformComponents }) => {
  const socketStoreApi = useSocketStoreApi();
  const {
    initialise,
    initialiseCollection,
    setActiveEnvironments,
    setRequestSavedFlag,
    setIsFetchingReqFlag,
    setContext,
  } = useSocketStore((s: ISocketStore) => ({
    initialise: s.initialise,
    initialiseCollection: s.initialiseCollection,
    setActiveEnvironments: s.setActiveEnvironments,
    setRequestSavedFlag: s.setRequestSavedFlag,
    setIsFetchingReqFlag: s.setIsFetchingReqFlag,
    setContext: s.setContext,
  }));

  //set context to store
  useEffect(() => {
    setContext(platformContext);
  }, []);

  /** setup environments on tab load */
  useEffect(() => {
    if (activeTab === tab.id) {
      const state = socketStoreApi.getState() as ISocketStore;
      // existing active environments in to runtime
      const {
        activeEnvironments: { workspace = '', collection = '' },
      } = state.runtime;

      // set active environments to platform
      if (!!workspace) {
        platformContext.environment.setActiveEnvironments({
          activeEnvironments: {
            workspace,
            collection,
          },
          collectionId: tab?.request?.__ref.collectionId || '',
        });
      }

      // subscribe environment updates
      platformContext.environment.subscribeChanges(
        tab.id,
        handlePlatformEnvironmentChanges
      );
    }
  }, [activeTab]);

  useEffect(() => {
    setRequestSavedFlag(tab?.__meta.isSaved);
  }, [tab?.__meta.isSaved]);

  /** subscribe/ unsubscribe request changes (pull-actions) */
  useEffect(() => {
    // subscribe request updates
    if (tab.__meta.isSaved && tab?.request?.__ref?.id) {
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

  //fetch request
  useEffect(() => {
    const _fetchRequest = async () => {
      try {
        const isRequestSaved = !!tab?.request?.__ref.id || false;
        // prepare a minimal request payload
        let _request = { collection: { folders: [], items: [] } }; // initialise will normalize the reuqest to prepare minimal request for tab

        if (isRequestSaved === true) {
          setIsFetchingReqFlag(true);
          try {
            const response = await platformContext.request.onFetch(
              tab.request.__ref.id
            );
            _request = response.data;
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

  const onSave = () => {
   
    // if (pushPayload._action.type === 'i') {
    //   platformContext.request.subscribeChanges(
    //     pushPayload._action.item_id,
    //     handlePull
    //   );
    // }
    // platformContext.request.save(pushPayload, tabId);
  };
  // handle updates for environments from platform
  const handlePlatformEnvironmentChanges = (platformActiveEnvironments) => {
    // console.log({ platformActiveEnvironments });
    if (!platformActiveEnvironments) return;
    const state = socketStoreApi.getState() as ISocketStore;
    // existing active environments in to runtime
    const { activeEnvironments } = state.runtime;

    if (
      platformActiveEnvironments.workspace &&
      !equal(platformActiveEnvironments, activeEnvironments)
    ) {
      setActiveEnvironments(platformActiveEnvironments);
    }
  };

  return (
    <RootContainer className="h-full w-full">
      <Container className="h-full with-divider">
        <UrlBarContainer
          tab={tab}
          collectionId={tab?.request?.__ref.collectionId || ''}
          postComponents={platformComponents}
          onSaveRequest={onSave}
          platformContext={platformContext}
        />
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
      <SocketStoreProvider createStore={() => createSocketStore(initState)}>
        <WrappedComponent tab={tab} {...props} />
      </SocketStoreProvider>
    );
  };
  return MyComponent;
};
export default withStore(Socket);
