import { IEnvironment, TId } from '@firecamp/types';
import {
  SetCompletionProvider,
  SetHoverProvider,
} from '@firecamp/ui-kit/src/components/editors/monaco/lang/init';
import _cloneDeep from 'lodash/cloneDeep';
import { _object } from '@firecamp/utils';

import { useTabStore } from '../../store/tab';
import { IEnvironmentStore, useEnvStore } from '../../store/environment';
import { ITab } from '../../components/tabs/types/tab';
import { platformEmitter } from '../platform-emitter';
// import {ITab}

interface IPlatformEnvironmentService {
  // subscribe to environment changes
  subscribeChanges: (tabId: TId, getPlatformVariables) => void;

  // get active workspace and collection envs
  getActiveEnvsByTabId: (tabId: TId) => Promise<{
    workspace: TId;
    collection?: TId;
  }>;

  // get variables by tab id
  getVariablesByTabId: (tabId: TId) => Promise<IPlatformVariables>;

  // set variables to IFE provider
  setVariablesToProvider: (variables: { [key: string]: any }) => void;

  // subscribe to environment changes
  unsubscribeChanges: (tabId: TId) => void;

  getAndEmitPlatformVariables: (tabId?: TId) => void;

  setActiveEnvironments: (requestEnvMeta: {
    activeEnvironments: {
      workspace: TId;
      collection?: TId;
    };
    collectionId?: TId;
  }) => void;

  setVariables?: (
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
  subscribeChanges: async (tabId: TId, getPlatformVariables) => {
    try {
      // subscribe/ listen environment update event
      platformEmitter.on(`env/t/${tabId}`, getPlatformVariables);

      environment.getAndEmitPlatformVariables(tabId);

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
    platformEmitter.off(`env/t/${tabId}`);
  },

  // get variables and emit updates
  getAndEmitPlatformVariables: async (tabId?: TId) => {
    if (!tabId) tabId = useTabStore.getState().activeTab;

    // get platform variables by tab id
    let platformEnvironments: IPlatformVariables =
      await environment.getVariablesByTabId(tabId);

    // set to variable provider
    environment.setVariablesToProvider(platformEnvironments?.merged || {});

    // get platform active envs
    let platformActiveEnv = await environment.getActiveEnvsByTabId(tabId);

    // console.log({ platformActiveEnv });

    // emit event: platform environment updates
    platformEmitter.emit(`env/t/${tabId}`, platformActiveEnv);
  },

  getActiveEnvsByTabId: (tabId: TId) => {
    const envStore: IEnvironmentStore = useEnvStore.getState();
    let tab: ITab = useTabStore.getState().list.find((t) => t.id === tabId);
    if (!tab || !tabId) return Promise.reject('invalid tab id');

    //workspace active environment
    const wrsActiveEnv = envStore.activeTabWrsEnv;
    let collectionActiveEnv = '';

    // get collectionId and collectionActiveEnv from tab's request's meta
    if (tab.meta.isSaved && tab.request?._meta.collection_id) {
      collectionActiveEnv =
        envStore.activeTabCollectionEnvs[tab.request._meta.collection_id];
    }

    return Promise.resolve({
      workspace: wrsActiveEnv,
      collection: collectionActiveEnv,
    });
  },

  // get variables by tab id
  getVariablesByTabId: async (tabId: TId) => {
    const envStore: IEnvironmentStore = useEnvStore.getState();
    const tab: ITab = useTabStore.getState().list.find((t) => t.id === tabId);
    if (!tab || !tabId) return Promise.reject('invalid tab id');

    const activeEnvsOfTab = await environment.getActiveEnvsByTabId(tabId);
    const collectionId = tab.request?._meta.collection_id || '';

    //workspace active environment
    const wrsActiveEnv = envStore.envs.find(
      (e) => e._meta.id == envStore.activeTabWrsEnv
    );
    const wrsEnvVars = wrsActiveEnv.variables || {};

    let collectionEnv: Partial<IEnvironment> = { name: '', variables: {} };
    if (collectionId && activeEnvsOfTab.collection) {
      collectionEnv = envStore.envs.find(
        (e) => e._meta.id == activeEnvsOfTab.collection
      );
    }
    const colEnvVars = collectionEnv.variables || {};

    // Merged workspace and collection variables
    const mergedVars =
      _object.mergeDeep(_cloneDeep(wrsEnvVars), _cloneDeep(colEnvVars)) || {};

    // console.log({ workspaceEnvVariables, collectionEnvVariables, mergedVars });

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
    // let activeTab_Ref = useRef(activeTab || '');
    // let tabs_Ref = useRef(zustandTabs || []);

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
          let collection_id = requestEnvMeta.collectionId;

          let currentCollectionSelectedEnv =
              envStore.activeTabCollectionEnvs[collection_id],
            updatedActiveCollectionEnv =
              requestEnvMeta.activeEnvironments['collection'];

          if (
            updatedActiveCollectionEnv &&
            updatedActiveCollectionEnv !== currentCollectionSelectedEnv
          ) {
            console.log({ updatedActiveCollectionEnv });

            envStore.setCollectionActiveEnv(
              collection_id,
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
      envStore.setWorkspaceEnvVariable(
        workspace.environmentId,
        workspace.variables
      );
    }

    // set collection environment
    if (collection?.id && collection?.environmentId) {
      envStore.setCollectionEnvVariable(
        collection.id,
        collection.environmentId,
        collection.variables
      );
    }
  },
};

export { IPlatformEnvironmentService, IPlatformVariables, environment };
