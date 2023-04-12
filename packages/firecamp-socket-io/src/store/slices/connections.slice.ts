import isEqual from 'react-fast-compare';
import { TStoreSlice } from '../store.type';

interface IConnectionsSlice {
  updateConnection: (key: string, value: any) => void;
}

const createConnectionSlice: TStoreSlice<IConnectionsSlice> = (set, get) => ({
  updateConnection: (key: string, value: any) => {
    const state = get();
    // console.log({ key, value });

    //If connection id not provided
    if (!key) return;
    const { connection } = state.request;
    //Update connection
    const updatedConnection = Object.assign({}, connection, {
      [key]: value,
    });

    // Ping on/off
    if (key === 'ping') {
      if (value) {
        state.togglePingConnection(true, updatedConnection?.pingInterval);
      } else {
        state.togglePingConnection(false, 3000);
      }
    } else if (key === 'queryParams') {
      state.changeUrl({
        raw: state.request.url?.raw,
        [key]: value,
      });
    }

    if (isEqual(updatedConnection, connection)) return;
    set((s) => ({
      request: {
        ...s.request,
        connection: { ...updatedConnection },
      },
    }));
    state.equalityChecker({ connection });
  },
});

export { IConnectionsSlice, createConnectionSlice };
