import { TId } from '@firecamp/types';

interface IPlaygroundTab {
  id: string;
  name: string;
  meta?: {
    is_saved?: boolean;
    hasChange?: boolean;
  };
}

interface IRuntime {
  playgroundTabs?: IPlaygroundTab[];
  activePlayground?: TId;
  active_environments?: {
    workspace: TId;
    collection: TId;
  };

  is_request_running?: boolean;
  is_request_saved?: boolean;
}

interface IRuntimeSlice {
  runtime?: IRuntime;

  setActivePlayground: (playgroundId: TId) => void;
  addPlaygroundTab: (playground: IPlaygroundTab) => void;
  changePlaygroundTab: (playgroundId: TId, updates: object) => void;
  deletePlaygroundTab: (playgroundId: TId) => void;
  changeActiveEnvironment?: (
    scope: 'collection' | 'workspace',
    environment_id: TId
  ) => void;
  setActiveEnvironments?: (updates: {
    workspace: TId;
    collection: TId;
  }) => void;
  setRequestRunningFlag: (flag: boolean) => void;
  setRequestSavedFlag: (flag: boolean) => void;
}

const createRuntimeSlice = (
  set,
  get,
  initialRuntime: IRuntime
): IRuntimeSlice => ({
  runtime: {
    playgroundTabs: [],
    activePlayground: '',
    active_environments: { collection: '', workspace: '' },
    is_request_running: false,
    is_request_saved: false,
    ...initialRuntime,
  },

  setActivePlayground: (playgroundId: TId) => {
    set((s) => ({
      ...s,
      runtime: {
        ...s.runtime,
        activePlayground: playgroundId,
      },
    }));
  },
  addPlaygroundTab: (playground: IPlaygroundTab) => {
    set((s) => ({
      ...s,
      runtime: {
        ...s.runtime,
        playgroundTabs: [...s.runtime.playgroundTabs, playground],
      },
    }));
  },
  changePlaygroundTab: (playgroundId: TId, updates: object) => {
    let existingTabIndex = get()?.runtime.playgroundTabs.findIndex(
      (tab) => tab.id === playgroundId
    );
    if (existingTabIndex !== -1) {
      set((s) => ({
        ...s,
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
    let existingTabIndex = get()?.runtime.playgroundTabs.findIndex(
      (tab) => tab.id === playgroundId
    );
    if (existingTabIndex !== -1) {
      set((s) => ({
        ...s,
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
    environment_id: TId
  ) => {
    // console.log({ scope, environment_id });

    set((s) => ({
      ...s,
      runtime: {
        ...s.runtime,
        active_environments: {
          ...s.runtime.active_environments,
          [scope]: environment_id,
        },
      },
    }));
  },
  setActiveEnvironments: (updates: { workspace: TId; collection: TId }) => {
    // console.log({updates});

    set((s) => ({
      ...s,
      runtime: {
        ...s.runtime,
        active_environments: updates,
      },
    }));
  },
  setRequestRunningFlag: (flag: boolean) => {
    set((s) => ({
      ...s,
      runtime: {
        ...s.runtime,
        is_request_running: flag,
      },
    }));
  },
  setRequestSavedFlag: (flag: boolean) => {
    set((s) => ({
      ...s,
      runtime: {
        ...s.runtime,
        is_request_saved: flag,
      },
    }));
  },
});

export { createRuntimeSlice, IRuntime, IRuntimeSlice };
