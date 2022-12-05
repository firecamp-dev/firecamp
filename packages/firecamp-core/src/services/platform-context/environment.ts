import { IEnvironment, TId } from '@firecamp/types';
import {
  SetCompletionProvider,
  SetHoverProvider,
} from '@firecamp/ui-kit/src/components/editors/monaco/lang/init';
import _cloneDeep from 'lodash/cloneDeep';
import { _object } from '@firecamp/utils';

import { useTabStore } from '../../store/tab';
import { IEnvironmentStore, useEnvStore } from '../../store/environment';
import { IRequestTab } from '../../components/tabs/types/tab';
import { prepareEventNameForEnvToTab } from '../platform-emitter/events';
import { platformEmitter } from '../platform-emitter';

interface IPlatformEnvironmentService {
  // subscribe to environment changes
  subscribeChanges: (tabId: TId, getPlatformVariables) => void;

  // unsubscribe to environment changes
  unsubscribeChanges: (tabId: TId) => void;

  // get active workspace and collection envs
  getActiveEnvsByTabId: (tabId: TId) => Promise<{
    workspace: TId;
    collection?: TId;
  }>;

  // get variables by tab id
  getVariablesByTabId: (tabId: TId) => Promise<IPlatformVariables>;

  // set variables to monaco provider
  setVariablesToProvider: (variables: { [key: string]: any }) => void;

  setVarsToProvidersAndEmitEnvsToTab: (tabId?: TId) => void;

  setActiveEnvironments: (requestEnvMeta: {
    activeEnvironments: {
      workspace: TId;
      collection?: TId;
    };
    collectionId?: TId;
  }) => void;

  setVariables: (
    workspace: {
      environmentId: TId;
      variables: { [key: string]: any };
    },
    collection?: {
      id?: TId;
      environmentId: TId;
      variables: { [key: string]: any };
    }
  ) => void;
}
interface IPlatformVariables {
  merged: {};
  workspace: {};
  collection: {};
}

