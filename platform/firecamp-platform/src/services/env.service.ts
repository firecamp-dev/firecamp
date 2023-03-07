import _cloneDeep from 'lodash/cloneDeep';
import { _object } from '@firecamp/utils';
import { Rest } from '@firecamp/cloud-apis';
import { EditorApi } from '@firecamp/ui-kit';
import { EEditorLanguage, IEnv, IRuntimeEnv, TId } from '@firecamp/types';

const EmptyEnv: IRuntimeEnv = { name: '', variables: [], __ref: { id: '' } };
const envService = {
  fetch: async (id: TId) => {
    return Rest.environment.fetch(id).then((res) => res.data);
  },

  update: (id: TId, env: Partial<IEnv>) => {
    return Rest.environment.update(id, env).then((res) => res.data);
  },

  // set variables to editor provider
  setVariablesToProvider: (variables: { [key: string]: any }) => {
    //fc-text
    EditorApi.SetCompletionProvider(EEditorLanguage.FcText, variables);
    EditorApi.SetHoverProvider(EEditorLanguage.FcText, variables);

    // header key
    EditorApi.SetCompletionProvider(EEditorLanguage.HeaderKey, variables);
    EditorApi.SetHoverProvider(EEditorLanguage.HeaderKey, variables);

    //header value
    EditorApi.SetCompletionProvider(EEditorLanguage.HeaderValue, variables);
    EditorApi.SetHoverProvider(EEditorLanguage.HeaderValue, variables);

    // json
    EditorApi.SetCompletionProvider(EEditorLanguage.Json, variables);
    EditorApi.SetHoverProvider(EEditorLanguage.Json, variables);
  },
};

export { envService, EmptyEnv, IRuntimeEnv };
