import { useEffect, useRef } from 'react';
import { Container, Row, RootContainer, Column } from '@firecamp/ui-kit';
import { nanoid as id } from 'nanoid';
import equal from 'deep-equal';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import { _array, _object } from '@firecamp/utils';
import {
  EPushActionType,
  ERequestTypes,
  IRequestFolder,
  IWebSocket,
} from '@firecamp/types';
import shallow from 'zustand/shallow';

import {
  initialiseStoreFromRequest,
  normalizeRequest,
} from '../services/reqeust.service';
import UrlBarContainer from './common/urlbar/UrlBarContainer';
import ConnectionPanel from './connection-panel/ConnectionPanel';

import Emitter from './common/Emitter';
import { WebsocketContext } from './WebSocket.context';
import { DefaultRequestConnection } from '../constants';
import { EConnectionState, EMessagePayloadTypes } from '../types';
import '../sass/ws.sass';

// store
import {
  createWebsocketStore,
  useWebsocketStore,
  useWebsocketStoreApi,
  WebsocketStoreProvider,
  IWebsocketStore,
  initialPlaygroundMessage,
  IPushPayload,
  emptyPushAction,
} from '../store/index';
import SidebarPanel from './sidebar-panel/SidebarPanel';

const Websocket = ({
  additionalComponents: prop_additionalComponents = {},
  onUpdateEnvironment = () => {},

  tab,
  platformContext,
  activeTab,
  platformComponents,
}) => {
  const { current: emitterRef } = useRef(new Emitter({})); //TODO: remove later
  const { current: WSInstances_Ref } = useRef(new Map());

  const _noop = () => {};

  /**
   * _requestFns: Request functions
   * @type {{updateMessage: ((p1?:*, p2:*)), updateURL: ((p1?:*)), updateConnection: ((p1?:*, p2?:*, p3:*)),  }}
   * @private
   */
  const _requestFns = {
    updateRequest: _noop,
    updateMessage: _noop,
    setMessage: _noop,
    updateURL: _noop,
    removeConnection: _noop,
    onChangeConfig: _noop,
    updateMeta: _noop,
    updateDNP: _noop,
  };

  const _commonFns = {
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

  const websocketStoreApi: any = useWebsocketStoreApi();

  const {
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
    sendMessage,
    connect,
    setLast,
    // prepareRequestUpdatePushAction,
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

  /** assign environments on tab load or when activeTab change**/
  useEffect(() => {
    if (activeTab === tab.id) {
      // existing active environments in to runtime
      const activeEnvironments =
        websocketStoreApi?.getState()?.runtime?.activeEnvironments;

      // set active environments to platform
      if (activeEnvironments && !!activeEnvironments.workspace) {
        // console.log({ activeEnvironments });

        platformContext.environment.setActiveEnvironments({
          activeEnvironments: {
            workspace: activeEnvironments.workspace,
            collection: activeEnvironments.collection || '',
          },
          collectionId: tab?.request?._meta?.collectionId || '',
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

  /** fetch request */
  useEffect(() => {
    const _fetchRequest = async () => {
      try {
        const isRequestSaved = !!tab?.request?.__ref?.id || false;
        // prepare a minimal request payload
        let requestToNormalize: IWebSocket = normalizeRequest({});

        if (isRequestSaved === true) {
          setIsFetchingReqFlag(true);
          try {
            const response = await platformContext.request.onFetch(
              tab.request._meta.id
            );
            requestToNormalize = { ...response.data };
          } catch (error) {
            console.error({
              api: 'fetch rest request',
              error,
            });
            throw error;
          }
        }
        /** initialise ws store on tab load */
        initialise(requestToNormalize);
        setIsFetchingReqFlag(false);
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
   * Handle pull payload
   * 1. initialise/ merge request
   * 2. Generate pull action
   */
  const handlePull = async (pullActions: IPushPayload[]) => {
    try {
      const pullPayload = pullActions[0];

      // console.log({ pullPayload });

      const last = websocketStoreApi.getState().last;
      let mergedPullAndLastRequest = _object.mergeDeep(
        _cloneDeep(last.request),
        _object.omit(pullPayload, ['_action'])
      );

      // merged request payload: merged existing request and pull payload request
      let updatedRequest = (await getMergedRequestByPullAction(
        pullPayload
      )) as IWebSocket;

      // console.log({ 111: updatedRequest });

      updatedRequest = await normalizeRequest(updatedRequest);

      // console.log({ updatedRequest, mergedPullAndLastRequest });

      // set last value by pull action and request
      setLast({
        ...last,
        request: mergedPullAndLastRequest,
        pushAction: pullPayload._action.keys || {},
      });

      // get push action payload
      // const pushAction = await prepareRequestUpdatePushAction(updatedRequest);
      // console.log({ 'pushAction on pull': pushAction });

      // initialise request with updated request and push action
      initialise(updatedRequest); //pushAction
      // _cloneDeep({ request: emptyPushAction }),
      setIsFetchingReqFlag(false);
    } catch (error) {
      console.error({
        API: 'rest.handlePull',
        error,
      });
    }
  };

  // handle updates for environments from platform
  const handlePlatformEnvironmentChanges = (platformActiveEnvironments) => {
    // console.log({ platformActiveEnvironments });

    if (!platformActiveEnvironments) return;
    let activeEnvironments =
      websocketStoreApi.getState().runtime.activeEnvironments;

    if (
      platformActiveEnvironments.workspace &&
      !equal(platformActiveEnvironments, activeEnvironments)
    ) {
      setActiveEnvironments(platformActiveEnvironments);
    }
  };

  const updateCollectionFns = {
    addMessage: async ({ name = '', parentId = '' }) => {
      let msgId = id();

      let {
        runtime: { activePlayground },
        playgrounds,
      } = websocketStoreApi.getState();

      let message = playgrounds?.[activePlayground]?.message;

      if (
        message.meta.type === 'noBody' ||
        message.meta.type === EMessagePayloadTypes.file
      ) {
        return;
      }

      let messagePayload = {
        ...message,
        name,
        _meta: {
          ...message._meta,
          id: msgId,
          parentId,
        },
      };

      addMessage(messagePayload);

      changePlaygroundTab(activePlayground, {
        meta: {
          isSaved: true,
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
        parentId,
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
        let parentId = messageDetails.message?._meta?.parentId || '';

        //Update parent orders on remove message
        updateCollectionFns.updateOrders({
          action: 'remove',
          key: 'leaf_orders',
          parentId,
          id,
        });

        playgroundMessageFns.remove(id);
      }
    },

    addDirectory: (folder: IRequestFolder) => {
      const {
        name,
        __ref: { collectionId, requestId, folderId },
      } = folder;
      const _id = id();
      const _folder: IRequestFolder = {
        name,
        __ref: {
          id: _id,
          collectionId,
          folderId,
          requestId,
          requestType: ERequestTypes.WebSocket,
        },
        __meta: {
          fOrders: [],
          iOrders: [],
        },
      };

      addDirectory(_folder);

      //Update parent orders on add directory
      updateCollectionFns.updateOrders({
        action: 'add',
        key: 'dir_orders',
        parentId: folderId,
        id: _id,
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

        let parentId = foundDirectory._meta.parentId || '';
        //update parent orders on remove directory
        updateCollectionFns.updateOrders({
          action: 'remove',
          key: 'dir_orders',
          parentId,
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
              .filter((childDir) => childDir._meta.parentId === dirId)
              .map((childDir) => childDir._meta.id);

            // Child messages ids
            let childMessageIds = collection.messages
              .filter((childMsg) => childMsg._meta.parentId === dirId)
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
      parentId = '',
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
          parentId && parentId.length ? 'DIR' : ERequestTypes.WebSocket;
      let foundParentDirectoryIndex = collection.directories.findIndex(
        (dir) => dir._meta.id === parentId
      );

      //Get existing orders from parent
      if (parentType === ERequestTypes.WebSocket) {
        existingOrders = meta[key] || [];
      } else if (parentType === 'DIR' && parentId.length) {
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
        //@ts-ignore
        _requestFns.updateMeta(key, newOrders);
      } else if (parentType === 'DIR' && parentId.length) {
        // Update directory meta
        changeDirectory(parentId, {
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

  const playgroundMessageFns = {
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
        let original = collection?.messages.find((msg) => msg._meta.id === id);
        let message = playgrounds?.[activePlayground]?.message;
        if (original) {
          if (message) {
            original = Object.assign({}, original, {
              path: message.path || '',
            });
          }

          playgroundMessageFns.setToPlayground(original);
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

  const connectionsFns = {
    addConnection: async (name = '', connectOnCreate = true) => {
      if (!name) return;

      let {
        request: { connections: reqConnections },
      } = websocketStoreApi.getState();

      let newConnectionId = id();
      let newReqConnection = Object.assign({}, DefaultRequestConnection);

      // Existing default connection
      let defaultConnection = reqConnections.find((c) => c.is_default);

      if (!defaultConnection && !_array.isEmpty(reqConnections)) {
        defaultConnection = reqConnections[0];
      }

      let queryParams = defaultConnection['queryParams'] || [];
      queryParams = queryParams.map((q) => Object.assign({}, q, { id: id() }));

      let headers = defaultConnection['headers'] || [];
      headers = headers.map((h) => Object.assign({}, h, { id: id() }));

      defaultConnection = Object.assign({}, defaultConnection, {
        queryParams: queryParams,
        headers,
      });

      delete defaultConnection['isDefault'];

      newReqConnection = Object.assign(
        {},
        newReqConnection,
        defaultConnection || {},
        {
          name,
          id: newConnectionId,
        }
      );

      // Add connection in store
      addConnection(newReqConnection);

      let connectionPlayground = {
        id: newConnectionId,
        connectionState: EConnectionState.Ideal,
        logFilters: {
          type: '',
        },
        message: initialPlaygroundMessage,
        selectedCollectionMessage: '',
      };

      addPlayground(newConnectionId, connectionPlayground);
      addPlaygroundTab({
        id: newConnectionId,
        name: name,
        meta: {
          isSaved: false,
          hasChange: false,
        },
      });

      // update active connection
      setActivePlayground(newConnectionId);

      if (connectOnCreate === true) {
        await connect(newConnectionId);
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

  const onSave = (pushPayload: IPushPayload, tabId) => {
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

  // if(isFetchingRequest === true) return <Loader />;
  console.log(tab, 'tab...');
  return (
    <WebsocketContext.Provider
      value={{
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
          <UrlBarContainer
            tab={tab}
            collectionId={tab?.request?._meta?.collectionId || ''}
            postComponents={platformComponents}
            onSaveRequest={onSave}
            platformContext={platformContext}
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
    const { request = {} } = tab;
    const initState = initialiseStoreFromRequest(request);
    return (
      <WebsocketStoreProvider
        createStore={() => createWebsocketStore(initState)}
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
      const isTabDirty = !_object.isEmpty(
        _cleanDeep(_cloneDeep(pushAction || {})) || {}
      );
      // Update tab meta if existing tab.meta.hasChange is not same as isTabDirty
      if (tabMeta.hasChange !== isTabDirty) {
        onChangeRequestTab(tabId, { hasChange: isTabDirty });
      }
    }
  }, [pushAction]);

  return <></>;
};
