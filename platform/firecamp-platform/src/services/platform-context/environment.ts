import { IEnv, IVariableGroup, TId, TPlainObject } from '@firecamp/types';
import _cloneDeep from 'lodash/cloneDeep';
import { _object, _env } from '@firecamp/utils';
import { Rest } from '@firecamp/cloud-apis';
import { envService } from '../env.service';
import { useEnvStore } from '../../store/environment';

export interface IPlatformEnvironmentService {
  // fetch environment
  fetch: typeof envService.fetch;
  update: (id: TId, env: Partial<IEnv>) => Promise<IEnv>;
  delete: (id: TId) => Promise<IEnv>;

  mergeEnvs: typeof _env.mergeEnvs; //return rnv with initialValue/currentValue
  splitEnvs: typeof _env.splitEnvs; //return remoteEnv and localEnv from runtime env
  getVariableGroup: () => IVariableGroup;
  getPlainVariables: () => TPlainObject;
}

const environment: IPlatformEnvironmentService = {
  fetch: envService.fetch,

  update: (id: TId, env: Partial<IEnv>) => {
    return useEnvStore.getState()._updateEnvironment(id, env);
  },

  delete: async (id: TId) => {
    return Rest.environment.delete(id).then((res) => res.data);
  },

  mergeEnvs: _env.mergeEnvs,

  /** split runtime env into remoteEnv and localEnv */
  splitEnvs: _env.splitEnvs,

  getVariableGroup: () => {
    const { globalEnv, activeEnv } = useEnvStore.getState();
    const varGroup: IVariableGroup = {
      globals: globalEnv.variables,
      environment: activeEnv.variables,
      collectionVariables: [],
      __meta: {
        collectionName: '',
        environmentName: activeEnv.name,
      },
    };
    return varGroup;
  },

  getPlainVariables: () => {
    return useEnvStore.getState().preparePlainVariables();
  },
};

export { environment };
