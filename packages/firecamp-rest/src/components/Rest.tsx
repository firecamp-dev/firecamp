import { memo, useEffect } from 'react';

import { nanoid as id } from 'nanoid';
import _url from '@firecamp/url';
import { Container, Row, Loader } from '@firecamp/ui-kit';
import equal from 'deep-equal';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import { CurlToFirecamp } from '@firecamp/curl-to-firecamp';
import {
  EAuthTypes,
  ERestBodyTypes,
  EHttpMethod,
  EPushActionType,
  ERequestTypes,
  IRest,
} from '@firecamp/types';

import shallow from 'zustand/shallow';

import UrlBarContainer from './common/urlbar/UrlBarContainer';
import Request from './request/Request';
import Response from './response/Response';
import CodeSnippets from './common/code-snippets/CodeSnippets';

import { configState, bodyState } from '../constants';
import { ERequestPanelTabs, IRestClientRequest } from '../types';
import { RestContext } from './Rest.context';

import {
  useRestStore,
  RestStoreProvider,
  createRestStore,
  useRestStoreApi,
  IPushAction,
  IPushPayload,
  emptyPushAction,
  IRestStore,
} from '../store';

import { _misc, _object, _table, _auth } from '@firecamp/utils';
import {
  getAuthHeaders,
  normalizeRequest,
  prepareUIRequestPanelState,
} from '../services/rest-service';


