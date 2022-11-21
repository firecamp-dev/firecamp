import { Container, Row, RootContainer, Column } from '@firecamp/ui-kit';
import { nanoid as id } from 'nanoid';
import equal from 'deep-equal';
import _cloneDeep from 'lodash/cloneDeep';
import _url from '@firecamp/url';

import UrlBarContainer from './common/urlbar/UrlBarContainer';
import ConnectionPanel from './connection-panel/ConnectionPanel';

import { SocketContext } from './Socket.context';

import '../sass/socket.sass';

import {
  SocketStoreProvider,
  createSocketStore,
  useSocketStoreApi,
  useSocketStore,
  ISocketStore,
  IPushPayload,
} from '../store';

import {
  REQUEST_CONNECTION,
  INIT_PLAYGROUND,
} from '../constants/StatePayloads';
import {
  EConnectionState,
  KEYS_ON_SAVE_REQUEST,
  ON_CHANGE_ACTIONS,
  STRINGS,
} from '../constants';
import {
  EArgumentBodyType,
  EPushActionType,
  ERequestTypes,
  ISocketIO,
} from '@firecamp/types';
import { _array } from '@firecamp/utils';
import { useEffect } from 'react';

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

const Socket = ({
  firecampFunctions = {},
  constants: propConstants = {},
  environments = {},
  additionalComponents: prop_additionalComponents = {},
  onUpdateEnvironment = () => {},

  tab,
  platformContext,
  activeTab,
  platformComponents,
}) => {
  let socketStoreApi = useSocketStoreApi();

  let {
    addConnection,
    addPlayground,
    addPlaygroundTab,
    setActivePlayground,
    setSelectedCollectionEmitter,
    addEmitter,
    changePlaygroundTab,
    changeEmitter,
    getEmitter,
    setEmitter,
    deleteEmitter,
    addDirectory,
    changeDirectory,
    deleteDirectory,
    updateCollection,
    setPlaygroundEmitter,
    sendMessage,
    changeMeta,
    setActiveEnvironments,
    setRequestSavedFlag,
    setIsFetchingReqFlag,
  } = useSocketStore((s: ISocketStore) => ({
    addConnection: s.addConnection,
    addPlayground: s.addPlayground,
    addPlaygroundTab: s.addPlaygroundTab,
    setActivePlayground: s.setActivePlayground,
    setSelectedCollectionEmitter: s.setSelectedCollectionEmitter,
    addEmitter: s.addEmitter,
    changePlaygroundTab: s.changePlaygroundTab,
    changeEmitter: s.changeEmitter,
    getEmitter: s.getEmitter,
    setEmitter: s.setEmitter,
    deleteEmitter: s.deleteEmitter,
    addDirectory: s.addDirectory,
    changeDirectory: s.changeDirectory,
    deleteDirectory: s.deleteDirectory,
    updateCollection: s.updateCollection,
    setPlaygroundEmitter: s.setPlaygroundEmitter,
    sendMessage: s.sendMessage,
    changeMeta: s.changeMeta,
    setActiveEnvironments: s.setActiveEnvironments,
    setRequestSavedFlag: s.setRequestSavedFlag,
    setIsFetchingReqFlag: s.setIsFetchingReqFlag,
  }));

  /**
   * Environments on tab load
   */
  useEffect(() => {
    if (activeTab === tab.id) {
      // existing active environments in to runtime
      let activeEnvironments =
        socketStoreApi?.getState()?.runtime?.active_environments;

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
      if (tab.meta.isSaved && tab?.request?._meta?.id) {
        platformContext.request.unsubscribeChanges(tab.request._meta.id);
      }
    };
  }, []);

  useEffect(() => {
    let _fetchRequest = async () => {
      try {
        let isRequestSaved = !!tab?.request?._meta?.id || false;
        let requestToNormalise: ISocketIO = {
          meta: {
            name: '',
            version: '2.0.0',
            type: ERequestTypes.SocketIO,
          },
          _meta: { id: '', collection_id: '' },
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

        /*  initialiseRequest(
          requestToNormalise,
          isRequestSaved,
          _cloneDeep(emptyPushAction),
          false,
          true
        ); */
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
  /* let initialiseRequest = async (
    requestToNormalise: IRest,
    isRequestSaved: boolean,
    pushAction?: IPushAction,
    hasPull?: boolean,
    isFresh?: boolean
  ) => {
    let request: IRestClientRequest = await normalizeRequestPayload(
      requestToNormalise,
      isRequestSaved
    );

    // Update auth type, generate auth headers
    updateActiveAuth(request.meta.active_auth_type);

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
  };
 */
  let connectionsFns = {
    addConnection: async (name = '', connectOnCreate = true) => {
      if (!name) return;

      let {
        request: { connections: req_connections },
      } = socketStoreApi.getState();

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
        connectionState: EConnectionState.Ideal,
        logFilters: {
          type: '',
          event: '',
        },
        emitter: INIT_PLAYGROUND,
        selectedCollectionEmitter: '',
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
        // await connect(newconnectionId);
      }
      // return Promise.resolve(newReqConnection);
    },
  };

  let updateCollectionFns = {
    addEmitter: async ({ name = '', parent_id = '', label = '' }) => {
      let emitterId = id();

      let {
        runtime: { activePlayground },
        playgrounds,
      } = socketStoreApi.getState();

      let emitter = playgrounds?.[activePlayground]?.emitter;

      if (
        emitter.meta.type === EArgumentBodyType.NoBody ||
        emitter.meta.type === EArgumentBodyType.File
      ) {
        return;
      }

      let emitterPayload = {
        ...emitter,
        name,
        meta: { ...emitter.meta, label },
        _meta: {
          ...emitter._meta,
          id: emitterId,
          parent_id,
        },
      };

      addEmitter(emitterPayload);

      changePlaygroundTab(activePlayground, {
        meta: {
          is_saved: true,
          hasChange: false,
        },
      });

      // TODO: Update parent orders on add emitter
      await updateCollectionFns.updateOrders({
        action: 'add',
        key: 'leaf_orders',
        parent_id,
        id: emitterId,
      });

      // TODO: check update playground emitter
      await playgroundEmitterFns.add(emitterPayload);

      // TODO: check update active emitter
      setSelectedCollectionEmitter(activePlayground, emitterId);

      // TODO: update request
    },

    updateEmitter: async (id, { key, value }) => {
      if (!id || !key) return;

      if (key !== 'path') {
        changeEmitter(id, { key, value });
      }
      playgroundEmitterFns.update(id, { [key]: value });
    },

    deleteEmitter: (id) => {
      if (!id) return;

      let emitterDetails = getEmitter(id);
      if (!emitterDetails) return;

      if (emitterDetails.emitter) {
        deleteEmitter(id);
        let parent_id = emitterDetails.emitter?._meta?.parent_id || '';

        //Update parent orders on remove emitter
        updateCollectionFns.updateOrders({
          action: 'remove',
          key: 'leaf_orders',
          parent_id,
          id,
        });

        playgroundEmitterFns.remove(id);
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

      let { collection } = socketStoreApi.getState();

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
        let emittersToRemoveIds = [];

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

            // Child emitters ids
            let childemitterIds = collection.emitters
              .filter((childEmitter) => childEmitter._meta.parent_id === dirId)
              .map((childEmitter) => childEmitter._meta.id);

            if (!_array.isEmpty(childDirIds)) {
              dirsToRemoveIds = dirsToRemoveIds.concat(childDirIds);

              for await (const childDirId of childDirIds) {
                // Recall: getChildren if child directory is parent of another directory
                await getChildren(childDirId);
              }
            }

            if (!_array.isEmpty(childemitterIds)) {
              emittersToRemoveIds = emittersToRemoveIds.concat(childemitterIds);
            }
            return Promise.resolve(true);
          };
          await getChildren(id);

          //-----------------------------------------------------------------------------------//

          if (
            !_array.isEmpty(collection.emitters) &&
            !_array.isEmpty(emittersToRemoveIds)
          ) {
            // emitterRes: Collection emitters to set
            let emitterRes = collection.emitters.filter(
              (emtr) => !emittersToRemoveIds.includes(emtr._meta.id)
            );

            if (emitterRes && !equal(emitterRes, collection.emitters)) {
              updateCollection('emitters', emitterRes);
            }
            playgroundEmitterFns.removeMultiple(emittersToRemoveIds);
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
      } = socketStoreApi.getState();

      //Variable declaration
      let existingOrders = [],
        newOrders = [],
        parentType =
          parent_id && parent_id.length ? 'DIR' : ERequestTypes.SocketIO;
      let foundParentDirectoryIndex = collection.directories.findIndex(
        (dir) => dir._meta.id === parent_id
      );

      //Get existing orders from parent
      if (parentType === ERequestTypes.SocketIO) {
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
      if (parentType === ERequestTypes.SocketIO) {
        changeMeta(key, newOrders);
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

  let playgroundEmitterFns = {
    setToPlayground: (payload) => {
      if (!payload?._meta?.id) return;

      let {
        runtime: { activePlayground },
      } = socketStoreApi.getState();

      setPlaygroundEmitter(activePlayground, payload);
    },

    add: (payload, send = false) => {
      if (!payload?._meta?.id) return;

      let {
        collection,
        runtime: { activePlayground },
      } = socketStoreApi.getState();

      let emitter =
        collection?.emitters.find(
          (emitter) => emitter._meta.id === payload._meta.id
        ) || {};
      let emitterToSetInPlayground = Object.assign({}, emitter, payload); //TODO: check

      playgroundEmitterFns.setToPlayground(emitterToSetInPlayground);
      setSelectedCollectionEmitter(activePlayground, payload?._meta?.id);

      if (send === true && emitterToSetInPlayground) {
        sendMessage(activePlayground, emitterToSetInPlayground);
      }
    },

    update: (id = '', payload = {}) => {
      let {
        runtime: { activePlayground },
        playgrounds,
      } = socketStoreApi.getState();

      let emitter = playgrounds?.[activePlayground]?.emitter;

      if (playgrounds[activePlayground]?.selectedCollectionEmitter === id) {
        setPlaygroundEmitter(activePlayground, {
          ...emitter,
          ...payload,
        });
      }
    },

    remove: (id) => {
      if (!id) return;

      let {
        runtime: { activePlayground },
        playgrounds,
      } = socketStoreApi.getState();

      if (playgrounds?.[activePlayground]?.selectedCollectionEmitter === id) {
        playgroundEmitterFns.addNewEmitter();
      }
    },

    removeMultiple: (ids = []) => {
      let {
        runtime: { activePlayground },
        playgrounds,
      } = socketStoreApi.getState();
      let selectedEmitter =
        playgrounds[activePlayground]?.selectedCollectionEmitter;

      if (selectedEmitter && ids.includes(selectedEmitter)) {
        playgroundEmitterFns.addNewEmitter();
      }
    },

    setToOriginal: (id) => {
      let {
        collection,
        runtime: { activePlayground },
        playgrounds,
      } = socketStoreApi.getState();

      if (collection?.emitters && id) {
        let oringinal = collection?.emitters.find((e) => e._meta.id === id);
        let emitter = playgrounds?.[activePlayground]?.emitter;
        if (oringinal) {
          if (emitter) {
            oringinal = Object.assign({}, oringinal, {
              path: emitter.path || '',
            });
          }

          playgroundEmitterFns.setToPlayground(oringinal);
        }
      }
    },

    onSave: (id) => {
      let { collection } = socketStoreApi.getState();
      let existingEmitters = collection?.emitters;

      if (existingEmitters) {
        let foundEmitter = existingEmitters.find((e) => e._meta.id === id);

        if (foundEmitter) {
          setEmitter(id, foundEmitter);
        }
      }
    },

    addNewEmitter: () => {
      let {
        runtime: { activePlayground },
      } = socketStoreApi.getState();

      playgroundEmitterFns.setToPlayground(INIT_PLAYGROUND);
      setSelectedCollectionEmitter(activePlayground, '');
    },
  };
  /**
   * Handle pull payload
   * 1. initialise/ merge request
   * 2. Generate pull action
   */
  /*  let handlePull = async (pullActions: IPushPayload[]) => {
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

      updatedReqeust = await normalizeRequestPayload(updatedReqeust, true);

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
        API: 'socket.handlePull',
        error,
      });
    }
  }; */

  let handlePull = () => {};

  let onSave = (pushPayload: IPushPayload, tabId) => {
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
  let handlePlatformEnvironmentChanges = (platformActiveEnvironments) => {
    // console.log({ platformActiveEnvironments });

    if (!platformActiveEnvironments) return;
    let activeEnvironments =
      socketStoreApi.getState().runtime.active_environments;

    if (
      platformActiveEnvironments.workspace &&
      !equal(platformActiveEnvironments, activeEnvironments)
    ) {
      setActiveEnvironments(platformActiveEnvironments);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        //props
        ctx_firecampFunctions: firecampFunctions,
        ctx_tabData: tab,
        ctx_environments: environments,

        //prop components
        ctx_additionalComponents: prop_additionalComponents,

        ctx_onUpdateEnvironment: onUpdateEnvironment,

        // new fns
        ctx_updateCollectionFns: updateCollectionFns,
        ctx_playgroundEmitterFns: playgroundEmitterFns,
        ctx_connectionsFns: connectionsFns,
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
              platformContext={platformContext}
            />
          </Container.Header>
          <Container.Body>
            <Row flex={1} overflow="auto" className="with-divider h-full">
              {/* <EmitterCollection
                tab={tab}
              /> */}
              <Column className="h-full">
                <ConnectionPanel />
              </Column>
            </Row>
          </Container.Body>
        </Container>
      </RootContainer>
    </SocketContext.Provider>
  );
};

const withStore = (WrappedComponent) => {
  const MyComponent = ({ tab, ...props }) => {
    let { request: tabRequest = {} } = tab;
    let defaultConnId = id();

    let defaultConnection = tabRequest.connections?.find(
      (c) => c.is_default === true
    ) || {
      ...REQUEST_CONNECTION,
      id: defaultConnId,
      name: 'Default',
      is_default: true,
      headers: [],
      query_params: [],
      // auth: {},
      // active_auth_type: ""
    };
    let urlObject = {
      ...tabRequest.url,
      raw: _url.toString(tabRequest.url) || '',
    };

    let initPayload = {
      request: {
        url: urlObject,
        config: tabRequest.config || {
          rejectUnauthorized: false,
          timeout: 20000,
          reconnection: false,
          reconnectionAttempts: 3,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          version: 'v4',
          on_connect_listeners: [],
        },
        connections: tabRequest.connections || [defaultConnection],
        meta: tabRequest.meta || {
          ['dir_orders']: [],
          ['leaf_orders']: [],
          version: '2.0',
        },
        _meta: {
          id: id(),
          collection_id: '',
        },
      },
      collection: tabRequest.collection || {
        emitters: [],
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
      },
      playgrounds: {
        // Add logic for init playgrounds by connections
        [defaultConnection.id]: {
          id: defaultConnection.id,
          connectionState: EConnectionState.Ideal,
          logFilters: {
            type: '',
            event: '',
          },
          emitter: INIT_PLAYGROUND,
          selectedCollectionEmitter: '',
          listeners: {},
        },
      },
    };

    return (
      <SocketStoreProvider createStore={() => createSocketStore(initPayload)}>
        <WrappedComponent tab={tab} {...props} />
      </SocketStoreProvider>
    );
  };

  return MyComponent;
};

export default withStore(Socket);
