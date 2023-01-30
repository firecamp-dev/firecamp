import create from 'zustand';
import { nanoid } from 'nanoid';
import _cloneDeep from 'lodash/cloneDeep';
import { Rest } from '@firecamp/cloud-apis';
import { TId, IEnv, IEnvironment } from '@firecamp/types';
import { EnvironmentDataProvider } from '../components/common/environment/sidebar/tree_/dataProvider';
import { CollectionEnvDataProvider } from '../components/common/environment/sidebar/tree/dataProvider';
import platformContext from '../services/platform-context';
import { useWorkspaceStore } from './workspace';
import { RE } from '../types';
import { envService, EmptyEnv, IRuntimeEnv } from '../services/env.service';

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

  init: (envs: IEnv[]) => void;
  /** @deprecated */
  initialize: (envs: IEnvironment[]) => void;
  toggleEnvSidebar: () => void;
  toggleProgressBar: (flag?: boolean) => void;

  setActiveEnv: (envId?: TId) => void;
  /** prepare pain variables object, whchi can be used to apply in monaco editors and other usage like script */
  preparePlainVariables: () => any;

  /** @deprecated */
  fetchColEnvironment: (envId: TId) => Promise<any>;
  createEnvironmentPrompt: () => void;
  createEnvironment: (env: IEnv) => Promise<any>;
  updateEnvironment: (envId: string, body: any) => Promise<any>;
  deleteEnvironment: (envId: TId) => Promise<any>;

  _addEnv: (env: IEnv) => void;
  _updateEnv: (env: IEnv) => void;
  _deleteEnv: (envId: TId) => void;

  // common
  dispose: () => void;
}

export const useEnvStore = create<IEnvironmentStore>((set, get) => ({
  ...initialState,

  init: (envs: IEnv[] = []) => {
    set({ environments: envs });
    const { envTdpInstance } = get();
    envTdpInstance?.init(envs);
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
    } = useWorkspaceStore.getState();
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
    const { environments, preparePlainVariables } = get();
    if (!envId) {
      set({ activeEnvId: null, activeEnv: _cloneDeep(EmptyEnv) });
    } else {
      const env = environments.find((e) => e.__ref.id == envId);
      if (env) {
        const _env = envService.prepareRuntimeEnvFromRemoteEnv(env);
        // console.log(_env, env, '_env');
        set({ activeEnvId: envId, activeEnv: _env });
      } else {
        set({ activeEnvId: null, activeEnv: _cloneDeep(EmptyEnv) });
      }
    }

    setTimeout(() => {
      const vars = preparePlainVariables();
      console.log('platform vars', vars);
    });
  },

  preparePlainVariables: () => {
    const { globalEnv, activeEnv } = get();
    const gPlainVars = envService.preparePlainVarsFromRuntimeEnv(globalEnv);
    const ePlainVars = envService.preparePlainVarsFromRuntimeEnv(activeEnv);
    // console.log(globalEnv, activeEnv, gPlainVars, ePlainVars);
    return { ...gPlainVars, ...ePlainVars };
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

  createEnvironmentPrompt: () => {
    if (!platformContext.app.user.isLoggedIn()) {
      return platformContext.app.modals.openSignIn();
    }
    const { createEnvironment } = get();
    platformContext.window
      .promptInput({
        header: 'Create New Environment',
        lable: 'Environment Name',
        placeholder: 'type environment name',
        texts: { btnOking: 'Creating...' },
        value: '',
        validator: (val) => {
          if (!val || val.length < 3) {
            return {
              isValid: false,
              message: 'The environment name must have minimum 3 characters.',
            };
          }
          const isValid = RE.NoSpecialCharacters.test(val);
          return {
            isValid,
            message:
              !isValid &&
              'The environment name must not contain any special characters.',
          };
        },
        executor: (name) => {
          const { workspace } = useWorkspaceStore.getState();
          return createEnvironment({
            name,
            description: '',
            variables: [],
            __ref: { id: nanoid(), workspaceId: workspace.__ref.id },
          });
        },
        onError: (e) => {
          platformContext.app.notify.alert(
            e?.response?.data?.message || e.message
          );
        },
      })
      .then((res) => {
        console.log(res, 1111);
      });
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

  _addEnv: (env) => {
    set((s) => {
      s.envTdpInstance?.addEnvItem(env);
      return { environments: [...s.environments, env] };
    });
  },
  _updateEnv: (env) => {
    const { environments } = get();
    const envs = environments.map((e) => {
      if (e.__ref.id == env.__ref.id) {
        return { ...e, ...env };
      }
      return e;
    });
    set((s) => {
      s.envTdpInstance?.updateEnvItem(env);
      return { environments: [...envs] };
    });
  },
  _deleteEnv: (envId) => {
    const { environments } = get();
    const envs = environments.filter((e) => {
      return e.__ref.id != envId;
    });
    set((s) => {
      // s.envTdpInstance?.removeEnvItem(env);
      return { environments: [...envs] };
    });
  },

  // dispose whole store and reset to initial state
  dispose: () => set({ ...initialState }),
}));
