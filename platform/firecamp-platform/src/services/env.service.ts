import { EKeyValueTableRowType, IEnv, TId } from '@firecamp/types';
import _cloneDeep from 'lodash/cloneDeep';
import { _object } from '@firecamp/utils';

interface IRuntimeEnv extends IEnv {
  variables: {
    id: TId;
    key: 'string';
    initialValue: string;
    value: string;
    type: EKeyValueTableRowType;
  }[];
}
const EmptyEnv: IRuntimeEnv = { name: '', variables: [], __ref: { id: '' } };
const envService = {
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
        type: 'text',
      };
    });
    return {
      ...remoteEnv,
      variables: vars,
    };
  },

  /** split runtime env into remoteEnv and localEnv */
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
};

export { envService, EmptyEnv, IRuntimeEnv };
