import _url from '@firecamp/url';
import { TStoreSlice } from '../store.type';
import { prepareConnectionPanelUiState } from '../../services/request.service';

interface IConnectionsSlice {
  updateConnection: (key: string, value: any) => void;
}

const createConnectionSlice: TStoreSlice<IConnectionsSlice> = (set, get) => ({
  updateConnection: (key: string, value: any) => {
    const state = get();
    const _request = {
      ...state.request,
      connection: {
        ...state.request.connection,
        [key]: value,
      },
    };
    const cPanelUi = prepareConnectionPanelUiState(_request);
    set((s) => ({
      request: _request,
      ui: { ...s.ui, connectionPanel: cPanelUi },
    }));
  },
});

export { IConnectionsSlice, createConnectionSlice };
