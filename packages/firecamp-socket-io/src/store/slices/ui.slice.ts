import { TStoreSlice } from '../store.type';

export interface IUi {
  isFetchingRequest: boolean;
}

export interface IUiSlice {
  ui: IUi;
  initializeUi: (ui: IUi) => void;
  setIsFetchingReqFlag: (flag: boolean) => void;
}

export const createUiSlice: TStoreSlice<IUiSlice> = (
  set,
  get,
  initialUi: IUi
) => ({
  ui: initialUi || { isFetchingRequest: false },
  initializeUi: (ui: IUi) => {
    set((s) => ({ ui }));
  },
  setIsFetchingReqFlag: (flag: boolean) => {
    if (flag === undefined) flag = !get().ui.isFetchingRequest;
    set((s) => ({ ui: { ...s.ui, isFetchingRequest: flag } }));
  },
});
