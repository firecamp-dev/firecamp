import { useEffect } from 'react';
import { nanoid as id } from 'nanoid';
import equal from 'deep-equal';
import { _object } from '@firecamp/utils';
import {
  EHttpMethod,
  EPushActionType,
  ERequestTypes,
  IGraphQL,
} from '@firecamp/types';
import shallow from 'zustand/shallow';
import _cleanDeep from 'clean-deep';

import { Container, Row, Column,Loader } from '@firecamp/ui-kit';

import _cloneDeep from 'lodash/cloneDeep';
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
  IPushAction,
  IGraphQLStore,
  IGraphQLStoreState,
} from '../store';

import { normalizeRequest, prepareUiState } from '../services/graphql-service';
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
          collectionId: tab?.request?._meta?.collection_id || '',
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
    setRequestSavedFlag(tab?.meta?.isSaved);
  }, [tab?.meta?.isSaved]);

  /**
   * Fetch request and Handle realtime changes of the Request
   *
   * fetch request and initialise stores and tab
   * subscribe & unsubscribe request changes (pull-actions) on first mount and unmount
   */
  useEffect(() => {
    fetchRequest();

    // subscribe request updates
    if (tab.meta.isSaved && tab?.request?._meta?.id) {
      platformContext.request.subscribeChanges(
        tab.request._meta.id,
        handlePull
      );
    }

    // unsubscribe request updates
    return () => {
      if (tab.meta.isSaved && tab?.request?._meta?.id) {
        platformContext.request.unsubscribeChanges(tab.request._meta.id);
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

      updatedRequest = await normalizeRequest(updatedRequest, true);

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
      initialiseRequest(updatedRequest, true, pushAction, true, false);
    } catch (error) {
      console.error({
        API: 'rest.handlePull',
        error,
      });
    }
  };

  const fetchRequest = async () => {
    try {
      const isRequestSaved = !!tab?.request?._meta?.id || false;
      let _request: IGraphQL = {
        meta: {
          name: '',
          version: '2.0.0',
          type: ERequestTypes.GraphQL,
        },
        method: EHttpMethod.POST,
        _meta: { id: '', collection_id: '' },
      };

      if (isRequestSaved === true) {
        setIsFetchingReqFlag(true);
        try {
          const response = await platformContext.request.onFetch(
            tab.request._meta.id
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

      initialiseRequest(
        _request,
        isRequestSaved,
        _cloneDeep(emptyPushAction),
        false,
        true
      );
    } catch (error) {
      console.error({
        API: 'fetch and normalize rest request',
        error,
      });
      // TODO: close tab and show error popup
    }
  };

  /**
   * initialiseRequest: normalise request and initialise in store on tab load and manage pull
   */
  const initialiseRequest = async (
    requestToNormalise: IGraphQL,
    isRequestSaved: boolean,
    pushAction?: IPushAction,
    hasPull?: boolean,
    isFresh?: boolean
  ) => {
    //@ts-ignore
    const { collection = { folders: [], items: [] } } = requestToNormalise;

    const state = graphqlStoreApi.getState();
    const request: IGraphQL = await normalizeRequest(
      requestToNormalise,
      isRequestSaved
    );

    const ui = prepareUiState(_cloneDeep(request));
    initialise(
      {
        request,
        pushAction,
        playgrounds: {},
        ui: {
          ...state.ui,
          ...ui,
          sidebarActiveTab:
            state.ui?.sidebarActiveTab || ESidebarTabs.Collection,
        },
      },
      collection,
      isFresh
    );
    setIsFetchingReqFlag(false);
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
    if (pushPayload._action.type === EPushActionType.Insert) {
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

  if(isFetchingRequest === true) return <Loader />;
  return (
    <Container className="h-full w-full with-divider" overflow="visible">
      <UrlBarContainer
          tab={tab}
          collectionId={tab?.request?._meta?.collection_id || ''}
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
      {tab.meta.isSaved && (
        <TabChangesDetector
          onChangeRequestTab={platformContext.request.onChangeRequestTab}
          tabId={tab.id}
          tabMeta={tab.meta}
        />
      )}
    </Container>
  );
};

const withStore = (WrappedComponent) => {
  const MyComponent = ({ tab, ...props }) => {
    let { request = {} } = tab;
    // console.log({ request });

    let initReqPayload: IGraphQLStoreState = {
      request: {
        url: request?.url || {
          raw: '',
        },
        method: request?.method || 'POST',
        headers: request?.headers || [
          { key: 'content-type', value: 'application/json' },
        ],
        config: request?.config || {},
        meta: request?.meta || {
          type: ERequestTypes.GraphQL,
          version: '2.0.0',
          name: '',
        },
        _meta: request?._meta || {
          id: id(),
          collection_id: '',
        },
      },
      playgrounds: {},
      ui: {
        isFetchingRequest: false,
        sidebarActiveTab: ESidebarTabs.Collection,
      },
    };
    // console.log({ initReqPayload });

    return (
      <GraphQLStoreProvider
        createStore={() => createGraphQLStore(initReqPayload)}
      >
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

      // Update tab meta if existing tab.meta.hasChange is not same as isTabDirty
      if (tabMeta.hasChange !== isTabDirty) {
        onChangeRequestTab(tabId, { hasChange: isTabDirty });
      }
    }
  }, [pushAction]);

  return <></>;
};

export default withStore(GraphQL);
