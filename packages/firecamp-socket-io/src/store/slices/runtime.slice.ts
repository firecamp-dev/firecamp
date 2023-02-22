import { TId } from '@firecamp/types';
import { TStoreSlice } from '../store.type';

interface IPlaygroundTab {
  id: string;
  name: string;
  __meta: {
    /** isSaved and hasChange will not be in use for now, it is for multi connection tabs purpose */
    isSaved?: boolean;
    hasChange?: boolean;
    isEmitterSaved?: boolean;
    hasEmitterChanged?: boolean;
  };
}

interface IRuntime {
  displayUrl: string;
  playgroundTabs?: IPlaygroundTab[];
  activePlayground?: TId;
  isRequestRunning?: boolean;
  isRequestSaved?: boolean;
  tabId?: TId;
}

interface IRuntimeSlice {
  runtime?: IRuntime;

  setActivePlayground: (playgroundId: TId) => void;
  addPlaygroundTab: (playground: IPlaygroundTab) => void;
  changePlaygroundTab: (playgroundId: TId, updates: object) => void;
  deletePlaygroundTab: (playgroundId: TId) => void;
  setRequestRunningFlag: (flag: boolean) => void;
  setRequestSavedFlag: (flag: boolean) => void;
}

const createRuntimeSlice: TStoreSlice<IRuntimeSlice> = (
  set,
  get,
  initialRuntime: IRuntime
) => ({
  runtime: {
    playgroundTabs: [],
    activePlayground: '',
    isRequestRunning: false,
    isRequestSaved: false,
    ...initialRuntime,
  },

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
    const state = get();
    const existingTabIndex = state.runtime.playgroundTabs.findIndex(
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
    const state = get();
    const existingTabIndex = state.runtime.playgroundTabs.findIndex(
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
  setRequestRunningFlag: (flag: boolean) => {
    set((s) => ({
      runtime: {
        ...s.runtime,
        isRequestRunning: flag,
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
