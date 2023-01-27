import { EEditorLanguage, IEnv, TId } from '@firecamp/types';
import _cloneDeep from 'lodash/cloneDeep';
import {
  SetCompletionProvider,
  SetHoverProvider,
} from '@firecamp/ui-kit/src/components/editors/monaco/lang/init';
import { _object } from '@firecamp/utils';
import { IEnvironmentStore, useEnvStore } from '../../store/environment';
import { Rest } from '@firecamp/cloud-apis';

export interface IPlatformEnvironmentService {
  // fetch environment
  fetch: (id: TId) => Promise<IEnv>;

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
  fetch: async (id: TId) => {
    return await Rest.environment.fetch(id).then((res) => res.data);
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
