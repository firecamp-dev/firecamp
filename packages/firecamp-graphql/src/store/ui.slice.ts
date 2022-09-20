import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { _object, _array } from '@firecamp/utils';
import { ESidebarTabs } from '../types';

interface IUi {
  isFetchingRequest: boolean; //TODO: rename it
  sidebarActiveTab?: ESidebarTabs;
  hasHeaders?: boolean;
  headers?: number;
  playgrounds?: number; //TODO; use it later to show count in collection tab
}
interface IUiSlice {
  ui: IUi;

  initializeUi: (ui: IUi) => void;
  changeUiActiveTab: (tab: string) => void;
  setIsFetchingReqFlag: (flag: boolean) => void;
  setUiState?: (ui: Partial<IUi>) => void;
}

const createUiSlice = (set, get, initialUi: IUi): IUiSlice => ({
  ui: initialUi || {
    isFetchingRequest: false,
    sidebarActiveTab: ESidebarTabs.Explorer,
  },

  initializeUi: (ui: IUi) => {
    set({ ui });
  },
  changeUiActiveTab: (tab: string) => {
    set((s) => ({
      ui: {
        ...s.ui,
        sidebarActiveTab: tab,
      },
    }));
  },
  setIsFetchingReqFlag: (flag: boolean) => {
    if (flag === undefined) flag = !get().ui.isFetchingRequest;

    set((s) => ({
      ...s,
      ui: { ...s.ui, isFetchingRequest: flag },
    }));
  },
  setUiState: (ui: Partial<IUi>) => {
    set((s) => ({
      ui: {
        ...s.ui,
        ...ui,
      },
    }));
  },
});

export { createUiSlice, IUiSlice, IUi };
