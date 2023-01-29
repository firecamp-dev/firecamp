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
  update: (id: TId, env: Partial<IEnv>) => Promise<IEnv>;
  delete: (id: TId) => Promise<IEnv>;

  mergeEnvs: (remoteEnv: IEnv, localEnv: IEnv) => any; //return rnv with initialvalue/currentValue
  splitEnvs: (runtimeEnv: any) => { remoteEnv: IEnv; localEnv: IEnv }; //return remoteEnv and localEnv from runtime env

  // set variables to monaco provider
  setVariablesToProvider: (variables: { [key: string]: any }) => void;
}

const environment: IPlatformEnvironmentService = {
  fetch: async (id: TId) => {
    return Rest.environment.fetch(id).then((res) => res.data);
  },

  update: (id: TId, env: Partial<IEnv>) => {
    return Rest.environment.update(id, env).then((res) => res.data);
  },

  delete: async (id: TId) => {
    return Rest.environment.delete(id).then((res) => res.data);
  },

  /** merge remote and local env to prepare runtime env with initialValue and currentValue */
  mergeEnvs: (remoteEnv: IEnv, localEnv: IEnv) => {
    console.log('I am in the merge');
    const { variables: rvs = [] } = remoteEnv;
    const { variables: lvs = [] } = localEnv;
    const vars = rvs.map((rv) => {
      return {
        id: rv.id,
        key: rv.key,
        initialValue: rv.value,
        value: lvs.find((lv) => lv.id == rv.id)?.value || '',
        type: 'text',
      };
    });
    return {
      ...remoteEnv,
      variables: vars,
    };
  },

  /** split runtime env into remoteEnv and localEnv */
  splitEnvs: (env) => {
    const { variables = [] } = env;
    let rvs = [];
    let lvs = [];
    variables.map((v) => {
      rvs.push({
        id: v.id,
        key: v.key,
        value: v.initialValue,
        type: 'text',
      });
      lvs.push({
        id: v.id,
        key: v.key,
        value: v.value,
        type: 'text',
      });
    });
    return {
      remoteEnv: { ...env, variables: [...rvs] },
      localEnv: { ...env, variables: [...lvs] },
    };
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

export { environment };
