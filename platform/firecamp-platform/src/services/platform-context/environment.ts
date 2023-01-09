import { EEditorLanguage, IEnvironment, TId } from '@firecamp/types';
import _cloneDeep from 'lodash/cloneDeep';
import {
  SetCompletionProvider,
  SetHoverProvider,
} from '@firecamp/ui-kit/src/components/editors/monaco/lang/init';
import { _object } from '@firecamp/utils';

import { IEnvironmentStore, useEnvStore } from '../../store/environment';
import { useTabStore } from '../../store/tab';

export interface IPlatformEnvironmentService {
  // get current env of the tab
  getCurrentTabEnv: () => {
    tabId: TId;
    collectionId?: TId;
    envId?: TId;
    env?: IEnvironment;
  };
  setTabCollection: (tabId: TId, collectionId: TId) => void;

  // set variables to monaco provider
  setVariablesToProvider: (variables: { [key: string]: any }) => void;

  setVariables: (collection?: {
    id?: TId;
    environmentId: TId;
    variables: { [key: string]: any };
  }) => void;
}
export interface IPlatformVariables {
  collection: {};
}

const environment: IPlatformEnvironmentService = {
  getCurrentTabEnv: () => {
    const { activeTab } = useTabStore.getState();
    const { envs, tabColMap, colEnvMap } = useEnvStore.getState();
    const collectionId = tabColMap[activeTab];
    if (!collectionId) return { tabId: activeTab };
    const envId = colEnvMap[collectionId];
    if (!envId) return { tabId: activeTab, collectionId };
    const env = envs.find(
      (e) => e.__ref.collectionId == collectionId && e.__ref.id == envId
    );
    return {
      tabId: activeTab,
      collectionId,
      envId,
      env,
    };
  },

  setTabCollection: (tabId: TId, collectionId: TId) => {
    const { getState, setState } = useEnvStore;
    setState((s) => {
      const env = s.envs.find(
        (e) => e.__ref.collectionId == collectionId && e.name == 'Development'
      );
      const envId = env?.__ref.id;
      console.log(tabId, collectionId, envId, 1111111);
      if (!envId) return s;
      // assign variables to monaco providers
      environment.setVariablesToProvider(env.variables);

      return {
        tabColMap: {
          ...s.tabColMap,
          [tabId]: collectionId,
        },
        colEnvMap: {
          ...s.colEnvMap,
          [collectionId]: envId,
        },
      };
    });
  },

  // set variables to editor provider
  setVariablesToProvider: (variables: { [key: string]: any }) => {
    //fc-text
    SetCompletionProvider(EEditorLanguage.FcText, variables);
    SetHoverProvider(EEditorLanguage.FcText, variables);

    // header key
    SetCompletionProvider(EEditorLanguage.HeaderKey, variables);
    SetHoverProvider(EEditorLanguage.HeaderKey, variables);

    //header value
    SetCompletionProvider(EEditorLanguage.HeaderValue, variables);
    SetHoverProvider(EEditorLanguage.HeaderValue, variables);

    // json
    SetCompletionProvider(EEditorLanguage.Json, variables);
    SetHoverProvider(EEditorLanguage.Json, variables);
  },

  setVariables: (collection?: {
    id: TId;
    environmentId: TId;
    variables: { [key: string]: any };
  }) => {
    const envStore: IEnvironmentStore = useEnvStore.getState();
    // set collection environment
    if (collection?.id && collection?.environmentId) {
      envStore.setEnvVariables(collection.environmentId, collection.variables);
    }
  },
};

export { environment };
