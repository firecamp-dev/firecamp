import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import { _object, _array } from '@firecamp/utils';
import { ERequestPanelTabs } from '../../types';
import { TStoreSlice } from '../store.type';

interface IUiRequestPanel {
  activeTab?: string;
  hasBody?: boolean;
  hasAuth?: boolean;
  hasPreScripts?: boolean;
  hasPostScripts?: boolean;
  hasConfig?: boolean;
  headers?: number;
  params?: number;
}
interface IUi {
  isFetchingRequest: boolean;
  isUpdatingRequest?: boolean;
  isCodeSnippetOpen?: boolean;
  requestPanel: IUiRequestPanel;
}
interface IUiSlice {
  ui: IUi;
  initializeUi: (ui: IUi) => void;
  changeUiActiveTab: (tabName: string) => void;
  toggleFetchingReqFlag: (flag: boolean) => void;
  toggleUpdatingReqFlag: (flag: boolean) => void;
  setUIRequestPanelState?: (uiRequestPanel: { [key: string]: any }) => void;
  toggleOpenCodeSnippet?: (isOpen?: boolean) => void;
}
const createUiSlice: TStoreSlice<IUiSlice> = (set, get, initialUi: IUi) => ({
  ui: initialUi || {
    isFetchingRequest: false,
    isCodeSnippetOpen: false,
    requestPanel: {
      activeTab: ERequestPanelTabs.Body,
    },
  },

  initializeUi: (ui: IUi) => {
    set((s) => ({ ui }));
  },
  changeUiActiveTab: (tabName: string) => {
    set((s) => ({
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          activeTab: tabName,
        },
      },
    }));
  },
  toggleFetchingReqFlag: (flag: boolean) => {
    if (flag === undefined) flag = !get().ui.isFetchingRequest;
    set((s) => ({ ui: { ...s.ui, isFetchingRequest: flag } }));
  },
  toggleUpdatingReqFlag: (flag: boolean) => {
    if (flag === undefined) flag = !get().ui.isUpdatingRequest;
    set((s) => ({ ui: { ...s.ui, isUpdatingRequest: flag } }));
  },
  setUIRequestPanelState: (uiRequestPanel: { [key: string]: any }) => {
    set((s) => ({
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          ...uiRequestPanel,
        },
      },
    }));
  },
  toggleOpenCodeSnippet: (isOpen?: boolean) => {
    set((s) => ({
      ui: {
        ...s.ui,
        isCodeSnippetOpen:
          isOpen === undefined ? !s.ui.isCodeSnippetOpen : isOpen,
      },
    }));
  },
});

export { createUiSlice, IUiSlice, IUi, IUiRequestPanel };
