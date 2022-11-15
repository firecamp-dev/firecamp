import { TId } from '@firecamp/types';

interface IPlaygroundTab {
  id: string;
  name: string;
  meta?: {
    isSaved?: boolean;
    hasChange?: boolean;
  };
}

interface IRuntime {
  playgroundTabs?: IPlaygroundTab[];
  activePlayground?: TId;
  activeEnvironments?: {
    workspace: TId;
    collection: TId;
  };
  isRequestSaved?: boolean;
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
  setRequestSavedFlag: (flag: boolean) => void;
}

const createRuntimeSlice = (
  set,
  get,
  initialRuntime: IRuntime
): IRuntimeSlice => ({
  runtime: initialRuntime,

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
        activeEnvironments: {
          ...s.runtime.activeEnvironments,
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
        activeEnvironments: updates,
      },
    }));
  },
  setRequestSavedFlag: (flag: boolean) => {
    set((s) => ({
      ...s,
      runtime: {
        ...s.runtime,
        isRequestSaved: flag,
      },
    }));
  },
});

export { createRuntimeSlice, IRuntime, IRuntimeSlice };
