import create from 'zustand';
import { IEnvironment, TId, EEnvironmentScope } from '@firecamp/types';
import { Rest } from '@firecamp/cloud-apis';

const initialState = {
  isEnvSidebarOpen: false,
  activeTabWrsEnv: '',
  activeTabCollectionEnvs: {},
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
  isEnvSidebarOpen: boolean;

  activeTabWrsEnv: string | TId;
  activeTabCollectionEnvs: { [key: TId]: TId };
  is_progressing?: boolean;
  colEnvTdpInstance: any;
  wrsEnvTdpInstance: any;
  envs: IEnvironment[];

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
  setEnvVariables: (envId: TId, variables: object) => void;

  fetchEnvironment: (envId: string) => Promise<any>;
  createEnvironment: (payload: TCreateEnvPayload) => Promise<any>;
  updateEnvironment: (envId: string, body: any) => Promise<any>;
  deleteEnvironment: (envId: TId) => Promise<any>;

  // common
  dispose: () => void;
}

export const useEnvStore = create<IEnvironmentStore>((set, get) => ({
  ...initialState,

  initialize: (envs: IEnvironment[] = []) => {
    let activeTabWrsEnv = '';
    let activeTabCollectionEnvs = {};
    const firstWrsEnv = envs.filter(
      (e) => e.meta.type == EEnvironmentScope.Workspace
    )[0];
    if (firstWrsEnv) activeTabWrsEnv = firstWrsEnv._meta.id;

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
    // let activeTabWrsEnv = Object.keys(wEnvs)[0] || '';
    for (let key in _cEnvs) {
      activeTabCollectionEnvs[key] = Object.keys(_cEnvs[key])[0] || '';
    }

    // console.log({ activeTabWrsEnv, activeTabCollectionEnvs });
    // console.log({ _wEnvs, _cEnvs });

    set((s) => ({
      envs: envs,
      activeTabWrsEnv,
      activeTabCollectionEnvs,
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
    set((s) => ({ isEnvSidebarOpen: !s.isEnvSidebarOpen }));
  },

  toggleProgressBar: (flag: boolean) => {
    set((s) => ({ is_progressing: flag }));
  },

  setWorkspaceActiveEnv: (envId: TId) => {
    set(() => ({ activeTabWrsEnv: envId }));
  },

  setEnvVariables: (envId: TId, variables: object) => {
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
  },

  getWorkspaceEnvs: () => {
    return get().envs.filter((e) => e.meta.type == EEnvironmentScope.Workspace);
  },

  setCollectionActiveEnv: (collectionId: TId, envId: TId) => {
    set((s) => ({
      activeTabCollectionEnvs: {
        ...s.activeTabCollectionEnvs,
        [collectionId]: envId,
      },
    }));
  },

  getCollectionActiveEnv: (collectionId: TId) => {
    return get().activeTabCollectionEnvs[collectionId];
  },

  getCollectionEnvs: (collectionId: TId) => {
    // console.log({ 1: get().envs, collectionId });
    return get().envs.filter((e) => e._meta.collection_id == collectionId);
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

  updateEnvironment: async (envId: TId, body: Partial<IEnvironment>) => {
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
