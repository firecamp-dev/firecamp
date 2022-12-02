import { memo, useEffect } from 'react';
import _url from '@firecamp/url';
import { Container, Row, Loader } from '@firecamp/ui-kit';
import equal from 'deep-equal';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import { CurlToFirecamp } from '@firecamp/curl-to-firecamp';
import {
  EAuthTypes,
  EPushActionType,
  IRest,
} from '@firecamp/types';
import shallow from 'zustand/shallow';
import UrlBarContainer from './common/urlbar/UrlBarContainer';
import Request from './request/Request';
import Response from './response/Response';
import CodeSnippets from './common/code-snippets/CodeSnippets';
import { RestContext } from './Rest.context';

import {
  useRestStore,
  RestStoreProvider,
  createRestStore,
  useRestStoreApi,
  IPushPayload,
  IRestStore,
} from '../store';

import { _misc, _object, _table, _auth } from '@firecamp/utils';
import {
  getAuthHeaders,
  initialiseStoreFromRequest,
  normalizeRequest,
} from '../services/rest-service';

const Rest = ({ tab, platformContext, activeTab, platformComponents }) => {
  const restStoreApi: any = useRestStoreApi();

  const {
    isFetchingRequest,
    initialise,
    changeAuthHeaders,
    changeUrl,
    setActiveEnvironments,
    changeAuth,
    changeMeta,
    setRequestSavedFlag,
    setIsFetchingReqFlag,
    setOAuth2LastFetchedToken,
    getMergedRequestByPullAction,
    prepareRequestUpdatePushAction,
    setLast,
    setContext,
  } = useRestStore(
    (s: IRestStore) => ({
      isFetchingRequest: s.ui.isFetchingRequest,
      initialise: s.initialise,
      changeAuthHeaders: s.changeAuthHeaders,
      changeMeta: s.changeMeta,
      changeUrl: s.changeUrl,
      setIsFetchingReqFlag: s.setIsFetchingReqFlag,
      setActiveEnvironments: s.setActiveEnvironments,
      changeAuth: s.changeAuth,
      setRequestSavedFlag: s.setRequestSavedFlag,
      setOAuth2LastFetchedToken: s.setOAuth2LastFetchedToken,
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
   * Environments on tab load
   */
  useEffect(() => {
    if (activeTab === tab.id) {
      // existing active environments in to runtime
      let activeEnvironments =
        restStoreApi?.getState()?.runtime?.activeEnvironments;

      // set active environments to platform
      if (activeEnvironments && !!activeEnvironments.workspace) {
        console.log({ activeEnvironments });

        platformContext.environment.setActiveEnvironments({
          activeEnvironments: {
            workspace: activeEnvironments.workspace,
            collection: activeEnvironments.collection || '',
          },
          collectionId: tab?.request?.__ref?.collectionId || '',
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
    setRequestSavedFlag(tab?.meta?.isSaved);
  }, [tab?.meta?.isSaved]);

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
        let requestToNormalize: IRest = normalizeRequest({});

        if (isRequestSaved === true) {
          setIsFetchingReqFlag(true);
          try {
            const response = await platformContext.request.onFetch(
              tab.request.__ref.id
            );
            requestToNormalize = response.data;
          } catch (error) {
            console.error({
              API: 'fetch rest request',
              error,
            });
            throw error;
          }
        }

        /** initialise rest store on tab load */
        initialise(requestToNormalize);
        setIsFetchingReqFlag(false);
        // Update auth type, generate auth headers
        updateActiveAuth(requestToNormalize.__meta.activeAuthType);
      } catch (error) {
        console.error({
          API: 'fetch and normalize rest request',
          error,
        });
      }
    };
    _fetchRequest();
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

      let last = restStoreApi.getState().last;
      let mergedPullAndLastRequest = _object.mergeDeep(
        _cloneDeep(last.request),
        _object.omit(pullPayload, ['_action'])
      );

      // merged request payload: merged existing request and pull payload request
      let updatedRequest = await getMergedRequestByPullAction(pullPayload);

      updatedRequest = normalizeRequest(updatedRequest);

      // set last value by pull action and request
      setLast({
        ...last,
        request: mergedPullAndLastRequest,
        pushAction: pullPayload._action.keys || {},
      });

      // console.log({ req: restStoreApi.getState().request });

      // console.log({
      //   'updatedRequest on pull': updatedRequest,
      //   mergedPullAndLastRequest,
      // });

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

  const resetAuthHeaders = async (authType: EAuthTypes) => {
    try {
      if (authType !== EAuthTypes.Inherit) {
        let authHeaders = await getAuthHeaders(
          restStoreApi.getState()?.request,
          authType
        );

        if (authType === EAuthTypes.OAuth2 && authHeaders['Authorization']) {
          authHeaders[
            'Authorization'
          ] = `Bearer ${authHeaders['Authorization']}`;
          setOAuth2LastFetchedToken(authHeaders['Authorization']);
        }

        // prepare auth headers array
        const headersAry = _table.objectToTable(authHeaders) || [];
        // console.log({ headersAry });

        changeAuthHeaders(headersAry);
      } else {
        changeAuthHeaders([]);
      }
    } catch (error) {
      console.log({ API: 'rest.getAuthHeaders', error });
    }
  };

  const updateActiveAuth = (authType: EAuthTypes) => {
    // console.log({authType});

    changeMeta({ activeAuthType: authType });
    resetAuthHeaders(authType);
  };

  const updateAuthValue = (
    authType: EAuthTypes,
    updates: { key: string; value: any }
  ) => {
    if (!authType) return;

    // update store
    changeAuth(authType, updates);

    resetAuthHeaders(authType);
  };

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
    if (tab?.meta?.isSaved) {
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

  // console.log({ isFetchingRequest })

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
  };

  // handle updates for environments from platform
  const handlePlatformEnvironmentChanges = (platformActiveEnvironments) => {
    // console.log({ platformActiveEnvironments });

    if (!platformActiveEnvironments) return;
    let activeEnvironments = restStoreApi.getState().runtime.activeEnvironments;

    if (
      platformActiveEnvironments.workspace &&
      !equal(platformActiveEnvironments, activeEnvironments)
    ) {
      setActiveEnvironments(platformActiveEnvironments);
    }
  };

  if (isFetchingRequest === true) return <Loader />;

  return (
    <RestContext.Provider
      value={{
        // auth
        ctx_resetAuthHeaders: resetAuthHeaders,
        ctx_updateAuthValue: updateAuthValue,
        ctx_updateActiveAuth: updateActiveAuth,
      }}
    >
      <Container className="h-full with-divider" overflow="visible">
        <UrlBarContainer
          tab={tab}
          collectionId={tab?.request?.__ref?.collectionId || ''}
          postComponents={platformComponents}
          onSaveRequest={onSave}
          platformContext={platformContext}
          onPasteCurl={onPasteCurl}
        />
        <Container.Body>
          <Row flex={1} className="with-divider h-full" overflow="auto">
            <Request
              tab={tab}
              getFirecampAgent={platformContext.getFirecampAgent}
            />
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
      {tab.__meta.isSaved && (
        <TabChangesDetector
          onChangeRequestTab={platformContext.request.onChangeRequestTab}
          tabId={tab.id}
          tabMeta={tab.__meta}
        />
      )}
    </RestContext.Provider>
  );
};

const withStore = (WrappedComponent) => {
  const MyComponent = ({ tab, ...props }) => {
    const { request = {} } = tab;
    const initState = initialiseStoreFromRequest(request);
    return (
      <RestStoreProvider createStore={() => createRestStore(initState)}>
        <WrappedComponent tab={tab} {...props} />
      </RestStoreProvider>
    );
  };

  return MyComponent;
};

const TabChangesDetector = ({ tabId, tabMeta, onChangeRequestTab }) => {
  let { pushAction } = useRestStore(
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

      // Update tab meta if existing tab.__meta.hasChange is not same as isTabDirty
      if (tabMeta.hasChange !== isTabDirty) {
        onChangeRequestTab(tabId, { hasChange: isTabDirty });
      }
    }
  }, [pushAction]);

  return <></>;
};

export default withStore(memo(Rest));
