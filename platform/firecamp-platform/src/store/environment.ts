import create from 'zustand';
import _cloneDeep from 'lodash/cloneDeep';
import { Rest } from '@firecamp/cloud-apis';
import {
  TId,
  IEnv,
  IEnvironment,
  TPlainObject,
  IRuntimeEnv,
  IVariableGroup,
} from '@firecamp/types';
import { _env } from '@firecamp/utils';
import { EnvironmentDataProvider } from '../components/common/environment/sidebar/tree_/dataProvider';
import { CollectionEnvDataProvider } from '../components/common/environment/sidebar/tree/dataProvider';
import platformContext from '../services/platform-context';
import { useExplorerStore } from './explorer';
import { envService, EmptyEnv } from '../services/env.service';

const initialState = {
  activeEnvId: null,
  globalEnv: _cloneDeep({ ...EmptyEnv, name: 'Global' }),
  activeEnv: _cloneDeep(EmptyEnv),
  isEnvSidebarOpen: false,
  colEnvTdpInstance: null,
  envs: [],
  environments: [
    // {
    //   name: 'Development',
    //   variables: [
    //     {
    //       id: '1',
    //       key: 'name',
    //       value: 'ramanujan',
    //     },
    //   ],
    //   __ref: {
    //     id: '123',
    //     createdBy: '1',
    //   },
    // }
  ],
  envTdpInstance: null,
};

export interface IEnvironmentStore {
  activeEnvId: TId;
  globalEnv: IRuntimeEnv;
  activeEnv: IRuntimeEnv;
  isEnvSidebarOpen: boolean;
  isProgressing?: boolean;
  colEnvTdpInstance: any;
  /** @deprecated */
  envs: IEnvironment[];
  environments: IEnv[];
  envTdpInstance: any;

  registerTDP_: () => void;
  unRegisterTDP_: () => void;

  /** @deprecated */
  registerTDP: () => void;
  /** @deprecated */
  unRegisterTDP: () => void;

  init: (envs: IEnv[], globalEnv: IEnv) => void;
  /** @deprecated */
  initialize: (envs: IEnvironment[]) => void;
  toggleEnvSidebar: () => void;
  toggleProgressBar: (flag?: boolean) => void;

  setActiveEnv: (envId?: TId) => void;
  /** prepare pain variables object, which can be used to apply in monaco editors and other usage like script */
  preparePlainVariables: () => TPlainObject;

  /** apply current active env's variables in whole platform */
  applyVariablesToPlatform: () => void;

  /** @deprecated */
  fetchColEnvironment: (envId: TId) => Promise<any>;
  createEnvironment: (env: IEnv) => Promise<any>;
  updateEnvironment: (envId: string, body: any) => Promise<any>;
  deleteEnvironment: (envId: TId) => Promise<any>;
  cloneEnvironment: (envId: string, envNewName: string) => Promise<any>;
  deleteEnvironmentPrompt: (env: IEnv | IRuntimeEnv) => Promise<any>;

  _updateEnvironment: (envId: TId, env: Partial<IEnv>) => Promise<IEnv>;

  _addEnv: (env: IEnv) => void;
  _updateEnvCb: (env: IEnv) => void;
  _deleteEnv: (envId: TId) => void;

  // common

  /** set env in localStorage */
  setLocalEnv: (localEnv: IEnv) => void;
  setVarsInLocalFromExecutorResponse: (
    resVars: IVariableGroup,
    collectionId: TId
  ) => void;
  dispose: () => void;
}

