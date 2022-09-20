import create from 'zustand';
import { IEnvironment, TId, EEnvironmentScope } from '@firecamp/types';
import { Rest } from '@firecamp/cloud-apis';

const initialState = {
  is_env_sidebar_open: false,
  active_tab_wrs_env: '',
  active_tab_collection_envs: {},
  colEnvTdpInstance: null,
  wrsEnvTdpInstance: null,
  envs: [],
};

type TCreateEnvPayload = {
  name: string;
  variables: { [k: string]: string };
  meta: { type: string; visibility?: number };
  _meta: { workspace_id: string; collection_id?: string };
};

export interface IEnvironmentStore {
  is_env_sidebar_open: boolean;

  active_tab_wrs_env: string | TId; // TODO: rename to active_tab_workspace_environment
  active_tab_collection_envs: { [key: string | TId]: string | TId }; // TODO: rename to active_tab_collection_environment
  is_progressing?: boolean;
  // environments: {
  //   [key: string | TId]: { [key: string | TId]: IEnvironment }; // TODO: remove key type string
  // };
  colEnvTdpInstance: any;
  wrsEnvTdpInstance: any;
  envs: IEnvironment[]; // TODO: choose either envs or environments later

  registerTDP: (wrsEnvTdpInstance: any, colEnvTdpInstance: any) => void;
  unRegisterTDP: () => void;

  initialize: (envs: IEnvironment[]) => void;
  toggleEnvSidebar: () => void;
  toggleProgressBar: (flag?: boolean) => void;

  getWorkspaceEnvs: () => any[];
  getCollectionEnvs: (collectionId: TId) => any[];
  getCollectionActiveEnv: (collectionId: TId) => string;

  setWorkspaceActiveEnv: (envId: TId) => void;
  setCollectionActiveEnv: (collectionId: TId, envId: TId) => void;
  setWorkspaceEnvVariable: (envId: TId, variables: object) => void;
  setCollectionEnvVariable: (
    collectionId: TId,
    envId: TId,
    variables: object
  ) => void;

  fetchEnvironment: (envId: string) => Promise<any>;
  createEnvironment: (payload: TCreateEnvPayload) => Promise<any>;
  updateEnvironment: (envId: string, body: any) => Promise<any>;
  deleteEnvironment: (envId: string) => Promise<any>;

  // common
  dispose: () => void;
}

