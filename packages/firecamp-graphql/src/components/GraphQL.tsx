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
  GraphQLStoreProvider,
  createGraphQLStore,
  useGraphQLStoreApi,
  useGraphQLStore,
  IPushPayload,
  emptyPushAction,
  IGraphQLStore,
} from '../store';

import {
  initialiseStoreFromRequest,
  normalizeRequest,
  prepareUiState,
} from '../services/request.service';
import { ESidebarTabs } from '../types';

const GraphQL = ({ tab, platformContext, activeTab, platformComponents }) => {
  let graphqlStoreApi: any = useGraphQLStoreApi();

  let {
    isFetchingRequest,
    initialise,
    setActiveEnvironments,
    setRequestSavedFlag,
    setIsFetchingReqFlag,
    getMergedRequestByPullAction,
    prepareRequestUpdatePushAction,
    setLast,
    setContext,
  } = useGraphQLStore(
    (s: IGraphQLStore) => ({
      isFetchingRequest: s.ui.isFetchingRequest,

      initialise: s.initialise,
      setIsFetchingReqFlag: s.setIsFetchingReqFlag,
      setActiveEnvironments: s.setActiveEnvironments,
      setRequestSavedFlag: s.setRequestSavedFlag,
      getMergedRequestByPullAction: s.getMergedRequestByPullAction,
      prepareRequestUpdatePushAction: s.prepareRequestUpdatePushAction,
      setLast: s.setLast,
      setContext: s.setContext,
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
      // existing active environments in to runtime
      const activeEnvironments =
        graphqlStoreApi.getState().runtime.activeEnvironments;

      // set active environments to platform
      if (!!activeEnvironments?.workspace) {
        // console.log({ activeEnvironments });

        platformContext.environment.setActiveEnvironments({
          activeEnvironments,
          collectionId: tab?.request?.__meta.collectionId || '',
        });
      }

      // subscribe environment updates
      platformContext.environment.subscribeChanges(
        tab.id,
        handlePlatformEnvironmentChanges
      );
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
  const handlePull = async (pullActions: IPushPayload[]) => {
    try {
      let pullPayload = pullActions[0];

      // console.log({ pullPayload });

      let last = graphqlStoreApi.getState().last;
      let mergedPullAndLastRequest = _object.mergeDeep(
        _cloneDeep(last.request),
        _object.omit(pullPayload, ['_action'])
      );

      // merged request payload: merged existing request and pull payload request
      let updatedRequest = (await getMergedRequestByPullAction(
        pullPayload
      )) as IGraphQL;

      // console.log({ 111: updatedRequest });

      updatedRequest = normalizeRequest(updatedRequest);

      // console.log({ updatedRequest, mergedPullAndLastRequest });

      // set last value by pull action and request
      setLast({
        ...last,
        request: mergedPullAndLastRequest,
        pushAction: pullPayload._action.keys || {},
      });

      // get push action payload
      let pushAction = await prepareRequestUpdatePushAction(updatedRequest);
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
      let _request: IGraphQL = normalizeRequest({});

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

      /** initialise graphql store on tab load */
      initialise(_request);
      setIsFetchingReqFlag(false);
    } catch (error) {
      console.error({
        API: 'fetch and normalize rest request',
        error,
      });
    }
  };

  // handle updates for environments from platform
  const handlePlatformEnvironmentChanges = (platformActiveEnvironments) => {
    // console.log({ platformActiveEnvironments });

    if (!platformActiveEnvironments) return;
    let activeEnvironments =
      graphqlStoreApi.getState().runtime.activeEnvironments;

    if (
      platformActiveEnvironments.workspace &&
      !equal(platformActiveEnvironments, activeEnvironments)
    ) {
      setActiveEnvironments(platformActiveEnvironments);
    }
  };

  const onSave = (pushPayload: IPushPayload, tabId) => {
    // console.log({ pushPayload });

    if (!pushPayload._action || !pushPayload._action.item_id) return;
    if (pushPayload._action.type === 'i') {
      platformContext.request.subscribeChanges(
        pushPayload._action.item_id,
        handlePull
      );
    }

    platformContext.request.onSave(pushPayload, tabId);

    let last = graphqlStoreApi.getState().last,
      request = graphqlStoreApi.getState().request;

    // set last value by pull action and request
    setLast({
      ...last,
      request,
      pushAction: emptyPushAction,
    });
  };

  if (isFetchingRequest === true) return <Loader />;
  return (
    <Container className="h-full w-full with-divider" overflow="visible">
      <UrlBarContainer
        tab={tab}
        collectionId={tab?.request?.__ref?.collectionId || ''}
        postComponents={platformComponents}
        onSaveRequest={onSave}
      />
      <Container.Body>
        <Row flex={1} overflow="auto" className="with-divider h-full">
          <SidebarPanel />
          <Column>
            <PlaygroundPanel />
          </Column>
          <DocWrapper />
        </Row>
      </Container.Body>
      {tab.__meta.isSaved && (
        <TabChangesDetector
          onChangeRequestTab={platformContext.request.onChangeRequestTab}
          tabId={tab.id}
          tabMeta={tab.__meta}
        />
      )}
    </Container>
  );
};

const withStore = (WrappedComponent) => {
  const MyComponent = ({ tab, ...props }) => {
    const { request = {} } = tab;
    const initState = initialiseStoreFromRequest(request);

    return (
      <GraphQLStoreProvider createStore={() => createGraphQLStore(initState)}>
        <WrappedComponent tab={tab} {...props} />
      </GraphQLStoreProvider>
    );
  };

  return MyComponent;
};

const TabChangesDetector = ({ tabId, tabMeta, onChangeRequestTab }) => {
  let { pushAction } = useGraphQLStore(
    (s: any) => ({
      pushAction: s.pushAction,
    }),
    shallow
  );

  useEffect(() => {
    if (tabMeta.isSaved) {
      // console.log({ pushAction });

      // Check if push action empty or not
      let isTabDirty = !_object.isEmpty(
        _cleanDeep(_cloneDeep(pushAction || {})) || {}
      );
      // console.log({ pushAction });

      // Update tab __meta if existing tab.__meta.hasChange is not same as isTabDirty
      if (tabMeta.hasChange !== isTabDirty) {
        onChangeRequestTab(tabId, { hasChange: isTabDirty });
      }
    }
  }, [pushAction]);

  return <></>;
};

export default withStore(GraphQL);
