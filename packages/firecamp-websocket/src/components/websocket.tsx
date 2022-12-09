import { useEffect, useRef } from 'react';
import { Container, Row, RootContainer, Column } from '@firecamp/ui-kit';
import { nanoid as id } from 'nanoid';
import equal from 'deep-equal';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import { _array, _object } from '@firecamp/utils';
import { ERequestTypes, IRequestFolder, IWebSocket } from '@firecamp/types';
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
    setPlaygroundMessage,
    setSelectedCollectionMessage,
    changePlaygroundTab,
    sendMessage,
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
      setPlaygroundMessage: s.setPlaygroundMessage,
      setSelectedCollectionMessage: s.setSelectedCollectionMessage,
      changePlaygroundTab: s.changePlaygroundTab,
      sendMessage: s.sendMessage,
      connect: s.connect,
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
        let _request: IWebSocket = normalizeRequest({});

        if (isRequestSaved === true) {
          setIsFetchingReqFlag(true);
          try {
            const response = await platformContext.request.onFetch(
              tab.request.__ref.id
            );
            _request = { ...response.data };
          } catch (error) {
            console.error({
              api: 'fetch rest request',
              error,
            });
            throw error;
          }
        }
        /** initialise ws store on tab load */
        initialise(_request, tab.id);
        setIsFetchingReqFlag(false);
      } catch (e) {
        console.error(e);
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
  const handlePull = async (pullActions: any[]) => {
    try {
      const pullPayload = pullActions[0];

      // console.log({ pullPayload });

      // const last = websocketStoreApi.getState().last;
      // let mergedPullAndLastRequest = _object.mergeDeep(
      //   _cloneDeep(last.request),
      //   _object.omit(pullPayload, ['_action'])
      // );

      // merged request payload: merged existing request and pull payload request
      let updatedRequest = (await getMergedRequestByPullAction(
        pullPayload
      )) as IWebSocket;

      // console.log({ 111: updatedRequest });

      updatedRequest = await normalizeRequest(updatedRequest);

      // console.log({ updatedRequest, mergedPullAndLastRequest });

      // set last value by pull action and request

      // const pushAction = await prepareRequestUpdatePushAction(updatedRequest);
      // console.log({ 'pushAction on pull': pushAction });

      // initialise request with updated request
      // initialise(updatedRequest); //pushAction
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
        message.__meta.type === 'noBody' ||
        message.__meta.type === EMessagePayloadTypes.file
      ) {
        return;
      }

      let messagePayload = {
        ...message,
        name,
        __ref: {
          ...message.__ref,
          id: msgId,
          parentId,
        },
      };

      addMessage(messagePayload);

      changePlaygroundTab(activePlayground, {
        __meta: {
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
        let parentId = messageDetails.message?.__ref?.parentId || '';

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
        (dir) => dir.__ref.id === id
      );

      if (foundDirectory) {
        deleteDirectory(id);

        let parentId = foundDirectory.__ref.parentId || '';
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
              .filter((childDir) => childDir.__ref.parentId === dirId)
              .map((childDir) => childDir.__ref.id);

            // Child messages ids
            let childMessageIds = collection.messages
              .filter((childMsg) => childMsg.__ref.parentId === dirId)
              .map((childMsg) => childMsg.__ref.id);

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
              (emtr) => !messagesToRemoveIds.includes(emtr.__ref.id)
            );

            if (messageRes && !equal(messageRes, collection.messages)) {
              updateCollection('messages', messageRes);
            }
            playgroundMessageFns.removeMultiple(messagesToRemoveIds);
          }

          // dirResult: Collection directories to set
          let dirResult = collection.directories.filter(
            (dir) => !dirsToRemoveIds.includes(dir.__ref.id)
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
        request: { __meta },
      } = websocketStoreApi.getState();

      //Variable declaration
      let existingOrders = [],
        newOrders = [],
        parentType =
          parentId && parentId.length ? 'DIR' : ERequestTypes.WebSocket;
      let foundParentDirectoryIndex = collection.directories.findIndex(
        (dir) => dir.__ref.id === parentId
      );

      //Get existing orders from parent
      if (parentType === ERequestTypes.WebSocket) {
        existingOrders = __meta[key] || [];
      } else if (parentType === 'DIR' && parentId.length) {
        if (collection.directories) {
          if (
            foundParentDirectoryIndex !== -1 &&
            collection.directories[foundParentDirectoryIndex].__meta &&
            collection.directories[foundParentDirectoryIndex].__meta[key]
          ) {
            existingOrders =
              collection.directories[foundParentDirectoryIndex].__meta[key];
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
        // _requestFns.updateMeta(key, newOrders);
      } else if (parentType === 'DIR' && parentId.length) {
        // Update directory meta
        changeDirectory(parentId, {
          key: 'meta',
          value: {
            ...collection.directories[foundParentDirectoryIndex].__meta,
            [key]: newOrders,
          },
        });
      } else {
      }
    },
  };

  const playgroundMessageFns = {
    setToPlayground: (payload) => {
      if (!payload?.__ref?.id) return;

      let {
        runtime: { activePlayground },
      } = websocketStoreApi.getState();

      setPlaygroundMessage(activePlayground, payload);
    },

    add: (payload, send = false) => {
      if (!payload?.__ref?.id) return;

      let {
        collection,
        runtime: { activePlayground },
      } = websocketStoreApi.getState();

      let msg =
        collection?.messages.find((msg) => msg.__ref.id === payload.__ref.id) ||
        {};
      let msgToSetInPlayground = Object.assign({}, msg, payload); //TODO: check

      playgroundMessageFns.setToPlayground(msgToSetInPlayground);
      setSelectedCollectionMessage(activePlayground, payload?.__ref?.id);

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
        let original = collection?.messages.find((msg) => msg.__ref.id === id);
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
        let foundMsg = existingMsgs.find((msg) => msg.__ref.id === id);

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

  const onSave = (pushPayload: any, tabId) => {
    console.log({ pushPayload });
    if (!pushPayload._action || !pushPayload.__ref.id) return;
    if (pushPayload._action.type === 'i') {
      platformContext.request.subscribeChanges(
        pushPayload.__ref.id,
        handlePull
      );
    }
    platformContext.request.onSave(pushPayload, tabId);
    // let last = websocketStoreApi.getState().last,
    // request = websocketStoreApi.getState().request;
  };

  // set last value by pull action and request

  // if(isFetchingRequest === true) return <Loader />;
  console.log(tab, 'tab...');
  return (
    <WebsocketContext.Provider
      value={{
        //functions
        ctx_playgroundMessageFns: playgroundMessageFns,
        ctx_updateCollectionFns: updateCollectionFns,

        ctx_emitter: emitterRef,
        ctx_onUpdateEnvironment: onUpdateEnvironment,
      }}
    >
      <RootContainer className="h-full w-full">
        <Container className="h-full with-divider">
          <UrlBarContainer
            tab={tab}
            collectionId={tab?.request?.__ref?.collectionId || ''}
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
    </WebsocketContext.Provider>
  );
};

const withStore = (WrappedComponent) => {
  const MyComponent = ({ tab, ...props }) => {
    const { request = {}, id } = tab;
    const initState = initialiseStoreFromRequest(request, id);
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
