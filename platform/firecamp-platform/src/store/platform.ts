import create from 'zustand';
import { EFirecampAgent, IOrganization } from '@firecamp/types';
import { _misc } from '@firecamp/utils';
import * as executor from '@firecamp/agent-manager';
import { DefaultTheme } from '../types';

export enum EPlatformScope {
  Person = 'person',
  Organization = 'organization',
}

let firecampAgent: EFirecampAgent = localStorage.getItem(
  'firecampAgent'
) as EFirecampAgent;

// console.log(firecampAgent, 'firecampAgent...');
if (!firecampAgent) {
  const agent = _misc.firecampAgent();
  firecampAgent = agent === EFirecampAgent.Web ? EFirecampAgent.Web : agent;
}

const initialState = {
  theme: DefaultTheme,
  scope: EPlatformScope.Person,
  clientId: '',
  organization: null,
  switchingOrg: null, // It'll hold the org obj temporarily while switching org through modal, so the next modal of selecting workspace can access org id
  appInfo: {},
  __meta: {
    agent: firecampAgent,
    isExtAgentInstalled: false,
  },
};

export interface IPlatformStore {
  theme: any;
  scope: EPlatformScope;
  clientId: string;
  organization?: Partial<IOrganization> | null;
  switchingOrg: Partial<IOrganization> | null;
  appInfo: { [k: string]: any };
  __meta: {
    agent: EFirecampAgent;
    isExtAgentInstalled: boolean;
    [k: string]: any;
  };

  setClientId: (id: string) => void;
  setOrg: (org: IOrganization) => void;
  setSwitchingOrg: (org: Partial<IOrganization>) => void;
  unsetSwitchingOrg: () => void;
  updateAppInfo: (appInfo: any) => void;
  changeFirecampAgent: (agent: EFirecampAgent) => void;
  getFirecampAgent: () => EFirecampAgent;
  checkExtAgentInstalled: () => void;

  updateTheme: (theme: any) => void;

  // common
  dispose: () => void;
}

export const usePlatformStore = create<IPlatformStore>((set, get) => ({
  ...initialState,

  setClientId: (id: string) => {
    set({ clientId: id });
  },

  setOrg: (org: Partial<IOrganization>) => {
    if (!org || !org.__ref?.id) {
      set({ scope: EPlatformScope.Person, organization: null });
    } else {
      set({ scope: EPlatformScope.Organization, organization: org });
    }
  },

  setSwitchingOrg: (org: Partial<IOrganization>) => {
    if (!org || !org.__ref?.id) return;
    set({ switchingOrg: org });
  },

  unsetSwitchingOrg: () => {
    set({ switchingOrg: null });
  },

  updateAppInfo: (appInfo = {}) => {
    set({ appInfo });
  },

  changeFirecampAgent: (agent: EFirecampAgent) => {
    if (!agent) return;

    const __meta = get().__meta;
    if (agent == EFirecampAgent.Extension && !__meta.isExtAgentInstalled)
      agent = __meta.agent;

    // set agent in local storage
    localStorage.setItem('firecampAgent', agent);

    // set agent in store
    set((s) => ({ __meta: { ...s.__meta, agent } }));
  },

  getFirecampAgent: (): EFirecampAgent =>
    get().__meta.agent || EFirecampAgent.Cloud,

  checkExtAgentInstalled: async () => {
    executor
      .pingExtension()
      .then((res) => {
        set((s) => ({
          __meta: {
            ...s.__meta,
            isExtAgentInstalled: res == 'pong' ? true : false,
          },
        }));
      })
      .catch((e) => {
        const agent = get().__meta.agent;
        set((s) => ({
          __meta: {
            ...s.__meta,
            isExtAgentInstalled: false,
            agent:
              agent == EFirecampAgent.Extension ? EFirecampAgent.Cloud : agent,
          },
        }));
      });
  },

  // Theme
  updateTheme: async (theme = DefaultTheme) => {
    set((s) => ({ theme }));
  },

  // dispose whole store and reset to initial state
  dispose: () => set({ ...initialState }),
}));
