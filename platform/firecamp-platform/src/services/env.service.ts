import _cloneDeep from 'lodash/cloneDeep';
import { _object } from '@firecamp/utils';
import { Rest } from '@firecamp/cloud-apis';
import {
  SetCompletionProvider,
  SetHoverProvider,
} from '@firecamp/ui-kit/src/components/editors/monaco/lang/init';
import {
  EEditorLanguage,
  EKeyValueTableRowType,
  IEnv,
  TId,
} from '@firecamp/types';

interface IRuntimeEnv extends IEnv {
  variables: {
    id: TId;
    key: string;
    initialValue: string;
    value: string;
    type: EKeyValueTableRowType;
  }[];
}
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
};

export { envService, EmptyEnv, IRuntimeEnv };
