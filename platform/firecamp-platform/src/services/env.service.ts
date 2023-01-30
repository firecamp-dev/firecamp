import _cloneDeep from 'lodash/cloneDeep';
import jtParse from 'json-templates';
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

  /** merge remote and local env to prepare runtime env with initialValue and currentValue */
  mergeEnvs: (remoteEnv: IEnv, localEnv: IEnv): IRuntimeEnv => {
    console.log('I am in the merge');
    const { variables: rvs = [] } = remoteEnv;
    const { variables: lvs = [] } = localEnv;
    const vars = rvs.map((rv) => {
      return {
        id: rv.id,
        key: rv.key,
        initialValue: rv.value,
        value: lvs.find((lv) => lv.id == rv.id)?.value || '',
        type: EKeyValueTableRowType.Text,
      };
    });
    return {
      ...remoteEnv,
      variables: vars,
    };
  },

  /** split runtimeEnv into remoteEnv and localEnv */
  splitEnvs: (env: IRuntimeEnv): { remoteEnv: IEnv; localEnv: IEnv } => {
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

  /** preapre a runtime env from the remote env. fetch localEnv and then merge them with remoteEnv*/
  prepareRuntimeEnvFromRemoteEnv: (remoteEnv: IEnv): IRuntimeEnv => {
    let localEnv = JSON.parse(
      localStorage.getItem(`env/{${remoteEnv.__ref.id}}`) || null
    );
    if (!localEnv) localEnv = _cloneDeep(EmptyEnv);
    return envService.mergeEnvs(remoteEnv, localEnv);
  },

  /** prepare a pain vars object from runtimeEnv */
  preparePlainVarsFromRuntimeEnv: (
    runtimeEnv: IRuntimeEnv
  ): { [k: string]: string } => {
    if (!runtimeEnv?.variables?.length) return {};
    return runtimeEnv.variables.reduce((p, n) => {
      /** if currentValue(value) is exists then use it or else use initialValue*/
      if (n.key) {
        if (n.value) return { ...p, [n.key]: n.value };
        else return { ...p, [n.key]: n.initialValue };
      }
      return p;
    }, {});
  },

  /** apply variables in text or json object*/
  applyVariables: <T extends string | { [k: string]: any }>(
    variables: { [k: string]: any } = {},
    source: T
  ): T => {
    const template = jtParse(source || '');
    const res = template(variables);
    return res;
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
