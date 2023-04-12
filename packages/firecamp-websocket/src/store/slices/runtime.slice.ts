import { TId, TRequestPath } from '@firecamp/types';
import { TStoreSlice } from '../store.type';

interface IRuntime {
  isRequestSaved?: boolean;
  requestPath?: TRequestPath;
  tabId: TId;
}

interface IRuntimeSlice {
  runtime?: IRuntime;
  setRequestSavedFlag: (flag: boolean) => void;
}

const createRuntimeSlice: TStoreSlice<IRuntimeSlice> = (
  set,
  get,
  initialRuntime: IRuntime
) => ({
  runtime: initialRuntime,

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
