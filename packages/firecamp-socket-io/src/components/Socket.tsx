import { useEffect } from 'react';
import { Container, Row, RootContainer, Column } from '@firecamp/ui-kit';
import { nanoid as id } from 'nanoid';
import equal from 'deep-equal';
import _cloneDeep from 'lodash/cloneDeep';
import _url from '@firecamp/url';
import { EArgumentBodyType, ERequestTypes, ISocketIO } from '@firecamp/types';
import { _array } from '@firecamp/utils';

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
import { InitPlayground } from '../constants';

import SidebarPanel from './sidebar-panel/SidebarPanel';
import { initialiseStoreFromRequest, normalizeRequest } from '../services/request.service';

const Socket = ({
  // firecampFunctions = {},
  // environments = {},
  // additionalComponents: propAdditionalComponents = {},
  onUpdateEnvironment = () => {},

  tab,
  platformContext,
  activeTab,
  platformComponents,
}) => {
  let socketStoreApi = useSocketStoreApi();

  let {
    initialise,
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
    initialise: s.initialise,
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
        socketStoreApi.getState().runtime?.activeEnvironments;

      // set active environments to platform
      if (activeEnvironments && !!activeEnvironments.workspace) {
        console.log({ activeEnvironments });

        platformContext.environment.setActiveEnvironments({
          activeEnvironments: {
            workspace: activeEnvironments.workspace,
            collection: activeEnvironments.collection || '',
          },
          collectionId: tab?.request?.__ref.collectionId || '',
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
    setRequestSavedFlag(tab?.__meta.isSaved);
  }, [tab?.__meta.isSaved]);

  /**
   * Subscribe/ unsubscribe request changes (pull-actions)
   */
  useEffect(() => {
    // subscribe request updates
    if (tab.__meta.isSaved && tab?.request?.__ref?.id) {
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
        const isRequestSaved = !!tab?.request?.__ref.id || false;
        // prepare a minimal request payload
        let _request: ISocketIO = normalizeRequest({});

        if (isRequestSaved === true) {
          setIsFetchingReqFlag(true);
          try {
            const response = await platformContext.request.onFetch(
              tab.request.__ref.id
            );
            _request = response.data;
          } catch (error) {
            console.error(error);
            throw error;
          }
        }
        /** initialise socket.io store on tab load */
        initialise(_request, tab.id);
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
        __meta: {
          isSaved: true,
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
        let parentId = emitterDetails.emitter?.__ref.parentId || '';

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
      const { name = '', parentId = '' } = directoryDetails,
        directoryID = id();

      const directoryPayload = {
        name,
        __ref: {
          id: directoryID,
          parentId,
        },
        __meta: {
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

      const { collection } = socketStoreApi.getState() as ISocketStore;

      // Directory to remove
      const foundDirectory = collection.directories.find(
        (dir) => dir.__ref.id === id
      );

      if (foundDirectory) {
        deleteDirectory(id);

        const parentId = foundDirectory.__ref.parentId || '';
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
           const getChildren = async (dirId = '') => {
            // Child directories ids
            const childDirIds = collection.directories
              .filter((childDir) => childDir.__ref.parentId === dirId)
              .map((childDir) => childDir.__ref.id);

            // Child emitters ids
            const childemitterIds = collection.emitters
              .filter((childEmitter) => childEmitter.__ref.parentId === dirId)
              .map((childEmitter) => childEmitter.__ref.id);

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
              (emtr) => !emittersToRemoveIds.includes(emtr.__ref.id)
            );

            if (emitterRes && !equal(emitterRes, collection.emitters)) {
              updateCollection('emitters', emitterRes);
            }
            playgroundEmitterFns.removeMultiple(emittersToRemoveIds);
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
      key = 'iOrders',
      parentId = '',
      id = '',
    }) => {
      let {
        collection,
        request: { __meta },
      } = socketStoreApi.getState() as ISocketStore;

      //Variable declaration
      let existingOrders = [],
        newOrders = [],
        parentType =
          parentId && parentId.length ? 'DIR' : ERequestTypes.SocketIO;
      let foundParentDirectoryIndex = collection.directories.findIndex(
        (dir) => dir.__ref.id === parentId
      );

      //Get existing orders from parent
      if (parentType === ERequestTypes.SocketIO) {
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
      if (parentType === ERequestTypes.SocketIO) {
        changeMeta(key, newOrders);
      } else if (parentType === 'DIR' && parentId.length) {
        // Update directory __meta
        changeDirectory(parentId, {
          key: '__meta',
          value: {
            ...collection.directories[foundParentDirectoryIndex].__meta,
            [key]: newOrders,
          },
        });
      } else {
      }
    },
  };

  const playgroundEmitterFns = {
    setToPlayground: (payload) => {
      if (!payload?.__ref.id) return;

      const {
        runtime: { activePlayground },
      } = socketStoreApi.getState() as ISocketStore;

      setPlaygroundEmitter(activePlayground, payload);
    },

    add: (payload, send = false) => {
      if (!payload?.__ref.id) return;

      const {
        collection,
        runtime: { activePlayground },
      } = socketStoreApi.getState() as ISocketStore;

      const emitter =
        collection?.emitters.find(
          (emitter) => emitter.__ref.id === payload.__ref.id
        ) || {};
      const emitterToSetInPlayground = Object.assign({}, emitter, payload); //TODO: check

      playgroundEmitterFns.setToPlayground(emitterToSetInPlayground);
      setSelectedCollectionEmitter(activePlayground, payload?.__ref.id);

      if (send === true && emitterToSetInPlayground) {
        sendMessage(activePlayground, emitterToSetInPlayground);
      }
    },

    update: (id = '', payload = {}) => {
      const {
        runtime: { activePlayground },
        playgrounds,
      } = socketStoreApi.getState() as ISocketStore;
      const emitter = playgrounds?.[activePlayground]?.emitter;
      if (playgrounds[activePlayground]?.selectedCollectionEmitter === id) {
        setPlaygroundEmitter(activePlayground, {
          ...emitter,
          ...payload,
        });
      }
    },

    remove: (id) => {
      if (!id) return;

      const {
        runtime: { activePlayground },
        playgrounds,
      } = socketStoreApi.getState() as ISocketStore;

      if (playgrounds?.[activePlayground]?.selectedCollectionEmitter === id) {
        playgroundEmitterFns.addNewEmitter();
      }
    },

    removeMultiple: (ids = []) => {
      const {
        runtime: { activePlayground },
        playgrounds,
      } = socketStoreApi.getState() as ISocketStore;
      const selectedEmitter =
        playgrounds[activePlayground]?.selectedCollectionEmitter;

      if (selectedEmitter && ids.includes(selectedEmitter)) {
        playgroundEmitterFns.addNewEmitter();
      }
    },

    setToOriginal: (id) => {
      const {
        collection,
        runtime: { activePlayground },
        playgrounds,
      } = socketStoreApi.getState() as ISocketStore;

      if (collection?.emitters && id) {
        let original = collection?.emitters.find((e) => e.__ref.id === id);
        let emitter = playgrounds?.[activePlayground]?.emitter;
        if (original) {
          if (emitter) {
            original = Object.assign({}, original, {
              path: emitter.path || '',
            });
          }

          playgroundEmitterFns.setToPlayground(original);
        }
      }
    },

    onSave: (id) => {
      const { collection } = socketStoreApi.getState() as ISocketStore;
      const existingEmitters = collection?.emitters;

      if (existingEmitters) {
        const foundEmitter = existingEmitters.find((e) => e.__ref.id === id);
        if (foundEmitter) {
          setEmitter(id, foundEmitter);
        }
      }
    },

    addNewEmitter: () => {
      const {
        runtime: { activePlayground },
      } = socketStoreApi.getState() as ISocketStore;

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

  const handlePull = () => {};

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
  };
  // handle updates for environments from platform
  const handlePlatformEnvironmentChanges = (platformActiveEnvironments) => {
    // console.log({ platformActiveEnvironments });

    if (!platformActiveEnvironments) return;
    const activeEnvironments =
      socketStoreApi.getState().runtime.activeEnvironments;

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
        // ctx_firecampFunctions: firecampFunctions,
        ctx_tabData: tab,
        // ctx_environments: environments,

        //prop components
        // ctx_additionalComponents: propAdditionalComponents,

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
            collectionId={tab?.request?.__ref.collectionId || ''}
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
    const { request = {}, id } = tab;
    const initState = initialiseStoreFromRequest(request, id);
    return (
      <SocketStoreProvider createStore={() => createSocketStore(initState)}>
        <WrappedComponent tab={tab} {...props} />
      </SocketStoreProvider>
    );
  };

  return MyComponent;
};

export default withStore(Socket);
