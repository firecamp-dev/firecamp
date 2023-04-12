import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { _object, _array } from '@firecamp/utils';
import { ERequestPanelTabs } from '../../types';
import { TStoreSlice } from '../store.type';

interface IUiConnectionPanel {
  activeTab?: string;
  headers?: number;
  params?: number;
}
interface IUi {
  isFetchingRequest: boolean;
  connectionPanel: IUiConnectionPanel;
}
interface IUiSlice {
  ui: IUi;
  initializeUi: (ui: IUi) => void;
  changeUiActiveTab: (tabName: string) => void;
  setIsFetchingReqFlag: (flag: boolean) => void;
  setUIRequestPanelState?: (uiRequestPanel: { [key: string]: any }) => void;
}
const createUiSlice: TStoreSlice<IUiSlice> = (set, get, initialUi: IUi) => ({
  ui: initialUi || {
    isFetchingRequest: false,
    connectionPanel: {
      activeTab: ERequestPanelTabs.Playgrounds,
    },
  },
  initializeUi: (ui: IUi) => {
    set((s) => ({ ui }));
  },
  changeUiActiveTab: (tabName: string) => {
    set((s) => ({
      ui: {
        ...s.ui,
        connectionPanel: {
          ...s.ui.connectionPanel,
          activeTab: tabName,
        },
      },
    }));
  },
  setIsFetchingReqFlag: (flag: boolean) => {
    if (flag === undefined) flag = !get().ui.isFetchingRequest;
    set((s) => ({
      ui: { ...s.ui, isFetchingRequest: flag },
    }));
  },
  setUIRequestPanelState: (cPanelUi: { [key: string]: any }) => {
    set((s) => ({
      ui: {
        ...s.ui,
        connectionPanel: {
          ...s.ui.connectionPanel,
          ...cPanelUi,
        },
      },
    }));
  },
});
export { createUiSlice, IUiSlice, IUi, IUiConnectionPanel };