const environment: IPlatformEnvironmentService = {
  // subscribe to environment changes
  subscribeChanges: async (tabId: TId, onPlatformVariablesChange) => {
    try {
      // subscribe/ listen environment update event
      platformEmitter.on(
        prepareEventNameForEnvToTab(tabId),
        onPlatformVariablesChange
      );
      environment.setVarsToProvidersAndEmitEnvsToTab(tabId);

      // TODO: check emit on update activeTab, activeTabWrsEnv, active_tab_collection_env, environments
    } catch (error) {
      console.error({
        API: 'platformContext.environment.subscribeChanges',
        error,
      });
    }
  },

  // subscribe to environment changes
  unsubscribeChanges: (tabId: TId) => {
    platformEmitter.off(prepareEventNameForEnvToTab(tabId));
  },

  // get variables and emit updates
  setVarsToProvidersAndEmitEnvsToTab: async (tabId?: TId) => {
    if (!tabId) tabId = useTabStore.getState().activeTab;

    /**
     * 1.1  get platform variables by tab id
     * 1.2  set variables to monaco providers
     */
    const platformVariables: IPlatformVariables =
      await environment.getVariablesByTabId(tabId);
    console.log(platformVariables, 'platformVariables');
    environment.setVariablesToProvider(platformVariables.merged);

    /**
     * 2.1  get platform active envs
     * 2.2  emit event: platform environment updates
     */
    let activeEnvsOfTan = await environment.getActiveEnvsByTabId(tabId);
    platformEmitter.emit(prepareEventNameForEnvToTab(tabId), activeEnvsOfTan);
  },

  getActiveEnvsByTabId: (tabId: TId) => {
    const envStore: IEnvironmentStore = useEnvStore.getState();
    let tab: IRequestTab = useTabStore.getState().list[tabId];
    if (!tab || !tabId) return Promise.reject('invalid tab id');

    //workspace active environment
    const wrsActiveEnv = envStore.activeTabWrsEnv;
    let collectionActiveEnv = '';

    // get collectionId and collectionActiveEnv from tab's request's __meta
    if (tab.__meta.isSaved && tab.request?.__ref.collectionId) {
      collectionActiveEnv =
        envStore.activeTabCollectionEnvs[tab.request.__ref.collectionId];
    }

    return Promise.resolve({
      workspace: wrsActiveEnv,
      collection: collectionActiveEnv,
    });
  },

  // get variables by tab id
  getVariablesByTabId: async (tabId: TId) => {
    const envStore: IEnvironmentStore = useEnvStore.getState();
    const tab: IRequestTab = useTabStore.getState().list[tabId];
    if (!tab || !tabId) return Promise.reject('invalid tab id');

    const activeEnvsOfTab = await environment.getActiveEnvsByTabId(tabId);
    const collectionId = tab.request?.__ref.collectionId || '';

    //workspace active environment
    const wrsActiveEnv = envStore.envs.find(
      (e) => e.__ref.id == envStore.activeTabWrsEnv
    );
    const wrsEnvVars = wrsActiveEnv ? wrsActiveEnv.variables : {};

    let collectionEnv: Partial<IEnvironment> = { name: '', variables: {} };
    if (collectionId && activeEnvsOfTab.collection) {
      collectionEnv = envStore.envs.find(
        (e) => e.__ref.id == activeEnvsOfTab.collection
      );
    }
    const colEnvVars = collectionEnv.variables || {};

    // Merged workspace and collection variables
    const mergedVars =
      _object.mergeDeep(_cloneDeep(wrsEnvVars), _cloneDeep(colEnvVars)) || {};

    // console.log({ wrsEnvVars, colEnvVars, mergedVars });

    // Platform environment resultant payload
    return Promise.resolve({
      merged: mergedVars,
      workspace: wrsEnvVars,
      collection: colEnvVars,
    });
  },

  // set variables to IFE provider
  setVariablesToProvider: (variables: { [key: string]: any }) => {
    SetCompletionProvider('ife-text', variables);
    SetHoverProvider('ife-text', variables);

    SetCompletionProvider('ife-header-key', variables);
    SetHoverProvider('ife-header-key', variables);

    SetCompletionProvider('ife-header-value', variables);
    SetHoverProvider('ife-header-value', variables);

    SetCompletionProvider('json', variables);
    SetHoverProvider('json', variables);
  },

  setActiveEnvironments: (requestEnvMeta: {
    activeEnvironments: {
      workspace: TId;
      collection?: TId;
    };
    collectionId?: TId;
  }) => {
    const envStore: IEnvironmentStore = useEnvStore.getState();

    // console.log({ requestEnvMeta });

    if ('activeEnvironments' in requestEnvMeta) {
      if (requestEnvMeta.activeEnvironments) {
        if (requestEnvMeta.activeEnvironments['workspace']) {
          // Change workspace selected environment
          let currentWrsSelectedEnv = envStore.activeTabWrsEnv,
            updatedActiveWrsEnv =
              requestEnvMeta.activeEnvironments['workspace'];

          // console.log({ currentWrsSelectedEnv, updatedActiveWrsEnv });

          if (
            updatedActiveWrsEnv &&
            updatedActiveWrsEnv !== currentWrsSelectedEnv
          ) {
            envStore.setWorkspaceActiveEnv(updatedActiveWrsEnv);
          }
        }
        // Change collection selected environment
        if (
          requestEnvMeta.collectionId &&
          requestEnvMeta.activeEnvironments['collection']
        ) {
          let collectionId = requestEnvMeta.collectionId;

          let currentCollectionSelectedEnv =
              envStore.activeTabCollectionEnvs[collectionId],
            updatedActiveCollectionEnv =
              requestEnvMeta.activeEnvironments['collection'];

          if (
            updatedActiveCollectionEnv &&
            updatedActiveCollectionEnv !== currentCollectionSelectedEnv
          ) {
            console.log({ updatedActiveCollectionEnv });

            envStore.setCollectionActiveEnv(
              collectionId,
              updatedActiveCollectionEnv
            );
          }
        }
      }
    }
  },

  setVariables: (
    workspace: {
      environmentId: TId;
      variables: { [key: string]: any };
    },
    collection?: {
      id?: TId;
      environmentId: TId;
      variables: { [key: string]: any };
    }
  ) => {
    console.log({ workspace, collection });
    const envStore: IEnvironmentStore = useEnvStore.getState();

    // set workspace environment
    if (workspace?.environmentId) {
      envStore.setEnvVariables(workspace.environmentId, workspace.variables);
    }

    // set collection environment
    if (collection?.id && collection?.environmentId) {
      envStore.setEnvVariables(collection.environmentId, collection.variables);
    }
  },
};

export { IPlatformEnvironmentService, IPlatformVariables, environment };
