import { EEditorLanguage, IEnvironment, TId } from '@firecamp/types';
import {
  SetCompletionProvider,
  SetHoverProvider,
} from '@firecamp/ui-kit/src/components/editors/monaco/lang/init';
import _cloneDeep from 'lodash/cloneDeep';
import { _object } from '@firecamp/utils';

import { IRequestTab } from '../../components/tabs/types/tab';
import { prepareEventNameForEnvToTab } from '../platform-emitter/events';
import { platformEmitter } from '../platform-emitter';
import { IEnvironmentStore, useEnvStore } from '../../store/environment';
import { useTabStore } from '../../store/tab';

export interface IPlatformEnvironmentService {
  // subscribe to environment changes
  subscribeChanges: (tabId: TId, getPlatformVariables) => void;

  // unsubscribe to environment changes
  unsubscribeChanges: (tabId: TId) => void;

  // get active workspace and collection envs
  getActiveEnvsByTabId: (tabId: TId) => Promise<{
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
    collection?: {
      id?: TId;
      environmentId: TId;
      variables: { [key: string]: any };
    }
  ) => void;
}
export interface IPlatformVariables {
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
    environment.setVariablesToProvider(platformVariables.collection);

    /**
     * 2.1  get platform active envs
     * 2.2  emit event: platform environment updates
     */
    const activeEnvsOfTan = await environment.getActiveEnvsByTabId(tabId);
    platformEmitter.emit(prepareEventNameForEnvToTab(tabId), activeEnvsOfTan);
  },

  getActiveEnvsByTabId: (tabId: TId) => {
    const envStore: IEnvironmentStore = useEnvStore.getState();
    let tab: IRequestTab = useTabStore.getState().list[tabId];
    if (!tab || !tabId) return Promise.reject('invalid tab id');

    let collectionActiveEnv = '';
    // get collectionId and collectionActiveEnv from tab's request's __meta
    if (tab.__meta.isSaved && tab.request?.__ref.collectionId) {
      collectionActiveEnv =
        envStore.colEnvMap[tab.request.__ref.collectionId];
    }

    return Promise.resolve({
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

    let collectionEnv: Partial<IEnvironment> = { name: '', variables: {} };
    if (collectionId && activeEnvsOfTab.collection) {
      collectionEnv = envStore.envs.find(
        (e) => e.__ref.id == activeEnvsOfTab.collection
      );
    }
    const colEnvVars = collectionEnv.variables || {};

    // Platform environment resultant payload
    return Promise.resolve({
      merged: colEnvVars,
      collection: colEnvVars,
    });
  },

  // set variables to editor provider
  setVariablesToProvider: (variables: { [key: string]: any }) => {
    SetCompletionProvider(EEditorLanguage.FcText, variables);
    SetHoverProvider(EEditorLanguage.FcText, variables);

    SetCompletionProvider(EEditorLanguage.HeaderKey, variables);
    SetHoverProvider(EEditorLanguage.HeaderKey, variables);

    SetCompletionProvider(EEditorLanguage.HeaderValue, variables);
    SetHoverProvider(EEditorLanguage.HeaderValue, variables);

    SetCompletionProvider(EEditorLanguage.Json, variables);
    SetHoverProvider(EEditorLanguage.Json, variables);
  },

  setActiveEnvironments: (requestEnvMeta: {
    activeEnvironments: {
      collection?: TId;
    };
    collectionId?: TId;
  }) => {
    const envStore: IEnvironmentStore = useEnvStore.getState();

    // console.log({ requestEnvMeta });

    if ('activeEnvironments' in requestEnvMeta) {
      if (requestEnvMeta.activeEnvironments) {
      
        // Change collection selected environment
        if (
          requestEnvMeta.collectionId &&
          requestEnvMeta.activeEnvironments['collection']
        ) {
          let collectionId = requestEnvMeta.collectionId;

          let currentCollectionSelectedEnv =
              envStore.colEnvMap[collectionId],
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
    collection?: {
      id?: TId;
      environmentId: TId;
      variables: { [key: string]: any };
    }
  ) => {
    const envStore: IEnvironmentStore = useEnvStore.getState();
    // set collection environment
    if (collection?.id && collection?.environmentId) {
      envStore.setEnvVariables(collection.environmentId, collection.variables);
    }
  },
};

export { environment };
