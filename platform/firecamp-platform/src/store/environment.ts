import create from 'zustand';
import { Rest } from '@firecamp/cloud-apis';
import {
  TId,
  IEnvironment,
  EEnvironmentScope,
  IKeyValueTable,
} from '@firecamp/types';
import { useTabStore } from './tab';
import { EnvironmentDataProvider } from '../components/common/environment/sidebar/tree_/dataProvider';
import { CollectionEnvDataProvider } from '../components/common/environment/sidebar/tree/dataProvider';
import { useWorkspaceStore } from './workspace';

type TTabId = TId;
type TColId = TId;
type TEnvId = TId;

interface IEnvironment_ {
  name: string;
  variables: IKeyValueTable[];
  __ref: { id: TEnvId; createdBy: string };
}

const initialState = {
  tabColMap: {},
  colEnvMap: {},
  isEnvSidebarOpen: false,
  colEnvTdpInstance: null,
  envs: [],
  environments: [
    {
      name: 'Development',
      variables: [
        {
          id: '1',
          key: 'name',
          value: 'ramanujan',
        },
      ],
      __ref: {
        id: '123',
        createdBy: '1',
      },
    },
    {
      name: 'Staging',
      variables: [
        {
          id: '1',
          key: 'name',
          value: 'shrinivasan',
        },
      ],
      __ref: {
        id: '456',
        createdBy: '1',
      },
    },
  ],
  envTdpInstance: null,
};

type TCreateEnvPayload = {
  name: string;
  variables: { [k: string]: string };
  __meta: { type: string; visibility?: number };
  __ref: { workspaceId: string; collectionId?: string };
};

export interface IEnvironmentStore {
  isEnvSidebarOpen: boolean;
  tabColMap: { [tabId: TTabId]: TColId };
  colEnvMap: { [colId: TColId]: TEnvId };
  isProgressing?: boolean;
  colEnvTdpInstance: any;
  envs: IEnvironment[];
  environments: IEnvironment_[];
  envTdpInstance: any;

  registerTDP_: () => void;
  unRegisterTDP_: () => void;

  registerTDP: () => void;
  unRegisterTDP: () => void;

  initialize: (envs: IEnvironment[]) => void;
  toggleEnvSidebar: () => void;
  toggleProgressBar: (flag?: boolean) => void;

  getCollectionEnvs: (collectionId: TColId) => any[];
  getCollectionActiveEnv: (collectionId: TColId) => TEnvId;
  getActiveTabEnv: () => IEnvironment | null;

  setCurrentTabActiveEnv: (envId?: TEnvId) => void;
  setEnvVariables: (envId: TEnvId, variables: object) => void;

  fetchEnvironment: (envId: TEnvId) => Promise<any>;
  createEnvironment: (payload: TCreateEnvPayload) => Promise<any>;
  updateEnvironment: (envId: string, body: any) => Promise<any>;
  deleteEnvironment: (envId: TId) => Promise<any>;

  // common
  dispose: () => void;
}

export const useEnvStore = create<IEnvironmentStore>((set, get) => ({
  ...initialState,
  initialize: (envs: IEnvironment[] = []) => {
    const cEnvs = envs.filter(
      (e) => ['C', 'P'].includes(e.__meta.type) && e.__ref.collectionId
    );
    const colIds = cEnvs.map((e) => e.__ref.collectionId);
    const colEnvMap = colIds.reduce((p, n) => {
      let env = cEnvs.find(
        (e) => e.__ref.collectionId == n && e.name == 'Development'
      );
      // id=f develoment env not found then find te first env for now
      if (!env) {
        env = cEnvs.find((e) => e.__ref.collectionId == n);
      }
      return {
        ...p,
        [n]: env.__ref.id,
      };
    }, {});
    set({ envs, colEnvMap });
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

  setEnvVariables: (envId, variables: object) => {
    set((s) => {
      const envs = s.envs.map((e) => {
        if (e.__ref.id == envId) {
          return { ...e, variables };
        }
        return e;
      });
      return { envs };
    });
    return;
  },

  setCurrentTabActiveEnv: (envId) => {
    const tabStore = useTabStore.getState();
    const tabId = tabStore.getActiveTab();
    if (!tabId) return;
    const state = get();
    const collectionId = state.tabColMap[tabId];
    if (!collectionId) return;
    set((s) => {
      if (!envId) {
        const env = s.envs.find(
          (e) => e.__ref.collectionId == collectionId && e.name == 'Development'
        );
        if (env) envId = env.__ref.id;
      }
      if (!envId) return s;
      return {
        colEnvMap: {
          ...s.colEnvMap,
          [collectionId]: envId,
        },
      };
    });
  },

  getCollectionActiveEnv: (collectionId) => {
    return get().colEnvMap[collectionId];
  },

  getActiveTabEnv: () => {
    const tabStore = useTabStore.getState();
    const tabId = tabStore.getActiveTab();
    if (!tabId) return null;
    const state = get();
    const collectionId = state.tabColMap[tabId];
    if (!collectionId) return null;
    const envId = state.getCollectionActiveEnv(collectionId);
    if (!envId) return null;
    return state.envs.find((e) => e.__ref.id == envId);
  },

  getCollectionEnvs: (collectionId) => {
    return get().envs.filter((e) => e.__ref.collectionId == collectionId);
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
          if (r.data.__meta.type == EEnvironmentScope.Collection) {
            s.colEnvTdpInstance?.addEnvItem(r.data);
          }
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
      .delete(envId)
      .then((r) => {
        set((s) => {
          const env = s.envs.find((e) => e.__ref.id == envId);
          if (env) {
            if (env.__meta.type == EEnvironmentScope.Collection) {
              s.colEnvTdpInstance?.removeEnvItem(envId);
            }
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

  // dispose whole store and reset to initial state
  dispose: () => set({ ...initialState }),
}));
