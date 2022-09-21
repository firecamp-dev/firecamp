import create from 'zustand';
import { EFirecampAgent, IOrganization } from '@firecamp/types';
import { _misc } from '@firecamp/utils';
import * as executor from "@firecamp/agent-manager";
import { DefaultTheme } from '../types';

export enum EPlatformScope {
  Person = 'person',
  Organization = 'organization',
}

let firecampAgent: EFirecampAgent = localStorage.getItem(
  'firecampAgent'
) as EFirecampAgent;

console.log(firecampAgent, "firecampAgent...")
if(!firecampAgent) {
  const agent = _misc.firecampAgent();
  firecampAgent= agent === EFirecampAgent.web ? EFirecampAgent.proxy : agent;
}

const initialState = {
  theme: DefaultTheme,
  scope: EPlatformScope.Person,
  clientId: '',
  organization: null,
  switchingOrg: null, // It'll hold the org obj temporarily while switching org through modal, so the next modal of selecting workspace can access org id
  appInfo: {},
  meta: {
    agent: firecampAgent,
    isExtAgentInstalled: false
  },
};

export interface IPlatformStore {
  theme: any;
  scope: EPlatformScope;
  clientId: string;
  organization?: Partial<IOrganization> | null;
  switchingOrg: Partial<IOrganization> | null;
  appInfo: { [k: string]: any };
  meta: { agent: EFirecampAgent; isExtAgentInstalled:boolean, [k: string]: any };

  setClientId: (id: string) => void;
  setOrg: (org: IOrganization) => void;
  setSwitchingOrg: (org: Partial<IOrganization>) => void;
  unsetSwitchingOrg: () => void;
  updateAppInfo: (appInfo: any) => void;
  changeFirecampAgent: (agent: EFirecampAgent) => void;
  getFirecampAgent: () => EFirecampAgent;
  checkExtAgentIntalled: ()=> void;

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
    if (!org || !org._meta?.id) return;
    set({ scope: EPlatformScope.Organization, organization: org });
  },

  setSwitchingOrg: (org: Partial<IOrganization>) => {
    if (!org || !org._meta?.id) return;
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

    const meta= get().meta;
    if(agent == EFirecampAgent.extension && !meta.isExtAgentInstalled) agent= meta.agent;

    // set agent in local storage
    localStorage.setItem('firecampAgent', agent);

    // set agent in store
    set((s) => ({ meta: { ...s.meta, agent } }));
  },

  getFirecampAgent: (): EFirecampAgent =>
    get().meta.agent || EFirecampAgent.proxy,

  checkExtAgentIntalled: async()=> {
    executor
      .pingExtension()
      .then(res=> {
          set(s=> ({ meta: { ...s.meta, isExtAgentInstalled: res=="pong"? true: false }}))
      })
      .catch(e=> {
        const agent= get().meta.agent;
        set(s=> ({ meta: { 
          ...s.meta, 
          isExtAgentInstalled: false,
          agent: agent == EFirecampAgent.extension? EFirecampAgent.proxy: agent
        }}))
      });
  },

  // Theme
  updateTheme: async (theme = DefaultTheme) => {
    set((s) => ({ theme }));
  },

  // dispose whole store and reset to initial state
  // dispose whole store and reset to initial state
  dispose: () => set({ ...initialState }),
}));
