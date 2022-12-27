import { TId } from '@firecamp/types';
import { TStoreSlice } from '../store.type';

interface IPlaygroundTab {
  id: string;
  name: string;
  __meta?: {
    /** isSaved and hasChange will not be in use for now, it is for multi connection tabs purpose */
    isSaved?: boolean;
    hasChange?: boolean;
    isMsgSaved?: boolean;
    hasMsgChanged?: boolean;
  };
}

interface IRuntime {
  displayUrl: string;
  playgroundTabs?: IPlaygroundTab[];
  activePlayground?: TId;
  activeEnvironments?: {
    workspace: TId;
    collection: TId;
  };
  isRequestSaved?: boolean;
  _dnp?: { [k: string]: any };
  tabId?: TId;
}

interface IRuntimeSlice {
  runtime?: IRuntime;

  setActivePlayground: (playgroundId: TId) => void;
  addPlaygroundTab: (playground: IPlaygroundTab) => void;
  changePlaygroundTab: (playgroundId: TId, updates: object) => void;
  deletePlaygroundTab: (playgroundId: TId) => void;
  changeActiveEnvironment?: (
    scope: 'collection' | 'workspace',
    environmentId: TId
  ) => void;
  setActiveEnvironments?: (updates: {
    workspace: TId;
    collection: TId;
  }) => void;
  setRequestSavedFlag: (flag: boolean) => void;
}

const createRuntimeSlice: TStoreSlice<IRuntimeSlice> = (
  set,
  get,
  initialRuntime: IRuntime
) => ({
  runtime: initialRuntime,

  setActivePlayground: (playgroundId: TId) => {
    set((s) => ({
      runtime: {
        ...s.runtime,
        activePlayground: playgroundId,
      },
    }));
  },
  addPlaygroundTab: (playground: IPlaygroundTab) => {
    set((s) => ({
      runtime: {
        ...s.runtime,
        playgroundTabs: [...s.runtime.playgroundTabs, playground],
      },
    }));
  },
  changePlaygroundTab: (playgroundId: TId, updates: object) => {
    const existingTabIndex = get().runtime.playgroundTabs.findIndex(
      (tab) => tab.id === playgroundId
    );
    if (existingTabIndex !== -1) {
      set((s) => ({
        runtime: {
          ...s.runtime,
          playgroundTabs: [
            ...s.runtime.playgroundTabs.slice(0, existingTabIndex),
            {
              ...s.runtime.playgroundTabs[existingTabIndex],
              ...updates,
            },
            ...s.runtime.playgroundTabs.slice(existingTabIndex + 1),
          ],
        },
      }));
    }
  },
  deletePlaygroundTab: (playgroundId: TId) => {
    const existingTabIndex = get().runtime.playgroundTabs.findIndex(
      (tab) => tab.id === playgroundId
    );
    if (existingTabIndex !== -1) {
      set((s) => ({
        runtime: {
          ...s.runtime,
          playgroundTabs: [
            ...s.runtime.playgroundTabs.slice(0, existingTabIndex),
            ...s.runtime.playgroundTabs.slice(existingTabIndex + 1),
          ],
        },
      }));
    }
  },
  changeActiveEnvironment: (
    scope: 'collection' | 'workspace',
    environmentId: TId
  ) => {
    set((s) => ({
      runtime: {
        ...s.runtime,
        activeEnvironments: {
          ...s.runtime.activeEnvironments,
          [scope]: environmentId,
        },
      },
    }));
  },
  setActiveEnvironments: (updates: { workspace: TId; collection: TId }) => {
    set((s) => ({
      runtime: {
        ...s.runtime,
        activeEnvironments: updates,
      },
    }));
  },
  setRequestSavedFlag: (flag: boolean) => {
    set((s) => ({
      runtime: {
        ...s.runtime,
        isRequestSaved: flag,
      },
    }));
  },
});

export { createRuntimeSlice, IRuntime, IRuntimeSlice };
