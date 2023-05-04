import { TStoreSlice } from '../store.type';

export interface IUiConnectionPanel {
  headers?: number;
  params?: number;
  auth?: number;
}
export interface IUi {
  isFetchingRequest: boolean;
  isUpdatingRequest?: boolean;
  connectionPanel?: IUiConnectionPanel;
}

export interface IUiSlice {
  ui: IUi;
  initializeUi: (ui: IUi) => void;
  toggleFetchingReqFlag: (flag: boolean) => void;
  toggleUpdatingReqFlag: (flag: boolean) => void;
}

export const createUiSlice: TStoreSlice<IUiSlice> = (
  set,
  get,
  initialUi: IUi
) => ({
  ui: initialUi,
  initializeUi: (ui: IUi) => {
    set((s) => ({ ui: { ...s.ui, ...ui } }));
  },
  toggleFetchingReqFlag: (flag: boolean) => {
    if (flag === undefined) flag = !get().ui.isFetchingRequest;
    set((s) => ({ ui: { ...s.ui, isFetchingRequest: flag } }));
  },
  toggleUpdatingReqFlag: (flag: boolean) => {
    if (flag === undefined) flag = !get().ui.isUpdatingRequest;
    set((s) => ({ ui: { ...s.ui, isUpdatingRequest: flag } }));
  },
});