const Rest = ({ tab, platformContext, activeTab, platformComponents }) => {
  let restStoreApi: any = useRestStoreApi();

  let {
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

  useEffect(() => {
    setRequestSavedFlag(tab?.meta?.isSaved);
  }, [tab?.meta?.isSaved]);

  /**
   * Subscribe/ unsubscribe request changes (pull-actions)
   */
  useEffect(() => {
    // subscribe request updates
    if (tab.meta.isSaved && tab?.request?._meta?.id) {
      platformContext.request.subscribeChanges(
        tab.request._meta.id,
        handlePull
      );
    }

    // unsubscribe request updates
    return () => {
      if (tab.meta.isSaved && tab?.request?._meta.id) {
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

      let last = restStoreApi.getState().last;
      let mergedPullAndLastRequest = _object.mergeDeep(
        _cloneDeep(last.request),
        _object.omit(pullPayload, ['_action'])
      );

      // merged request payload: merged existing request and pull payload request
      let updatedReqeust = await getMergedRequestByPullAction(pullPayload);

      updatedReqeust = await normalizeRequest(updatedReqeust, true);

      // set last value by pull action and request
      setLast({
        ...last,
        request: mergedPullAndLastRequest,
        pushAction: pullPayload._action.keys || {},
      });

      // console.log({ req: restStoreApi.getState().request });

      // console.log({
      //   'updatedReqeust on pull': updatedReqeust,
      //   mergedPullAndLastRequest,
      // });

      // get push action payload
      let pushAction = await prepareRequestUpdatePushAction(updatedReqeust);
      // console.log({ 'pushAction on pull': pushAction });

      // initialise request with updated request and push action
      initialiseRequest(updatedReqeust, true, pushAction, true, false);
    } catch (error) {
      console.error({
        API: 'rest.handlePull',
        error,
      });
    }
  };

  useEffect(() => {
    let _fetchRequest = async () => {
      try {
        let isRequestSaved = !!tab?.request?._meta?.id || false;
        let requestToNormalise: IRest = {
          meta: {
            name: '',
            version: '2.0.0',
            type: ERequestTypes.Rest,
            active_body_type: ERestBodyTypes.NoBody,
          },
          method: EHttpMethod.GET,
          _meta: { id: '', collection_id: '' },
        };

        if (isRequestSaved === true) {
          setIsFetchingReqFlag(true);
          try {
            let response = await platformContext.request.onFetch(
              tab.request._meta.id
            );
            // console.log({response});

            requestToNormalise = response.data;
          } catch (error) {
            console.error({
              API: 'fetch rest request',
              error,
            });
            throw error;
          }
        }

        initialiseRequest(
          requestToNormalise,
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
    _fetchRequest();
  }, []);

  /**
   * initialiseRequest: normalise request and initialise in store on tab load and manage pull
   */
  const initialiseRequest = async (
    requestToNormalise: IRest,
    isRequestSaved: boolean,
    pushAction?: IPushAction,
    hasPull?: boolean,
    isFresh?: boolean
  ) => {
    let request: IRestClientRequest = await normalizeRequest(
      requestToNormalise,
      isRequestSaved
    );

    let requestPanel = prepareUIRequestPanelState(_cloneDeep(request));
    // console.log({ request });
    let uiActiveTab = hasPull
      ? restStoreApi.getState().ui?.requestPanel?.activeTab ||
        ERequestPanelTabs.Body
      : ERequestPanelTabs.Body;

    initialise(
      {
        request,
        ui: {
          ...restStoreApi.getState().ui,
          requestPanel: {
            ...requestPanel,
            activeTab: uiActiveTab,
          },
        },
        pushAction: pushAction
          ? pushAction
          : restStoreApi.getState().pushAction,
      },
      isFresh
    );
    setIsFetchingReqFlag(false);
    // Update auth type, generate auth headers
    updateActiveAuth(request.meta.active_auth_type);
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

    changeMeta({ active_auth_type: authType });
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

      initialiseRequest(curlRequest, false, emptyPushAction, false, true);
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
    let activeEnvironments =
      restStoreApi.getState().runtime.activeEnvironments;

    if (
      platformActiveEnvironments.workspace &&
      !equal(platformActiveEnvironments, activeEnvironments)
    ) {
      setActiveEnvironments(platformActiveEnvironments);
    }
  };

  if(isFetchingRequest === true) return <Loader />;

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
        <Container.Header>
          <UrlBarContainer
            tab={tab}
            collectionId={tab?.request?._meta?.collection_id || ''}
            postComponents={platformComponents}
            onSaveRequest={onSave}
            platformContext={platformContext}
            onPasteCurl={onPasteCurl}
          />
        </Container.Header>
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
      {tab.meta.isSaved && (
        <TabChangesDetector
          onChangeRequestTab={platformContext.request.onChangeRequestTab}
          tabId={tab.id}
          tabMeta={tab.meta}
        />
      )}
    </RestContext.Provider>
  );
};

const withStore = (WrappedComponent) => {
  const MyComponent = ({ tab, ...props }) => {
    let { request = {} } = tab;
    // console.log({ request });

    let initReqPayload: any = {
      request: {
        url: request.url || {
          raw: '' /*  'https://jsonplaceholder.typicode.com/todos/1' */,
        },
        method: request?.method || EHttpMethod.GET,
        headers: request?.headers || [],
        config: request.config || configState,
        scripts: {
          pre: '',
          post: '',
          test: '',
        },
        meta: request.meta || {
          active_body_type: ERestBodyTypes.NoBody,
          active_auth_type: EAuthTypes.Inherit,
          inherit_scripts: {
            pre: true,
            post: true,
            test: true,
          },
        },
        body: bodyState,
        auth: request.auth || _cloneDeep(_auth.defaultAuthState),
        _meta: {
          id: id(),
        },
      },
      ui: {
        isFetchingRequest: false,
        isCodeSnippetOpen: false,
        requestPanel: {
          activeTab: ERequestPanelTabs.Body,
        },
      },
      runtime: {
        auth_headers: [],
        inherit: {
          auth: {
            active: '',
            payload: {},
            oauth2_last_fetched_token: '',
          },
          script: {
            pre: '',
            post: '',
            test: '',
          },
        },
        isRequestSaved: tab?.meta?.isSaved,
        oauth2_last_fetched_token: '',
      },
    };

    return (
      <RestStoreProvider createStore={() => createRestStore(initReqPayload)}>
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

      // Update tab meta if existing tab.meta.hasChange is not same as isTabDirty
      if (tabMeta.hasChange !== isTabDirty) {
        onChangeRequestTab(tabId, { hasChange: isTabDirty });
      }
    }
  }, [pushAction]);

  return <></>;
};

export default withStore(memo(Rest));
