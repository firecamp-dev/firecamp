import { EEditorLanguage, IEnv, TId } from '@firecamp/types';
import _cloneDeep from 'lodash/cloneDeep';
import {
  SetCompletionProvider,
  SetHoverProvider,
} from '@firecamp/ui-kit/src/components/editors/monaco/lang/init';
import { _object } from '@firecamp/utils';
import { Rest } from '@firecamp/cloud-apis';
import { envService } from '../env.service';
import { IEnvironmentStore, useEnvStore } from '../../store/environment';

export interface IPlatformEnvironmentService {
  // fetch environment
  fetch: (id: TId) => Promise<IEnv>;
  update: (id: TId, env: Partial<IEnv>) => Promise<IEnv>;
  delete: (id: TId) => Promise<IEnv>;

  mergeEnvs: typeof envService.mergeEnvs; //return rnv with initialvalue/currentValue
  splitEnvs: typeof envService.splitEnvs; //return remoteEnv and localEnv from runtime env

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

  mergeEnvs: envService.mergeEnvs,

  /** split runtime env into remoteEnv and localEnv */
  splitEnvs: envService.splitEnvs,

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
