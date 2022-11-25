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
} from '../store';
import { IPushPayload } from '../store/slices';
import { RequestConnection, InitPlayground  } from '../constants';
import {
  EArgumentBodyType,
  EPushActionType,
  ERequestTypes,
  ISocketIO,
} from '@firecamp/types';
import { _array } from '@firecamp/utils';
import { useEffect } from 'react';
import { EConnectionState } from '../types'
import EmitterCollection from './request/emitter/EmitterCollection'
import SidebarPanel from './sidebar-panel/SidebarPanel'

const Socket = ({
  firecampFunctions = {},
  constants: propConstants = {},
  environments = {},
  additionalComponents: propAdditionalComponents = {},
  onUpdateEnvironment = () => {},

  tab,
  platformContext,
  activeTab,
  platformComponents,
}) => {
  let socketStoreApi = useSocketStoreApi();

  let {
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
        socketStoreApi.getState()?.runtime?.active_environments;

      // set active environments to platform
      if (activeEnvironments && !!activeEnvironments.workspace) {
        console.log({ activeEnvironments });

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
    const _fetchRequest = async () => {
      try {
        const isRequestSaved = !!tab?.request?._meta?.id || false;
        let requestToNormalise: ISocketIO = {
          __meta: {
            name: '',
            version: '2.0.0',
            type: ERequestTypes.SocketIO,
          },
          __ref: { id: '', collectionId: '' },
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

  const updateCollectionFns = {
    addEmitter: async ({ name = '', parentId = '', label = '' }) => {
      const emitterId = id();
      const {
        runtime: { activePlayground },
        playgrounds,
      } = socketStoreApi.getState() as ISocketStore;

      const emitter = playgrounds?.[activePlayground]?.emitter;

      if (
        [EArgumentBodyType.NoBody, EArgumentBodyType.File].includes(
          emitter.__meta.type
        )
      ) {
        return;
      }

      const emitterPayload = {
        ...emitter,
        name,
        __meta: { ...emitter.__meta, label },
        __ref: {
          ...emitter.__ref,
          id: emitterId,
          folderId: parentId,
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
        key: 'iOrders',
        parentId,
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
        let parentId = emitterDetails.emitter?._meta?.parentId || '';

        //Update parent orders on remove emitter
        updateCollectionFns.updateOrders({
          action: 'remove',
          key: 'iOrders',
          parentId,
          id,
        });

        playgroundEmitterFns.remove(id);
      }
    },

    addDirectory: (directoryDetails: { name: string; parentId: string }) => {
      let { name = '', parentId = '' } = directoryDetails,
        directoryID = id();

      let directoryPayload = {
        name,
        _meta: {
          id: directoryID,
          parentId,
        },
        meta: {
          fOrders: [],
          iOrders: [],
        },
      };

      addDirectory(directoryPayload);

      //Update parent orders on add directory
      updateCollectionFns.updateOrders({
        action: 'add',
        key: 'fOrders',
        parentId,
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

        let parentId = foundDirectory._meta.parentId || '';
        //update parent orders on remove dirctory
        updateCollectionFns.updateOrders({
          action: 'remove',
          key: 'fOrders',
          parentId,
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
           * @param {*} dirId : Directory's id to get children
           */
          let getChildren = async (dirId = '') => {
            // Child directories ids
            let childDirIds = collection.directories
              .filter((childDir) => childDir._meta.parentId === dirId)
              .map((childDir) => childDir._meta.id);

            // Child emitters ids
            let childemitterIds = collection.emitters
              .filter((childEmitter) => childEmitter._meta.parentId === dirId)
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
      key = 'iOrders',
      parentId = '',
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
          parentId && parentId.length ? 'DIR' : ERequestTypes.SocketIO;
      let foundParentDirectoryIndex = collection.directories.findIndex(
        (dir) => dir._meta.id === parentId
      );

      //Get existing orders from parent
      if (parentType === ERequestTypes.SocketIO) {
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
      if (parentType === ERequestTypes.SocketIO) {
        changeMeta(key, newOrders);
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

      playgroundEmitterFns.setToPlayground(InitPlayground);
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
        ctx_additionalComponents: propAdditionalComponents,

        ctx_onUpdateEnvironment: onUpdateEnvironment,

        // new fns
        ctx_updateCollectionFns: updateCollectionFns,
        ctx_playgroundEmitterFns: playgroundEmitterFns,
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
    </SocketContext.Provider>
  );
};

const withStore = (WrappedComponent) => {
  const MyComponent = ({ tab, ...props }) => {
    let { request: tabRequest = {} } = tab;
    let defaultConnId = id();

    let defaultConnection = tabRequest.connections?.find(
      (c) => c.isDefault === true
    ) || {
      ...RequestConnection,
      id: defaultConnId,
      name: 'Default',
      isDefault: true,
      headers: [],
      queryParams: [],
      // auth: {},
      // active_auth_type: ""
    };
    let urlObject = {
      ...tabRequest.url,
      raw: _url.toString(tabRequest.url) || '',
    };

    const initPayload = {
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
          onConnectListeners: [],
        },
        connections: tabRequest.connections || [defaultConnection],
        __meta: tabRequest.__meta || {
          fOrders: [],
          iOrders: [],
          version: '2.0.0',
        },
        __ref: {
          id: id(),
          collectionId: '',
        },
      },
      collection: tabRequest.collection || {
        emitters: [],
        folders: [],
      },
      runtime: {
        activePlayground: defaultConnection?.id,
        playgroundTabs: [
          {
            id: defaultConnection.id,
            name: defaultConnection.name,
            meta: {
              isSaved: false,
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
          emitter: InitPlayground,
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
