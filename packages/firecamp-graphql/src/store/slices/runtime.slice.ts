import { TId, TRequestPath } from '@firecamp/types';
import { ITab } from '@firecamp/ui/src/components/tabs/interfaces/Tab.interface';
import { TStoreSlice } from '../store.type';

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

  // Manage runtime __meta of open tabs
  playgroundsMeta: { [k: string]: IPlaygroundMeta };

  // active tab/playground
  activePlayground?: string;
  schema?: any;
  isDocOpened?: boolean;
  isRequestSaved: boolean;

  /** true if fetch introspections under progress */
  isFetchingIntrospection?: boolean;
  requestPath?: TRequestPath;
  tabId: TId;
}

interface IRuntimeSlice {
  runtime?: IRuntime;

  // change_dnp?: (key: string, value: any) => void,
  setActivePlayground: (playgroundId: string) => void;
  setRequestRunningFlag: (playgroundId: string, flag: boolean) => void;
  setFetchIntrospectionFlag: (flag: boolean) => void;
  setSchema: (schema: any) => void;
  toggleDoc: (flag: boolean) => void;
  setRequestSavedFlag: (flag: boolean) => void;
}

const createRuntimeSlice: TStoreSlice<IRuntimeSlice> = (
  set,
  get,
  initState
): IRuntimeSlice => ({
  runtime: initState,
  // runtime: {
  //   playgroundTabs: [
  //     // { id: 'playground-1', name: 'playground 1' }
  //   ],
  //   playgroundsMeta: {
  //     // 'playground-1': { isSaved: false, isRequestRunning: false, operationNames: [] },
  //   },
  //   activePlayground: '', // 'playground-1',
  //   schema: '',
  //   isDocOpened: false,
  //   isRequestSaved: false,
  //   isFetchingIntrospection: false,
  // },

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

  setFetchIntrospectionFlag: (flag: boolean) => {
    set((s) => ({
      runtime: {
        ...s.runtime,
        isFetchingIntrospection: flag,
      },
    }));
  },

  setSchema: (schema: any) => {
    set((s) => ({ runtime: { ...s.runtime, schema } }));
  },

  toggleDoc: (flag: boolean) => {
    set((s) => ({ runtime: { ...s.runtime, isDocOpened: flag } }));
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
