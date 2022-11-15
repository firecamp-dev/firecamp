import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { Container, Row, RootContainer, Column } from '@firecamp/ui-kit';
import { nanoid as id } from 'nanoid';
import equal from 'deep-equal';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import { _object } from '@firecamp/utils';

import {
  EMessageBodyType,
  EPushActionType,
  ERequestTypes,
  IWebSocket,
  TId,
} from '@firecamp/types';
import shallow from 'zustand/shallow';

import {
  normalizeRequestPayload,
  prepareUIRequestPanelState,
} from '../services/websocket-service';
import UrlBarContainer from './common/urlbar/UrlBarContainer';
import '../sass/ws.sass';
import ConnectionPanel from './connection-panel/ConnectionPanel';

import Emitter from './common/Emitter';
// import MessageCollection from './collection/MessageCollection';
import { WebsocketContext } from './WebSocket.context';
import { REQUEST_CONNECTION, configState } from '../constants/StatePayloads';
import {
  EConnectionState,
  KEYS_ON_SAVE_REQUEST,
  MESSAGE_PAYLOAD_TYPES,
  ON_CHANGE_ACTIONS,
  STRINGS,
} from '../constants';

// store
import {
  createWebsocketStore,
  useWebsocketStore,
  useWebsocketStoreApi,
  WebsocketStoreProvider,
  IWebsocketStore,
  initialPlaygroundMessage,
  emptyLog,
  IPushPayload,
  emptyPushAction,
  IPushAction,
} from '../store/index';
import { _array } from '@firecamp/utils';
import { ERequestPanelTabs } from '../types';
import { defaultConnectionState } from '../constants/connection';

export const CLIENT_ACTIONS = {
  CLIENT_ACTIONS: 'CLIENT_ACTIONS',
  OPEN_CODE_SNIPPET: 'OPEN_CODE_SNIPPET',
  OPEN_COLLECTION: 'OPEN_COLLECTION',
};
export const CONSTS = {
  ON_CHANGE_ACTIONS,
  EConnectionState,
  KEYS_ON_SAVE_REQUEST,
};

