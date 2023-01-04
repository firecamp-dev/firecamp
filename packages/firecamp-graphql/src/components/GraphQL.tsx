import { useEffect } from 'react';
import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import equal from 'deep-equal';
import shallow from 'zustand/shallow';

import { _object } from '@firecamp/utils';
import { IGraphQL } from '@firecamp/types';
import { Container, Row, Column, Loader } from '@firecamp/ui-kit';

import SidebarPanel from './sidebar-panel/SidebarPanel';
import UrlBarContainer from './common/urlbar/UrlBarContainer';
import PlaygroundPanel from './playground-panel/PlaygroundPanel';

import DocWrapper from './common/explorer/GraphQLDoc';

import {
  StoreProvider,
  createStore,
  useStoreApi,
  useStore,
  IStore,
} from '../store';

import {
  initialiseStoreFromRequest,
  normalizeRequest,
} from '../services/request.service';

const GraphQL = ({ tab, platformContext, activeTab }) => {
  let graphqlStoreApi: any = useStoreApi();

  let {
    isFetchingRequest,
    initialise,
    setRequestSavedFlag,
    setIsFetchingReqFlag,
    getMergedRequestByPullAction,
    setContext,
    initialiseCollection,
  } = useStore(
    (s: IStore) => ({
      isFetchingRequest: s.ui.isFetchingRequest,
      initialise: s.initialise,
      setIsFetchingReqFlag: s.setIsFetchingReqFlag,
      setRequestSavedFlag: s.setRequestSavedFlag,
      getMergedRequestByPullAction: s.getMergedRequestByPullAction,
      setContext: s.setContext,
      initialiseCollection: s.initialiseCollection,
    }),
    shallow
  );

  //set context to store
  useEffect(() => {
    setContext(platformContext);
  }, []);

  /**
   * Handle environments activities on load and while being active tab
   *
   * 1. on Tab focus pass previously set environment names to the platform
   * 2. subscribe the environment related changes
   * */
  useEffect(() => {
    if (activeTab === tab.id) {
      platformContext.environment.setActiveEnvironments(
        tab?.request?.__meta.collectionId || ''
      );

      // subscribe environment updates
      // platformContext.environment.subscribeChanges(tab.id, console.log);
    }
  }, [activeTab]);

  /** if request is being saved then after successful flag set the request's as saved */
  useEffect(() => {
    setRequestSavedFlag(tab?.__meta?.isSaved);
  }, [tab?.__meta?.isSaved]);

  /**
   * Fetch request and Handle realtime changes of the Request
   *
   * fetch request and initialise stores and tab
   * subscribe & unsubscribe request changes (pull-actions) on first mount and unmount
   */
  useEffect(() => {
    fetchRequest();

    // subscribe request updates
    if (tab.__meta.isSaved && tab?.request?.__ref?.id) {
      platformContext.request.subscribeChanges(
        tab.request.__ref.id,
        handlePull
      );
    }

    // unsubscribe request updates
    return () => {
      if (tab.__meta.isSaved && tab?.request?.__ref?.id) {
        platformContext.request.unsubscribeChanges(tab.request.__ref.id);
      }
    };
  }, []);

  /**
   * Handle pull payload
   * 1. initialise/ merge request
   * 2. Generate pull action
   */
  const handlePull = async (pullActions: any[]) => {
    try {
      let pullPayload = pullActions[0];

      // console.log({ pullPayload });

      // let last = graphqlStoreApi.getState().last;
      // let mergedPullAndLastRequest = _object.mergeDeep(
      //   _cloneDeep(last.request),
      //   _object.omit(pullPayload, ['_action'])
      // );

      // merged request payload: merged existing request and pull payload request
      let updatedRequest = (await getMergedRequestByPullAction(
        pullPayload
      )) as IGraphQL;

      // console.log({ 111: updatedRequest });

      updatedRequest = normalizeRequest(updatedRequest);

      // console.log({ updatedRequest, mergedPullAndLastRequest });

      // set last value by pull action and request
      // get push action payload
      // let pushAction = await prepareRequestUpdatePushAction(updatedRequest);
      // console.log({ 'pushAction on pull': pushAction });

      // initialise request with updated request and push action
      // initialiseRequest(updatedRequest, true, pushAction, true, false);
    } catch (error) {
      console.error({
        API: 'rest.handlePull',
        error,
      });
    }
  };

  const fetchRequest = async () => {
    try {
      const isRequestSaved = !!tab?.request?.__ref?.id || false;
      // prepare a minimal request payload
      let _request = { collection: { folders: [], items: [] } }; // initialise will normalize the reuqest to prepare minimal request for tab
      if (isRequestSaved === true) {
        setIsFetchingReqFlag(true);
        try {
          const response = await platformContext.request.onFetch(
            tab.request.__ref.id
          );

          console.log(response.data, 'fetch request...');
          _request = response.data;
        } catch (error) {
          console.error({
            API: 'fetch rest request',
            error,
          });
          throw error;
        }
      }
      const { collection, ...request } = _request;
      /** initialise graphql store on tab load */
      initialise(request, tab.id);
      if (collection && !_object.isEmpty(collection))
        initialiseCollection(collection);
      setIsFetchingReqFlag(false);
    } catch (error) {
      console.error({
        API: 'fetch and normalize rest request',
        error,
      });
    }
  };

  if (isFetchingRequest === true) return <Loader />;
  return (
    <Container className="h-full w-full with-divider" overflow="visible">
      <UrlBarContainer tab={tab} />
      <Container.Body>
        <Row flex={1} overflow="auto" className="with-divider h-full">
          <SidebarPanel />
          <Column>
            <PlaygroundPanel />
          </Column>
          <DocWrapper />
        </Row>
      </Container.Body>
    </Container>
  );
};

const withStore = (WrappedComponent) => {
  const MyComponent = ({ tab, ...props }) => {
    const { request = {}, id } = tab;
    const initState = initialiseStoreFromRequest(request, id);
    // console.log(tab, 'tab.....', initState)
    return (
      <StoreProvider createStore={() => createStore(initState)}>
        <WrappedComponent tab={tab} {...props} />
      </StoreProvider>
    );
  };
  return MyComponent;
};
export default withStore(GraphQL);
