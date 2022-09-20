import { TId } from '@firecamp/types';
import { ITab } from '@firecamp/ui-kit/src/components/tabs/interfaces/Tab.interface';

interface IPlaygroundMeta {
  // name: string, // if the playground is saved then this will be the same name of it, if not saved then this will be auto generated from the query.
  isSaved?: boolean;
  hasChange?: boolean;

  /** list of all operations' name in playground */
  operationNames?: string[];

  /** current active/selected operation */
  activeOperation?: string;

  /** if playground syntax is wrong then turn this flag true */
  hasError?: false;

  /** flag is true if the playground is being executed */
  isRequestRunning?: boolean;
}
interface IRuntime {
  // Manage multiple tabs of playground
  playgroundTabs?: ITab[];

  // Manage runtime meta of open tabs
  playgroundsMeta: { [k: string]: IPlaygroundMeta };

  // active tab/playground
  activePlayground?: string;
  schema?: any;
  isDocOpened?: boolean;
  activeEnvironments?: {
    workspace: TId;
    collection: TId;
  };
  isRequestSaved: boolean;

  /** true if fetch introspectionis under progress */
  isFetchingIntrospection?: boolean;
}

interface IRuntimeSlice {
  runtime?: IRuntime;

  // change_dnp?: (key: string, value: any) => void,
  setActivePlayground: (playgroundId: string) => void;
  setRequestRunningFlag: (playgroundId: string, flag: boolean) => void;
  setFetchIntrospectionFlag: (flag: boolean) => void;
  setSchema: (schema: any) => void;
  toggleDoc: (flag: boolean) => void;
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

const createRuntimeSlice = (set, get): IRuntimeSlice => ({
  runtime: {
    playgroundTabs: [
      // { id: 'playground-1', name: 'playground 1' }
    ],
    playgroundsMeta: {
      // 'playground-1': { isSaved: false, isRequestRunning: false, operationNames: [] },
    },
    activePlayground: '', // 'playground-1',
    schema: '',
    isDocOpened: false,
    activeEnvironments: {
      workspace: '',
      collection: '',
    },
    isRequestSaved: false,
    isFetchingIntrospection: false,
  },

  setActivePlayground: (playgroundId: string) => {
    set((s: IRuntimeSlice) => ({
      runtime: { ...s.runtime, activePlayground: playgroundId },
    }));
  },

  setRequestRunningFlag: (playgroundId: string, flag: boolean) => {
    // console.log(playgroundId, flag);
    set((s: IRuntimeSlice) => {
      const plgMeta = s.runtime.playgroundsMeta[playgroundId];
      return {
        runtime: {
          ...s.runtime,
          playgroundsMeta: {
            ...s.runtime.playgroundsMeta,
            [playgroundId]: {
              ...plgMeta,
              isRequestRunning: flag,
            },
          },
        },
      };
    });
  },

  setFetchIntrospectionFlag: (flag: boolean)=> {
    set((s)=> ({
      runtime: {
        ...s.runtime,
        isFetchingIntrospection: flag
      }
    }));
  },

  setSchema: (schema: any) => {
    set((s) => ({ runtime: { ...s.runtime, schema } }));
  },

  toggleDoc: (flag: boolean) => {
    set((s) => ({ runtime: { ...s.runtime, isDocOpened: flag } }));
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
