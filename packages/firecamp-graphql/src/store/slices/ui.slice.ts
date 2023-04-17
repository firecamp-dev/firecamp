import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { _object, _array } from '@firecamp/utils';
import { ESidebarTabs } from '../../types';
import { TStoreSlice } from '../store.type';

interface IUi {
  isFetchingRequest: boolean; //TODO: rename it
  isUpdatingRequest?: boolean;
  sidebarActiveTab?: ESidebarTabs;
  headers?: number;
  playgrounds?: number; //TODO; use it later to show count in collection tab
}
interface IUiSlice {
  ui: IUi;
  changeUiActiveTab: (tab: string) => void;
  toggleFetchingReqFlag: (flag: boolean) => void;
  toggleUpdatingReqFlag: (flag: boolean) => void;
}

const createUiSlice: TStoreSlice<IUiSlice> = (
  set,
  get,
  initialUi: IUi
): IUiSlice => ({
  ui: initialUi || {
    isFetchingRequest: false,
    sidebarActiveTab: ESidebarTabs.Explorer,
  },
  changeUiActiveTab: (tab: ESidebarTabs) => {
    set((s) => ({
      ui: {
        ...s.ui,
        sidebarActiveTab: tab,
      },
    }));
  },
  toggleFetchingReqFlag: (flag: boolean) => {
    if (flag === undefined) flag = !get().ui.isFetchingRequest;
    set((s) => ({
      ui: { ...s.ui, isFetchingRequest: flag },
    }));
  },
  toggleUpdatingReqFlag: (flag: boolean) => {
    if (flag === undefined) flag = !get().ui.isUpdatingRequest;
    set((s) => ({
      ui: { ...s.ui, isUpdatingRequest: flag },
    }));
  },
});

export { createUiSlice, IUiSlice, IUi };
