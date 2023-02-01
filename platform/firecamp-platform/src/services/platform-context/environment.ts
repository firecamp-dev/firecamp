import { IEnv, TId } from '@firecamp/types';
import _cloneDeep from 'lodash/cloneDeep';
import { _object } from '@firecamp/utils';
import { Rest } from '@firecamp/cloud-apis';
import { envService } from '../env.service';
import { useEnvStore } from '../../store/environment';

export interface IPlatformEnvironmentService {
  // fetch environment
  fetch: typeof envService.fetch;
  update: (id: TId, env: Partial<IEnv>) => Promise<IEnv>;
  delete: (id: TId) => Promise<IEnv>;

  mergeEnvs: typeof envService.mergeEnvs; //return rnv with initialvalue/currentValue
  splitEnvs: typeof envService.splitEnvs; //return remoteEnv and localEnv from runtime env
}

const environment: IPlatformEnvironmentService = {
  fetch: envService.fetch,

  update: (id: TId, env: Partial<IEnv>) => {
    return useEnvStore.getState()._updateEnvironment(id, env);
  },

  delete: async (id: TId) => {
    return Rest.environment.delete(id).then((res) => res.data);
  },

  mergeEnvs: envService.mergeEnvs,

  /** split runtime env into remoteEnv and localEnv */
  splitEnvs: envService.splitEnvs,
};

export { environment };
