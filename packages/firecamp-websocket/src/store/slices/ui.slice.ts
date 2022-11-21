import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { _object, _array } from '@firecamp/utils';
import { ERequestPanelTabs } from '../../types';

interface IUiRequestPanel {
  activeTab?: string;
  hasHeaders?: boolean;
  hasQueries?: boolean;
  headers?: number;
  queries?: number;
}

interface IUi {
  isFetchingRequest: boolean;
  requestPanel: IUiRequestPanel;
}
interface IUiSlice {
  ui: IUi;

  initializeUi: (ui: IUi) => void;
  changeUiActiveTab: (tabName: string) => void;
  setIsFetchingReqFlag: (flag: boolean) => void;
  setUIRequestPanelState?: (uiRequestPanel: { [key: string]: any }) => void;
}

const createUiSlice = (set, get, initialUi: IUi): IUiSlice => ({
  ui: initialUi || {
    isFetchingRequest: false,
    requestPanel: {
      activeTab: ERequestPanelTabs.Playgrounds,
    },
  },

  initializeUi: (ui: IUi) => {
    set((s) => ({
      ...s,
      ui,
    }));
  },
  changeUiActiveTab: (tabName: string) => {
    set((s) => ({
      ...s,
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          activeTab: tabName,
        },
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
  setUIRequestPanelState: (uiRequestPanel: { [key: string]: any }) => {
    set((s) => ({
      ...s,
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          ...uiRequestPanel,
        },
      },
    }));
  },
});

export { createUiSlice, IUiSlice, IUi, IUiRequestPanel };