export const useEnvStore = create<IEnvironmentStore>((set, get) => ({
  ...initialState,

  initialize: (envs: IEnvironment[] = []) => {
    let active_tab_wrs_env = '';
    let active_tab_collection_envs = {};
    const firstWrsEnv = envs.filter(
      (e) => e.meta.type == EEnvironmentScope.Workspace
    )[0];
    if (firstWrsEnv) active_tab_wrs_env = firstWrsEnv._meta.id;

    let cEnvs = envs
      .filter((e) => ['C', 'P'].includes(e.meta.type))
      .reduce((p, e) => {
        if (!p[e._meta.collection_id]) p[e._meta.collection_id] = [];

        //@ts-ignore
        return {
          ...p,
          [e._meta.collection_id]: [...p[e._meta.collection_id], e],
        };
      }, {} as any);
    let _cEnvs = Object.keys(cEnvs).reduce(
      (collEnvs, key) => ({
        ...collEnvs,
        [key]: cEnvs[key].reduce((c, e) => ({ ...c, [e._meta.id]: e }), {}),
      }),
      {}
    );

    // set active environment for workspace and collection
    // let active_tab_wrs_env = Object.keys(wEnvs)[0] || '';
    for (let key in _cEnvs) {
      active_tab_collection_envs[key] = Object.keys(_cEnvs[key])[0] || '';
    }

    // console.log({ active_tab_wrs_env, active_tab_collection_envs });
    // console.log({ _wEnvs, _cEnvs });

    set((s) => ({
      envs: envs,
      active_tab_wrs_env,
      active_tab_collection_envs,
    }));
  },

  registerTDP: (wrsEnvTdpInstance, colEnvTdpInstance) => {
    const { envs } = get();
    colEnvTdpInstance?.init(envs);
    wrsEnvTdpInstance?.init(envs);
    set((s) => ({ wrsEnvTdpInstance, colEnvTdpInstance }));
  },

  // unregister TreeDatProvider instance
  unRegisterTDP: () => {
    set((s) => ({ colEnvTdpInstance: null, wrsEnvTdpInstance: null }));
  },

  toggleEnvSidebar: () => {
    set((s) => ({ is_env_sidebar_open: !s.is_env_sidebar_open }));
  },

  toggleProgressBar: (flag: boolean) => {
    set((s) => ({ is_progressing: flag }));
  },

  setWorkspaceActiveEnv: (envId: TId) => {
    set(() => ({ active_tab_wrs_env: envId }));
  },

  setWorkspaceEnvVariable: (envId: TId, variables: object) => {
    set((s) => {
      const envs = s.envs.map((e) => {
        if (e._meta.id == envId) {
          return { ...e, variables };
        }
        return e;
      });
      return { envs };
    });
    return;

    // set((s: IEnvironmentStore) => ({
    //   environments: {
    //     ...s.environments,
    //     workspace: {
    //       ...s.environments.workspace,
    //       [envId]: {
    //         ...s.environments.workspace[envId],
    //         variables,
    //       },
    //     },
    //   },
    // }));

    // console.log({ 222: get().environments.workspace[envId] });
  },

  getWorkspaceEnvs: () => {
    return get().envs.filter((e) => e.meta.type == EEnvironmentScope.Workspace);
    // return Object.values(get().environments?.[`workspace`] || {});
  },

  setCollectionActiveEnv: (collectionId: TId, envId: TId) => {
    set((s) => ({
      active_tab_collection_envs: {
        ...s.active_tab_collection_envs,
        [collectionId]: envId,
      },
    }));
  },

  getCollectionActiveEnv: (collectionId: TId) => {
    return get().active_tab_collection_envs?.[collectionId];
  },

  getCollectionEnvs: (collectionId: TId) => {
    // console.log({ 1: get().envs, collectionId });

    return get().envs.filter((e) => e._meta.collection_id == collectionId);
    // return Object.values(get().environments?.[collectionId] || {});
  },

  setCollectionEnvVariable: (
    collectionId: TId,
    envId: TId,
    variables: object
  ) => {
    set((s) => {
      const envs = s.envs.map((e) => {
        if (e._meta.id == envId) {
          return { ...e, variables };
        }
        return e;
      });
      return { envs };
    });

    // set((s) => ({
    //   environments: {
    //     ...s.environments,
    //     [collectionId]: {
    //       ...s.environments?.[collectionId],
    //       [envId]: {
    //         ...s.environments?.[collectionId][envId],
    //         variables,
    //       },
    //     },
    //   },
    // }));
  },

  // Environment
  fetchEnvironment: async (envId: string) => {
    const state = get();
    state.toggleProgressBar(true);
    const res = await Rest.environment
      .fetch(envId)
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

  createEnvironment: async (_collection: TCreateEnvPayload) => {
    const state = get();
    state.toggleProgressBar(true);
    const res = await Rest.environment
      .create(_collection)
      .then((r) => {
        set((s) => {
          r.data.meta.type == EEnvironmentScope.Collection
            ? s.colEnvTdpInstance?.addEnvItem(r.data)
            : s.wrsEnvTdpInstance?.addEnvItem(r.data);
          return { envs: [...s.envs, r.data] };
        });
        return r;
      })
      .finally(() => {
        state.toggleProgressBar(false);
      });
    return res;
  },

  updateEnvironment: async (envId: string, body: any) => {
    const state = get();
    state.toggleProgressBar(true);
    const res = await Rest.environment
      .update(envId, body)
      .then((r: any) => {
        const env = r.data;
        set((s) => {
          const envs = s.envs.map((e) => {
            if (e._meta.id == env._meta.id) return env;
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
      .delete(envId)
      .then((r) => {
        set((s) => {
          const env = s.envs.find((e) => e._meta.id == envId);
          if (env) {
            env.meta.type == EEnvironmentScope.Collection
              ? s.colEnvTdpInstance?.removeEnvItem(envId)
              : s.wrsEnvTdpInstance?.removeEnvItem(envId);
          }
          const envs = s.envs.filter((e) => e._meta.id != envId);
          return { envs };
        });
        return r;
      })
      .finally(() => {
        get().toggleProgressBar(false);
      });
  },

  // dispose whole store and reset to initial state
  dispose: () => set({ ...initialState }),
}));