export const useEnvStore = create<IEnvironmentStore>((set, get) => ({
  ...initialState,

  init: (envs: IEnv[] = [], _globalEnv: IEnv) => {
    const globalEnv = _env.prepareRuntimeEnvFromRemoteEnv(_globalEnv);
    set({ environments: envs, globalEnv });
    const { envTdpInstance, setActiveEnv } = get();
    envTdpInstance?.init(envs);

    let activeEnv = null;
    if (window?.localStorage) {
      activeEnv = localStorage.getItem('activeEnv');
    }
    setActiveEnv(activeEnv);
  },

  /** @deprecated */
  initialize: (envs: IEnvironment[] = []) => {
    set({ envs });
  },

  registerTDP_: () => {
    const { environments } = get();
    const envTdpInstance = new EnvironmentDataProvider(environments);
    set((s) => ({ envTdpInstance }));
  },

  // unregister TreeDatProvider instance
  unRegisterTDP_: () => {
    set({ envTdpInstance: null });
  },

  registerTDP: () => {
    const { envs } = get();
    const {
      explorer: { collections },
    } = useExplorerStore.getState();
    const colEnvTdpInstance = new CollectionEnvDataProvider(collections);
    colEnvTdpInstance.init(envs);
    set((s) => ({ colEnvTdpInstance }));
  },

  // unregister TreeDatProvider instance
  unRegisterTDP: () => {
    set({ colEnvTdpInstance: null });
  },

  toggleEnvSidebar: () => {
    set((s) => ({ isEnvSidebarOpen: !s.isEnvSidebarOpen }));
  },

  toggleProgressBar: (flag: boolean) => {
    set({ isProgressing: flag });
  },

  setActiveEnv: (envId) => {
    const { applyVariablesToPlatform } = get();
    const setNoEnvironment = () => {
      set({
        activeEnvId: null,
        activeEnv: _cloneDeep(EmptyEnv),
      });
    };
    if (window?.localStorage) {
      localStorage.setItem('activeEnv', envId || ''); //if null then it'll save string 'null' thus put empty ''
    }

    Promise.resolve(envId)
      .then((eId) => {
        if (!eId) setNoEnvironment();
        return eId;
      })
      .then((eId) => {
        if (!eId) return null;
        // const env = environments.find((e) => e.__ref.id == envId);
        return envService.fetch(envId);
      })
      .then((env) => {
        if (!env) setNoEnvironment();
        else {
          const rEnv = _env.prepareRuntimeEnvFromRemoteEnv(env);
          // console.log(_env, env, '_env');
          set({ activeEnvId: envId, activeEnv: rEnv });
        }
        return env;
      })
      .catch((e) => {
        console.log(e);
        setNoEnvironment();
      })
      .finally(() => {
        applyVariablesToPlatform();
      });
  },

  preparePlainVariables: () => {
    const { globalEnv, activeEnv } = get();
    const gPlainVars = _env.preparePlainVarsFromRuntimeEnv(globalEnv);
    const ePlainVars = _env.preparePlainVarsFromRuntimeEnv(activeEnv);
    // console.log(globalEnv, activeEnv, gPlainVars, ePlainVars);
    _env.splitEnvs(globalEnv);
    return { ...gPlainVars, ...ePlainVars };
  },

  applyVariablesToPlatform: () => {
    const state = get();
    const vars = state.preparePlainVariables();
    console.log('platform vars', vars);
    envService.setVariablesToProvider(vars);
  },

  // Environment
  /** @deprecated */
  fetchColEnvironment: async (envId: string) => {
    const state = get();
    state.toggleProgressBar(true);
    const res = await Rest.environment
      ._fetch(envId)
      .then((r: any) => {
        const env = r.data;
        //TODO: set this newly fetched env in store later if feel need
        return env;
      })
      .finally(() => {
        state.toggleProgressBar(false);
      });
    return res;
  },

  createEnvironment: async (env: IEnv) => {
    const state = get();
    state.toggleProgressBar(true);
    const res = await Rest.environment
      .create(env)
      .then((r) => {
        state._addEnv(r.data);
        return env;
      })
      .finally(() => {
        state.toggleProgressBar(false);
      });
    return res;
  },

  updateEnvironment: async (envId: TId, body: Partial<IEnvironment>) => {
    const state = get();
    state.toggleProgressBar(true);
    const res = await Rest.environment
      ._update(envId, body)
      .then((r: any) => {
        const env = r.data;
        set((s) => {
          const envs = s.envs.map((e) => {
            if (e.__ref.id == env.__ref.id) return env;
            return e;
          });
          return { envs };
        });
        return r;
      })
      .finally(() => {
        state.toggleProgressBar(false);
      });
    return res;
  },

  deleteEnvironment: (envId: string) => {
    const state = get();
    state.toggleProgressBar(true);
    return Rest.environment
      ._delete(envId)
      .then((r) => {
        set((s) => {
          const env = s.envs.find((e) => e.__ref.id == envId);
          if (env) {
            s.colEnvTdpInstance?.removeEnvItem(envId);
          }
          const envs = s.envs.filter((e) => e.__ref.id != envId);
          return { envs };
        });
        return r;
      })
      .finally(() => {
        get().toggleProgressBar(false);
      });
  },

  cloneEnvironment: (envId: string, envNewName: string) => {
    const state = get();
    state.toggleProgressBar(true);
    return Rest.environment
      .cloneFromBeta(envId, envNewName)
      .then((r) => {
        state._addEnv(r.data);
        return r.data;
      })
      .finally(() => {
        get().toggleProgressBar(false);
      });
  },

  deleteEnvironmentPrompt: (env: IEnv | IRuntimeEnv) => {
    const state = get();
    return platformContext.window
      .promptInput({
        title: 'Delete Environment',
        label: `Please enter the name \`${env.name}\``,
        placeholder: '',
        texts: { btnOk: 'Delete', btnOking: 'Deleting...' },
        value: '',
        executor: (name) => {
          if (name === env.name) {
            return platformContext.environment.delete(env.__ref.id);
          } else {
            return Promise.reject(
              new Error('The environment name is not matching.')
            );
          }
        },
        onError: (e) => {
          platformContext.app.notify.alert(
            e?.response?.data?.message || e.message
          );
        },
      })
      .then((res) => {
        platformContext.app.notify.success(
          'The environment has been deleted successfully'
        );
        if (window?.localStorage) {
          window.localStorage.removeItem(`env/${env.__ref.id}`);
        }

        // if deleted env is active env then set "no environment"
        if (state.activeEnv?.__ref.id == env.__ref.id) {
          state.setActiveEnv(null);
        }
        state._deleteEnv(env.__ref.id);
        return res;
      });
  },

  _updateEnvironment: async (envId: TId, body: Partial<IEnv>) => {
    const state = get();
    state.toggleProgressBar(true);
    const res = await envService
      .update(envId, body)
      .then((env: any) => {
        state._updateEnvCb(env);
        return env;
      })
      .finally(() => {
        state.toggleProgressBar(false);
      });
    return res;
  },

  _addEnv: (env) => {
    set((s) => {
      s.envTdpInstance?.addEnvItem(env);
      return { environments: [...s.environments, env] };
    });
  },
  _updateEnvCb: (env) => {
    const { globalEnv, environments, activeEnv } = get();
    if (globalEnv.__ref.id == env.__ref.id && env.__meta.isGlobal === true) {
      const gEnv = _env.prepareRuntimeEnvFromRemoteEnv(env);
      set((s) => ({
        globalEnv: gEnv,
      }));
    } else {
      const envs = environments.map((e) => {
        if (e.__ref.id == env.__ref.id) {
          return { ...e, ...env };
        }
        return e;
      });
      set((s) => {
        s.envTdpInstance?.updateEnvItem(env);
        const aEnv =
          activeEnv?.__ref.id == env.__ref.id
            ? _env.prepareRuntimeEnvFromRemoteEnv(env)
            : s.activeEnv;
        return {
          environments: [...envs],
          activeEnv: aEnv,
        };
      });
    }
    // if the updated env is the active one then re apply. their vars to platform
    new Promise((rs) => setTimeout(rs, 100)).then(() => {
      if (activeEnv?.__ref.id == env.__ref.id || env.__meta.isGlobal === true) {
        get().applyVariablesToPlatform();
        console.log('updated the env vars');
      }
    });
  },
  _deleteEnv: (envId) => {
    const { environments } = get();
    const envs = environments.filter((e) => {
      return e.__ref.id != envId;
    });
    set((s) => {
      s.envTdpInstance?.removeEnvItem(envId);
      return { environments: [...envs] };
    });
  },

  setLocalEnv: (localEnv) => {
    if (!localEnv?.__ref?.id) return;
    if (window?.localStorage) {
      window.localStorage.setItem(
        `env/${localEnv.__ref.id}`,
        JSON.stringify(localEnv)
      );
    }
  },
  setVarsInLocalFromExecutorResponse: (variables, collectionId) => {
    const { setLocalEnv, applyVariablesToPlatform, activeEnv, globalEnv } =
      get();
    const { globals, environment, collectionVariables } = variables;
    if (globals?.length) {
      const { localEnv } = _env.splitEnvs({
        ...globalEnv,
        //@ts-ignore
        variables: globals,
      });
      setLocalEnv(localEnv);
    }
    if (environment?.length) {
      const { localEnv } = _env.splitEnvs({
        name: activeEnv?.name,
        //@ts-ignore
        variables: environment,
        __ref: activeEnv?.__ref,
      });
      setLocalEnv(localEnv);
    }
    if (collectionVariables?.length && collectionId) {
      const { localEnv } = _env.splitEnvs({
        name: '',
        //@ts-ignore
        variables: collectionVariables,
        __ref: { id: collectionId },
      });
      setLocalEnv(localEnv);
    }

    setTimeout(() => {
      applyVariablesToPlatform();
    });
  },
  // dispose whole store and reset to initial state
  dispose: () => set({ ...initialState }),
}));
