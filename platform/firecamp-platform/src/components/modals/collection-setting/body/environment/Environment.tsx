import { FC, useEffect, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import shallow from 'zustand/shallow';
import { nanoid as id } from 'nanoid';
import create from 'zustand';
import {
  // Collection,
  Container,
  Column,
  Row,
  Resizable,
} from '@firecamp/ui-kit';

import {
  constants as envConsts,
  environmentStore,
} from '../../../../../zustand/environment';
import Utility from '../../../environment/Utility';
import EnvCard from './EnvCard';
import EnvPlayground from './EnvPlayground';
import AddEnv from '../../../environment/body/AddEnv';

import {
  preferenceStore,
  Preferences,
} from '../../../../../store/-bk_preferences';
import ActiveEnvDD from './ActiveEnvDD';
import { Preferences as _Preferences } from '../../../../../constants';
import { _array, _object } from '@firecamp/utils';

const Environment: FC<IEnvironment> = ({
  workspace = {},
  collectionId = '',
  meta = {
    showHeader: true,
    header: '',
    isAddEnvPopoverOpen: false,
  },
}) => {
  const initialZustandState = { environments: new Map() };

  //Project environment
  let environments = environmentStore(
    (state) => state[envConsts.ACTIONS.GET_PROJECT_ENVS](collectionId),
    shallow
  );

  let [store_environments] = useState(() => create(() => initialZustandState));

  let envType = collectionId === 'global' ? 'global' : 'project';

  //Project Environment environments collection
  let [environmentCollection, setEnvironmentCollection] = useState([]);

  let [activeEnv, setActiveEnv] = useState('');

  useEffect(() => {
    let _setActiveEnv = (state) => {
      let newActiveEnv = '';
      if (collectionId === 'global') {
        newActiveEnv = state?.[_Preferences.Name.WORKSPACE_ACTIVE_ENVIRONMENT];
      } else {
        newActiveEnv =
          state?.[_Preferences.Name.PROJECT_ACTIVE_ENVIRONMENT]?.[collectionId];
      }

      if (newActiveEnv !== activeEnv) {
        setActiveEnv(newActiveEnv);
      }
    };

    if (preferenceStore?.getState()) {
      let preferences = preferenceStore?.getState();
      _setActiveEnv(preferences);
    }

    // Subscribe activeEnv changes
    let unsubscribeActiveEnv = preferenceStore.subscribe(
      (updates) => {
        _setActiveEnv(updates);
      },
      (state) => state
    );

    return () => {
      // unsubscribe on unmount
      unsubscribeActiveEnv();
    };
  }, []);

  useEffect(() => {
    if (environments && environments[envType]) {
      let envs = Utility.getEnvironments(
        environments[envType].environments || []
      );
      if (!isEqual(envs, environmentCollection)) {
        setEnvironmentCollection(envs);
      }
    } else {
      setEnvironmentCollection([]);
    }
  }, [environments ? environments[envType] : '']);

  /**
   * Get active environment from project environment collection
   * @returns {{}|unknown}
   */
  let getActiveEnv = () => {
    if (environmentCollection && environments?.[envType]?.__meta) {
      let activeEnvData = (environmentCollection || []).find(
        (env) => env.__ref.id === activeEnv
      );
      return activeEnvData || { __ref: {} };
    } else {
      return { __ref: {} };
    }
  };

  let [activeEnvCard, setActiveEnvCard] = useState(getActiveEnv());
  let [isInitialised, toggleInitialised] = useState(false);

  let coll_ref = useRef(null);

  useEffect(() => {
    return () => {
      store_environments.setState((state) => {
        let envList = state.environments || new Map();
        envList.clear();
        return { environments: new Map([...envList]) };
      });
    };
  }, []);

  useEffect(() => {
    if (environments && environments[envType] && environments[envType].__meta) {
      let envId = activeEnvCard?.__ref?.id || activeEnv;

      let newActiveEnv = (environmentCollection || []).find(
        (env) => env.__ref.id === envId
      );
      if (!newActiveEnv && environmentCollection) {
        newActiveEnv = environmentCollection[0];
      }

      if (newActiveEnv) {
        if (isInitialised === false) {
          store_environments.setState((state) => {
            let environmentsList = state.environments || new Map();
            let existing = environmentsList.get(envId);
            if (!existing) {
              return {
                environments: new Map([
                  ...environmentsList,
                  [
                    envId,
                    {
                      __ref: { id: envId },
                      body: newActiveEnv.body || '',
                    },
                  ],
                ]),
              };
            } else {
              return { environments: environmentsList };
            }
          });
          toggleInitialised(true);
        }

        let isActiveEnvCardExistInCollection = (
          environmentCollection || []
        ).find((env) => env.__ref.id === activeEnvCard.__ref.id);

        if (
          !isEqual(newActiveEnv, activeEnvCard) &&
          !isActiveEnvCardExistInCollection
        ) {
          setActiveEnvCard(newActiveEnv);
          if (coll_ref && coll_ref.current) {
            coll_ref.current._clearSelections();
            coll_ref.current._setSelection([newActiveEnv.__ref.id]);
            coll_ref.current._focus(newActiveEnv.__ref.id);
          }
        } else if (
          newActiveEnv.__ref.id === activeEnvCard.__ref.id &&
          !isEqual(newActiveEnv, activeEnvCard)
        ) {
          setActiveEnvCard(newActiveEnv);
        }
      }
    }
  }, [environmentCollection]);

  let _zustandEnvFns = {
    add: (payload, setOriginal = false, appendExistingPayload = false) => {
      if (!payload || !payload.__ref.id) return;

      store_environments.setState((state) => {
        let environments = state.environments || new Map();
        if (environments.has(payload.__ref.id) && setOriginal === false) {
          let existingEnv = environments.get(payload.__ref.id);
          let snToSet = Object.assign({}, payload);

          if (appendExistingPayload === true) {
            snToSet = Object.assign({}, snToSet, existingEnv);
          } else {
            snToSet = Object.assign({}, existingEnv, snToSet);
          }
          return {
            environments: new Map([
              ...environments,
              [payload.__ref.id, snToSet],
            ]),
          };
        } else {
          return {
            environments: new Map([
              ...environments,
              [payload.__ref.id, payload],
            ]),
          };
        }
      });
    },
    update: (id = '', payload = {}) => {
      store_environments.setState((state) => {
        let environments = state.environments || new Map();
        if (environments.has(id)) {
          let existingEnv = environments.get(id),
            environment = _object.mergeDeep(existingEnv, payload);

          return {
            environments: new Map([...environments, [id, environment]]),
          };
        } else {
          return { environments: new Map([...environments]) };
        }
      });
    },
    save: (envId = '', collectionId = '', variables = '') => {
      let variablesToSave = Utility.parseVariables.toJSONObject(variables);

      if (variablesToSave !== undefined && variablesToSave !== false) {
        let clonedVariables = Object.assign({}, variablesToSave);

        _envFns.update(
          {
            variables: clonedVariables,
          },
          envId,
          collectionId
        );
      }
    },
  };

  let _projectFns = {
    updateDefaultEnv: async (collectionId = '', envId = '') => {},
  };

  let _envFns = {
    add: async (env = {}) => {
      let newEnvId = id();

      let environmentPayload = Object.assign(
        {},
        {
          __ref: { id: newEnvId },
          variables: {
            variableName: 'variableValue',
          },
          meta: {
            type: collectionId === 'global' ? Stores.WORKSPACE : 'P',
          },
        },
        env
      );

      if (collectionId !== 'global') {
        environmentPayload['__ref'] = {
          ...environmentPayload['__ref'],
          collectionId: collectionId,
        };
      }

      // await F.appStore.environment.add.environment(
      //   {
      //     collectionId,
      //     environment: environmentPayload,
      //   },
      //   { remote: true, sync: true, cloudSync: true }
      // );

      // Set active environment to user preferences
      _setActiveEnv({ id: newEnvId });
    },

    rename: async (environment) => {
      if (!environment) return;

      if (environment.hasOwnProperty('children')) {
        return;
      } else {
        if (environment.__ref.id && environment.name) {
          let name = environment.name.trim();
          if (!name) return false;
          let path = environment.__ref
            ? environment.__ref._relative_path || ''
            : '';
          let envs = (environmentCollection || []).map((env) => env.name);

          if (envs && envs.includes(name)) {
            return false;
          }
          await _envFns.update(
            { name },
            environment.__ref.id,
            environment.__meta ? environment.__meta.parentId || '' : ''
          );
          return true;
        }
      }
    },

    update: async (payload = {}, envId, collectionId) => {
      if (!activeEnvCard || !activeEnvCard.__ref.id) return;
    },

    remove: async (environment = {}) => {
  
    },
  };

  let _onNodeFocus = ({ _meta, ...collectionNode }) => {
    if (
      _meta.id === activeEnvCard.__ref.id &&
      _meta._relative_path === activeEnvCard.path
    ) {
      return;
    }

    if (!collectionNode.children) {
      _zustandEnvFns.add({ _meta, ...collectionNode }, false, true);
      setActiveEnvCard({ _meta, ...collectionNode });
    }
  };

  let _nodeFns = {
    allowRemove: (node) => {
      if (collectionId !== 'global') {
        return !(node.name === 'Development' || node.name === 'Production');
      } else {
        return environmentCollection.length > 1;
      }
    },
    allowRename: (node) => {
      if (collectionId !== 'global') {
        return !(node.name === 'Development' || node.name === 'Production');
      } else {
        return true;
      }
    },
  };

  /**
   * Set active environment in zustand preference store and DB.
   * @param {*} env : <type: Object> environment object to set active id from.
   * @returns
   */
  let _setActiveEnv = (env) => {
    if (!env.id || env.id === activeEnv) return;

    if (collectionId === 'global') {
      Preferences.updateWrsActiveEnv(env.id);
    } else {
      Preferences.updatePrjActiveEnv(collectionId, env.id);
    }
  };

  return (
    <div className="h-full">
      <Container>
        {meta.showHeader ? (
          <Container.Header>
            {!_array.isEmpty(environmentCollection) ? (
              <div className="text-lg leading-5 py-3 px-6 flex items-center font-medium justify-between fc-setting-title-v2 border-b border-appBorder">
                <div className="flex flex-col mr-2 text-sm font-semibold">
                  Default Active Environment
                  <span className="text-sm font-light text-appForegroundInActive">
                    every request opened from this project will use the same
                    active environment.
                  </span>
                </div>
                <ActiveEnvDD
                  environments={environmentCollection}
                  activeEnv={activeEnv || ''}
                  onSelect={_setActiveEnv}
                />
              </div>
            ) : (
              ''
            )}
          </Container.Header>
        ) : (
          ''
        )}
        <Container.Body>
          <Row className="with-divider fc-h-full">
            <Resizable
              right={true}
              width={200}
              minWidth={100}
              maxWidth={400}
              height="100%"
            >
              <Column>
                <Container className="with-divider">
                  <Container.Body>
                    <AddEnv
                      isOpen={meta.isAddEnvPopoverOpen}
                      collectionId={collectionId}
                      existingEnvs={environmentCollection}
                      title={'+ Add environment'}
                      onAdd={(name) => {
                        _envFns.add({ name });
                      }}
                    />
                    {!_array.isEmpty(environmentCollection) ? (
                      /*  <Collection
                        primaryKey="id"
                        data={environmentCollection}
                        className="env-snippet"
                        showRootHeader={false}
                        // rootHeader={"My WorkSpace"}
                        onNodeFocus={_onNodeFocus}
                        defaultSelectedIds={
                          activeEnvCard ? [activeEnvCard.__ref.id] : []
                        }
                        nodeRenderer={({
                          isDirectory,
                          item,
                          isExpanded,
                          classes,
                          getNodeProps,
                          toggleRenaming,
                          isRenaming,
                          renameComp,
                        }) => {
                          if (!isDirectory) {
                            return (
                              <EnvCard
                                item={item}
                                className={classes}
                                onSetVariables={() => {}}
                                collectionId={collectionId}
                                isRenaming={isRenaming}
                                renameComp={renameComp}
                                meta={{
                                  allowRename: _nodeFns.allowRename(item),
                                  allowRemove: _nodeFns.allowRemove(item),
                                }}
                                onDelete={_envFns.remove}
                                toggleRenaming={toggleRenaming}
                                {...getNodeProps()}
                              />
                            );
                          }
                        }}
                        onNodeRename={_envFns.rename}
                        onLoad={(col) => {
                          coll_ref.current = col;

                          if (
                            col &&
                            activeEnvCard &&
                            activeEnvCard.__ref.id
                          ) {
                            col._setSelection([activeEnvCard.__ref.id]);
                            col._focus(activeEnvCard.__ref.id);
                          }
                        }}
                      /> */ ''
                    ) : (
                      <Container.Empty flex={1} className="fc-empty-center">
                        No Environments
                      </Container.Empty>
                    )}
                  </Container.Body>
                </Container>
              </Column>
            </Resizable>
            <Column flex={1} overflow={'auto'}>
              <EnvPlayground
                activeEnv={activeEnvCard}
                storeEnvFns={_zustandEnvFns}
                isAddEnvPopoverOpen={meta.isAddEnvPopoverOpen}
                storeEnvironments={store_environments}
              />
            </Column>
          </Row>
        </Container.Body>
      </Container>
    </div>
  );
};

export default Environment;

interface IEnvironment {
  workspace: any; //{}  //todo: define a proper type here
  collectionId: string;
  meta: {
    showHeader: boolean;
    header: string;
    isAddEnvPopoverOpen: boolean;
  };
}
