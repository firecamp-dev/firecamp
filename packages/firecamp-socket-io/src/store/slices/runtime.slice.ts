import { TId, TRequestPath } from '@firecamp/types';
import { TStoreSlice } from '../store.type';

interface IRuntime {
  isRequestRunning?: boolean;
  isRequestSaved?: boolean;
  requestPath?: TRequestPath;
  tabId: TId;
}

interface IRuntimeSlice {
  runtime?: IRuntime;
  setRequestRunningFlag: (flag: boolean) => void;
  setRequestSavedFlag: (flag: boolean) => void;
}

const createRuntimeSlice: TStoreSlice<IRuntimeSlice> = (
  set,
  get,
  initialRuntime: IRuntime
) => ({
  runtime: {
    isRequestRunning: false,
    isRequestSaved: false,
    ...initialRuntime,
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