const Websocket = ({
  firecampFunctions = {},
  constants: propConstants = {},
  additionalComponents: prop_additionalComponents = {},
  onUpdateEnvironment = () => {},

  tab,
  platformContext,
  activeTab,
  platformComponents,
}) => {
  let { current: emitterRef } = useRef(new Emitter()); //TODO: remove later
  let { current: WSInstances_Ref } = useRef(new Map());

  let _noop = () => {};

  /**
   * _requestFns: Request functions
   * @type {{updateMessage: ((p1?:*, p2:*)), updateURL: ((p1?:*)), updateConnection: ((p1?:*, p2?:*, p3:*)),  }}
   * @private
   */
  let _requestFns = {
    updateRequest: _noop,
    updateMessage: _noop,
    setMessage: _noop,
    updateURL: _noop,
    updateConnection: _noop,
    removeConnection: _noop,
    onChangeConfig: _noop,
    updateMeta: _noop,
    updateDNP: _noop,
  };

  let _commonFns = {
    getMergedVariables: _noop,
    onChange: _noop,
    onSave: _noop,
    onUpdateRequest: _noop,
    setHistory: _noop,
    updateCacheMessageOnSave: _noop,
    setVisiblePanel: (panel) => _noop,
    setActiveEnvSnippets: _noop,
    _setCookie: _noop,
    _addCookies: _noop,
  };

  //---------------------------------init store value--------------------------------

  let websocketStoreApi: any = useWebsocketStoreApi();

  let {
    addMessage,
    changeMessage,
    setMessage,
    deleteMessage,
    addDirectory,
    changeDirectory,
    deleteDirectory,
    updateCollection,
    addConnection,
    addPlayground,

    setActivePlayground,
    setPlaygroundMessage,
    setSelectedCollectionMessage,
    addPlaygroundTab,
    changePlaygroundTab,
    addConnectionLog,
    clearAllConnectionLogs,
    changePlaygroundConnectionState,
    sendMessage,
    connect,
    setLast,
    prepareRequestUpdatePushAction,
    setRequestSavedFlag,
    getMergedRequestByPullAction,
    setIsFetchingReqFlag,
    initialise,
    setActiveEnvironments,
  } = useWebsocketStore(
    (s: IWebsocketStore) => ({
      addMessage: s.addMessage,
      changeMessage: s.changeMessage,
      setMessage: s.setMessage,
      deleteMessage: s.deleteMessage,
      addDirectory: s.addDirectory,
      changeDirectory: s.changeDirectory,
      deleteDirectory: s.deleteDirectory,
      updateCollection: s.updateCollection,

      addConnection: s.addConnection,
      addPlayground: s.addPlayground,

      setActivePlayground: s.setActivePlayground,
      setPlaygroundMessage: s.setPlaygroundMessage,
      setSelectedCollectionMessage: s.setSelectedCollectionMessage,
      addPlaygroundTab: s.addPlaygroundTab,
      changePlaygroundTab: s.changePlaygroundTab,
      addConnectionLog: s.addConnectionLog,
      clearAllConnectionLogs: s.clearAllConnectionLogs,
      changePlaygroundConnectionState: s.changePlaygroundConnectionState,
      sendMessage: s.sendMessage,
      connect: s.connect,
      setLast: s.setLast,
      prepareRequestUpdatePushAction: s.prepareRequestUpdatePushAction,
      setRequestSavedFlag: s.setRequestSavedFlag,
      getMergedRequestByPullAction: s.getMergedRequestByPullAction,
      setIsFetchingReqFlag: s.setIsFetchingReqFlag,
      initialise: s.initialise,
      setActiveEnvironments: s.setActiveEnvironments,
    }),
    shallow
  );

  /**
   * Environments on tab load
   */
  useEffect(() => {
    if (activeTab === tab.id) {
      // existing active environments in to runtime
      let activeEnvironments =
        websocketStoreApi?.getState()?.runtime?.active_environments;

      // set active environments to platform
      if (activeEnvironments && !!activeEnvironments.workspace) {
        // console.log({ activeEnvironments });

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
  let handlePull = async (pullActions: IPushPayload[]) => {
    try {
      let pullPayload = pullActions[0];

      // console.log({ pullPayload });

      let last = websocketStoreApi.getState().last;
      let mergedPullAndLastRequest = _object.mergeDeep(
        _cloneDeep(last.request),
        _object.omit(pullPayload, ['_action'])
      );

      // merged request payload: merged existing request and pull payload request
      let updatedReqeust = (await getMergedRequestByPullAction(
        pullPayload
      )) as IWebSocket;

      // console.log({ 111: updatedReqeust });

      updatedReqeust = await normalizeRequestPayload(updatedReqeust, true);

      // console.log({ updatedReqeust, mergedPullAndLastRequest });

      // set last value by pull action and request
      setLast({
        ...last,
        request: mergedPullAndLastRequest,
        pushAction: pullPayload._action.keys || {},
      });

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
        let requestToNormalise: IWebSocket = {
          url: { raw: '' },
          meta: {
            name: '',
            version: '2.0.0',
            type: ERequestTypes.WebSocket,
          },
          _meta: { id: id(), collection_id: '' },
        };

        if (isRequestSaved === true) {
          setIsFetchingReqFlag(true);
          try {
            let response = await platformContext.request.onFetch(
              tab.request._meta.id
            );
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
          _cloneDeep({ request: emptyPushAction }),
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
  let initialiseRequest = async (
    requestToNormalise: IWebSocket,
    isRequestSaved: boolean,
    pushAction?: IPushAction,
    hasPull?: boolean,
    isFresh?: boolean
  ) => {
    let request: IWebSocket = await normalizeRequestPayload(
      requestToNormalise,
      isRequestSaved
    );
    let uiActiveTab = hasPull
      ? websocketStoreApi.getState().ui?.requestPanel?.activeTab ||
        ERequestPanelTabs.Playgrounds
      : ERequestPanelTabs.Playgrounds;

    let requestPanel = prepareUIRequestPanelState(_cloneDeep(request));

    let defaultConnection =
      request.connections?.find((c) => c.is_default === true) ||
      defaultConnectionState;

      // console.log({request});
      
    // TODO: set hasQueries and queries in ui state
    initialise(
      {
        request: _cloneDeep(request),
        pushAction,
        playgrounds: {
          // Add logic for init playgrounds by connections
          [defaultConnection.id]: {
            id: defaultConnection.id,
            connectionState: EConnectionState.IDEAL,
            logFilters: {
              type: '',
            },
            message: initialPlaygroundMessage,
            selectedCollectionMessage: '',
          },
        },
        ui: {
          ...websocketStoreApi.getState().ui,
          requestPanel: {
            ...requestPanel,
            activeTab: uiActiveTab,
          },
        },
      },
      isFresh
    );
    setIsFetchingReqFlag(false);
  };

  // handle updates for environments from platform
  let handlePlatformEnvironmentChanges = (platformActiveEnvironments) => {
    // console.log({ platformActiveEnvironments });

    if (!platformActiveEnvironments) return;
    let activeEnvironments =
      websocketStoreApi.getState().runtime.active_environments;

    if (
      platformActiveEnvironments.workspace &&
      !equal(platformActiveEnvironments, activeEnvironments)
    ) {
      setActiveEnvironments(platformActiveEnvironments);
    }
  };

  let updateCollectionFns = {
    addMessage: async ({ name = '', parent_id = '' }) => {
      let msgId = id();

      let {
        runtime: { activePlayground },
        playgrounds,
      } = websocketStoreApi.getState();

      let message = playgrounds?.[activePlayground]?.message;

      if (
        message.meta.type === 'no_body' ||
        message.meta.type === MESSAGE_PAYLOAD_TYPES.file
      ) {
        return;
      }

      let messagePayload = {
        ...message,
        name,
        _meta: {
          ...message._meta,
          id: msgId,
          parent_id,
        },
      };

      addMessage(messagePayload);

      changePlaygroundTab(activePlayground, {
        meta: {
          is_saved: true,
          hasChange: false,
        },
      });

      console.log(11);

      /*  console.log({
        aaa: websocketStoreApi.getState().collection,
        messagePayload,
      }); */

      // TODO: Update parent orders on add message
      await updateCollectionFns.updateOrders({
        action: 'add',
        key: 'leaf_orders',
        parent_id,
        id: msgId,
      });

      // TODO: check update playground message
      await playgroundMessageFns.add(messagePayload);

      // TODO: check update active message
      setSelectedCollectionMessage(activePlayground, msgId);

      // TODO: update request
      // _commonFns.onUpdateRequest(tab);
    },

    updateMessage: async (id, { key, value }) => {
      if (!id || !key) return;

      if (key !== 'path') {
        changeMessage(id, { key, value });
      }
      playgroundMessageFns.update(id, { [key]: value });
    },

    deleteMessage: (id) => {
      if (!id) return;

      let messageDetails = websocketStoreApi.getState().getMessage(id);
      if (!messageDetails) return;

      if (messageDetails.message) {
        deleteMessage(id);
        let parent_id = messageDetails.message?._meta?.parent_id || '';

        //Update parent orders on remove message
        updateCollectionFns.updateOrders({
          action: 'remove',
          key: 'leaf_orders',
          parent_id,
          id,
        });

        playgroundMessageFns.remove(id);
      }
    },

    addDirectory: (directoryDetails: { name: string; parent_id: string }) => {
      let { name = '', parent_id = '' } = directoryDetails,
        directoryID = id();

      let directoryPayload = {
        name,
        _meta: {
          id: directoryID,
          parent_id,
        },
        meta: {
          dir_orders: [],
          leaf_orders: [],
        },
      };

      addDirectory(directoryPayload);

      //Update parent orders on add directory
      updateCollectionFns.updateOrders({
        action: 'add',
        key: 'dir_orders',
        parent_id,
        id: directoryID,
      });
    },

    updateDirectory: (id, { key, value }) => {
      if (!id || !key) return;
      changeDirectory(id, { key, value });
    },

    deleteDirectory: async (id) => {
      if (!id) return;

      let { collection } = websocketStoreApi.getState();

      // Directory to remove
      let foundDirectory = collection.directories.find(
        (dir) => dir._meta.id === id
      );

      if (foundDirectory) {
        deleteDirectory(id);

        let parent_id = foundDirectory._meta.parent_id || '';
        //update parent orders on remove dirctory
        updateCollectionFns.updateOrders({
          action: 'remove',
          key: 'dir_orders',
          parent_id,
          id,
        });
      }

      if (collection) {
        let dirsToRemoveIds = [id];
        let messagesToRemoveIds = [];

        if (!_array.isEmpty(collection.directories)) {
          //----------------------ALGORITHM: REMOVE DIRECTORY AND CHILDREN----------------------//

          /**
           * getChildren: Get and set children of directory
           * @param {*} dirId : Directory's id to get childern
           */
          let getChildren = async (dirId = '') => {
            // Child directories ids
            let childDirIds = collection.directories
              .filter((childDir) => childDir._meta.parent_id === dirId)
              .map((childDir) => childDir._meta.id);

            // Child messages ids
            let childMessageIds = collection.messages
              .filter((childMsg) => childMsg._meta.parent_id === dirId)
              .map((childMsg) => childMsg._meta.id);

            if (!_array.isEmpty(childDirIds)) {
              dirsToRemoveIds = dirsToRemoveIds.concat(childDirIds);

              for await (const childDirId of childDirIds) {
                // Recall: getChildren if child directory is parent of another directory
                await getChildren(childDirId);
              }
            }

            if (!_array.isEmpty(childMessageIds)) {
              messagesToRemoveIds = messagesToRemoveIds.concat(childMessageIds);
            }
            return Promise.resolve(true);
          };
          await getChildren(id);

          //-----------------------------------------------------------------------------------//

          if (
            !_array.isEmpty(collection.messages) &&
            !_array.isEmpty(messagesToRemoveIds)
          ) {
            // messageRes: Collection messages to set
            let messageRes = collection.messages.filter(
              (emtr) => !messagesToRemoveIds.includes(emtr._meta.id)
            );

            if (messageRes && !equal(messageRes, collection.messages)) {
              updateCollection('messages', messageRes);
            }
            playgroundMessageFns.removeMultiple(messagesToRemoveIds);
          }

          // dirResult: Collection directories to set
          let dirResult = collection.directories.filter(
            (dir) => !dirsToRemoveIds.includes(dir._meta.id)
          );

          if (dirResult && !equal(dirResult, collection.directories)) {
            updateCollection('directories', dirResult);
          }
        }
      }
    },

    updateOrders: ({
      action = 'add',
      key = 'leaf_orders',
      parent_id = '',
      id = '',
    }) => {
      let {
        collection,
        request: { meta },
      } = websocketStoreApi.getState();

      //Variable declaration
      let existingOrders = [],
        newOrders = [],
        parentType =
          parent_id && parent_id.length ? 'DIR' : ERequestTypes.WebSocket;
      let foundParentDirectoryIndex = collection.directories.findIndex(
        (dir) => dir._meta.id === parent_id
      );

      //Get existing orders from parent
      if (parentType === ERequestTypes.WebSocket) {
        existingOrders = meta[key] || [];
      } else if (parentType === 'DIR' && parent_id.length) {
        if (collection.directories) {
          if (
            foundParentDirectoryIndex !== -1 &&
            collection.directories[foundParentDirectoryIndex].meta &&
            collection.directories[foundParentDirectoryIndex].meta[key]
          ) {
            existingOrders =
              collection.directories[foundParentDirectoryIndex].meta[key];
          }
        }
      }

      //update orders by action type
      if (action === 'add') {
        newOrders = [...existingOrders, id];
      } else if (action === 'remove') {
        let foundExistingIndex = existingOrders.findIndex(
          (item) => item === id
        );
        if (foundExistingIndex !== -1) {
          newOrders = [
            ...existingOrders.slice(0, foundExistingIndex),
            ...existingOrders.slice(foundExistingIndex + 1),
          ];
        }
      }

      newOrders = _array.uniq(newOrders);
      //update state and parent component callback
      if (parentType === ERequestTypes.WebSocket) {
        _requestFns.updateMeta(key, newOrders);
      } else if (parentType === 'DIR' && parent_id.length) {
        // Update directory meta
        changeDirectory(parent_id, {
          key: 'meta',
          value: {
            ...collection.directories[foundParentDirectoryIndex].meta,
            [key]: newOrders,
          },
        });
      } else {
      }
    },
  };

  let playgroundMessageFns = {
    setToPlayground: (payload) => {
      if (!payload?._meta?.id) return;

      let {
        runtime: { activePlayground },
      } = websocketStoreApi.getState();

      setPlaygroundMessage(activePlayground, payload);
    },

    add: (payload, send = false) => {
      if (!payload?._meta?.id) return;

      let {
        collection,
        runtime: { activePlayground },
      } = websocketStoreApi.getState();

      let msg =
        collection?.messages.find((msg) => msg._meta.id === payload._meta.id) ||
        {};
      let msgToSetInPlayground = Object.assign({}, msg, payload); //TODO: check

      playgroundMessageFns.setToPlayground(msgToSetInPlayground);
      setSelectedCollectionMessage(activePlayground, payload?._meta?.id);

      if (send === true && msgToSetInPlayground) {
        sendMessage(activePlayground, msgToSetInPlayground);
      }
    },

    update: (id = '', payload = {}) => {
      let {
        runtime: { activePlayground },
        playgrounds,
      } = websocketStoreApi.getState();

      let message = playgrounds?.[activePlayground]?.message;

      if (playgrounds[activePlayground]?.selectedCollectionMessage === id) {
        setPlaygroundMessage(activePlayground, {
          ...message,
          ...payload,
        });
      }
    },

    remove: (id) => {
      if (!id) return;

      let {
        runtime: { activePlayground },
        playgrounds,
      } = websocketStoreApi.getState();

      if (playgrounds?.[activePlayground]?.selectedCollectionMessage === id) {
        playgroundMessageFns.addNewMessage();
      }
    },

    removeMultiple: (ids = []) => {
      let {
        runtime: { activePlayground },
        playgrounds,
      } = websocketStoreApi.getState();
      let selectedMessage =
        playgrounds[activePlayground]?.selectedCollectionMessage;

      if (selectedMessage && ids.includes(selectedMessage)) {
        playgroundMessageFns.addNewMessage();
      }
    },

    setToOriginal: (id) => {
      let {
        collection,
        runtime: { activePlayground },
        playgrounds,
      } = websocketStoreApi.getState();

      if (collection?.messages && id) {
        let oringinal = collection?.messages.find((msg) => msg._meta.id === id);
        let message = playgrounds?.[activePlayground]?.message;
        if (oringinal) {
          if (message) {
            oringinal = Object.assign({}, oringinal, {
              path: message.path || '',
            });
          }

          playgroundMessageFns.setToPlayground(oringinal);
        }
      }
    },

    onSave: (id) => {
      let { collection } = websocketStoreApi.getState();
      let existingMsgs = collection?.messages;

      if (existingMsgs) {
        let foundMsg = existingMsgs.find((msg) => msg._meta.id === id);

        if (foundMsg) {
          setMessage(id, foundMsg);
        }
      }
    },

    addNewMessage: () => {
      let {
        runtime: { activePlayground },
      } = websocketStoreApi.getState();

      setPlaygroundMessage(activePlayground, initialPlaygroundMessage);
      setSelectedCollectionMessage(activePlayground, '');
    },
  };

  let connectionsFns = {
    addConnection: async (name = '', connectOnCreate = true) => {
      if (!name) return;

      let {
        request: { connections: req_connections },
      } = websocketStoreApi.getState();

      let newconnectionId = id();
      let newReqConnection = Object.assign({}, REQUEST_CONNECTION);

      // Existing default connection
      let defaultConnection = req_connections.find((c) => c.is_default);

      if (!defaultConnection && !_array.isEmpty(req_connections)) {
        defaultConnection = req_connections[0];
      }

      let queryParams = defaultConnection[STRINGS.URL.QUERY_PARAMS] || [];
      queryParams = queryParams.map((q) => Object.assign({}, q, { id: id() }));

      let headers = defaultConnection['headers'] || [];
      headers = headers.map((h) => Object.assign({}, h, { id: id() }));

      defaultConnection = Object.assign({}, defaultConnection, {
        [STRINGS.URL.QUERY_PARAMS]: queryParams,
        headers,
      });

      delete defaultConnection['is_default'];

      newReqConnection = Object.assign(
        {},
        newReqConnection,
        defaultConnection || {},
        {
          name,
          id: newconnectionId,
        }
      );

      // Add connection in store
      addConnection(newReqConnection);

      let connectionPlayground = {
        id: newconnectionId,
        connectionState: EConnectionState.IDEAL,
        logFilters: {
          type: '',
        },
        message: initialPlaygroundMessage,
        selectedCollectionMessage: '',
      };

      addPlayground(newconnectionId, connectionPlayground);
      addPlaygroundTab({
        id: newconnectionId,
        name: name,
        meta: {
          is_saved: false,
          hasChange: false,
        },
      });

      // update active connection
      setActivePlayground(newconnectionId);

      if (connectOnCreate === true) {
        await connect(newconnectionId);
      }
      // return Promise.resolve(newReqConnection);
    },
  };

  const wsFns = {
    pingOn: (connectionId = '', interval = 3000) => {
      let conn = WSInstances_Ref.get(connectionId);
      if (!conn) return;
      // console.log(`interval`, interval);
      conn.ping(interval);
    },
    pingOff: (connectionId = '') => {
      let conn = WSInstances_Ref.get(connectionId);
      if (!conn) return;
      // console.log(`OFF`);
      conn.stopPinging('PING');
    },
  };

  let onSave = (pushPayload: IPushPayload, tabId) => {
    console.log({ pushPayload });

    if (!pushPayload._action || !pushPayload._meta.id) return;
    if (pushPayload._action.type === EPushActionType.Insert) {
      platformContext.request.subscribeChanges(
        pushPayload._meta.id,
        handlePull
      );
    }

    platformContext.request.onSave(pushPayload, tabId);

    let last = websocketStoreApi.getState().last,
      request = websocketStoreApi.getState().request;

    // set last value by pull action and request
    setLast({
      ...last,                 
      request,
      pushAction: emptyPushAction,
    });
  };

  return (
    <WebsocketContext.Provider
      value={{
        //props
        ctx_firecampFunctions: firecampFunctions,
        ctx_constants: propConstants,
        ctx_tabData: tab,

        //prop components
        ctx_additionalComponents: prop_additionalComponents,

        //functions
        ctx_requestFns: _requestFns,
        ctx_wsFns: wsFns,
        ctx_commonFns: _commonFns,
        ctx_playgroundMessageFns: playgroundMessageFns,
        ctx_updateCollectionFns: updateCollectionFns,
        ctx_connectionsFns: connectionsFns,

        ctx_emitter: emitterRef,
        ctx_onUpdateEnvironment: onUpdateEnvironment,
      }}
    >
      <RootContainer className="h-full w-full">
        <Container className="h-full with-divider">
          <Container.Header>
            <UrlBarContainer
              tab={tab}
              collectionId={tab?.request?._meta?.collection_id || ''}
              postComponents={platformComponents}
              onSaveRequest={onSave}
            />
          </Container.Header>
          <Container.Body>
            <Row flex={1} overflow="auto" className="with-divider h-full">
              {/* <MessageCollection tab={tab} /> */}
              <Column className="h-full">
                <ConnectionPanel />
              </Column>
            </Row>
          </Container.Body>
        </Container>
      </RootContainer>
      {tab.meta.isSaved && (
        <TabChangesDetector
          onChangeRequestTab={platformContext.request.onChangeRequestTab}
          tabId={tab.id}
          tabMeta={tab.meta}
        />
      )}
    </WebsocketContext.Provider>
  );
};

const withStore = (WrappedComponent) => {
  const MyComponent = ({ tab, ...props }) => {
    let { request = {} } = tab;
    let defaultConnection =
      request.connections?.find((c) => c.is_default === true) ||
      defaultConnectionState;

    let initPayload = {
      request: {
        url: request.url || { raw: '' },
        config: request.config || configState,
        connections: request.connections || [defaultConnection],
        meta: request.meta || {
          dir_orders: [],
          leaf_orders: [],
          version: '2.0.0',
        },
        _meta: request?._meta || {
          id: id(),
          collection_id: '',
        },
      },
      collection: request.collection || {
        messages: [],
        directories: [],
      },
      runtime: {
        activePlayground: defaultConnection?.id,
        playgroundTabs: [
          {
            id: defaultConnection.id,
            name: defaultConnection.name,
            meta: {
              is_saved: false,
              hasChange: false,
            },
          },
        ],
        active_environments: {
          workspace: '',
          collection: '',
        },
        is_request_saved: false,
      },
      playgrounds: {
        // Add logic for init playgrounds by connections
        [defaultConnection.id]: {
          id: defaultConnection.id,
          connectionState: EConnectionState.IDEAL,
          logFilters: {
            type: '',
          },
          message: initialPlaygroundMessage,
          selectedCollectionMessage: '',
        },
      },
    };

    return (
      <WebsocketStoreProvider
        createStore={() => createWebsocketStore(initPayload)}
      >
        <WrappedComponent tab={tab} {...props} />
      </WebsocketStoreProvider>
    );
  };

  return MyComponent;
};

export default withStore(Websocket);

const TabChangesDetector = ({ tabId, tabMeta, onChangeRequestTab }) => {
  let { pushAction } = useWebsocketStore(
    (s: IWebsocketStore) => ({
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
