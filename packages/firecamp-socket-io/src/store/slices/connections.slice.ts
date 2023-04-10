import { ISocketIOConnection, IQueryParam } from '@firecamp/types';
import isEqual from 'react-fast-compare';
import _url from '@firecamp/url';
import { TStoreSlice } from '../store.type';

interface IConnectionsSlice {
  addConnection: (connection: ISocketIOConnection) => void;
  updateConnection: (key: string, value: any) => void;
  removeConnection: () => void;
  changeConQueryParams: (qps: IQueryParam[]) => void;
}

const createConnectionSlice: TStoreSlice<IConnectionsSlice> = (set, get) => ({
  addConnection: (connection: ISocketIOConnection) => {
    const state = get();
    const updatedConnections = [...state.request.connections, connection];
    set((s) => ({
      request: {
        ...s.request,
        connections: updatedConnections,
      },
    }));
    // state.prepareRequestConnectionsPushAction(connection.id, 'i');
  },
  updateConnection: (key: string, value: any) => {
    const state = get();
    const conId = state.getActiveConnectionId();
    console.log({ key, value });

    //If connection id not provided
    if (!key) return;

    const { connections } = state.request;
    //If connection not found
    const connectionIndex = connections.findIndex((c) => c.id === conId);
    if (connectionIndex === -1) return;

    //Update connection
    const updatedConnection = Object.assign({}, connections[connectionIndex], {
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

    if (isEqual(updatedConnection, connections[connectionIndex])) return;
    set((s) => ({
      request: {
        ...s.request,
        connections: [
          ...s.request.connections.slice(0, connectionIndex),
          updatedConnection,
          ...s.request.connections.slice(connectionIndex + 1),
        ],
      },
    }));
  },
  removeConnection: () => {
    const state = get();
    const conId = state.getActiveConnectionId();
    const {
      request: { connections },
    } = state;

    const removeConnIndex = connections.findIndex((conn) => conn.id === conId);
    if (removeConnIndex !== -1) {
      const resultConnections = [
        ...connections.slice(0, removeConnIndex),
        ...connections.slice(removeConnIndex + 1),
      ];

      set((s) => ({
        request: {
          ...s.request,
          connections: resultConnections,
        },
      }));
    }
  },
  changeConQueryParams: (qps: IQueryParam[]) => {
    const state = get();
    const conId = state.getActiveConnectionId();
    let { displayUrl } = state.runtime;
    const { connections } = state.request;

    const _connections = connections.map((c) => {
      if (c.id == conId) {
        c.queryParams = qps;
        const newUrl = _url.updateByQuery(state.request.url, c.queryParams);
        displayUrl = newUrl.raw;
      }
      return c;
    });

    set((s) => ({
      request: { ...s.request, connections: _connections },
      runtime: { ...s.runtime, displayUrl },
    }));
  },
});

export { IConnectionsSlice, createConnectionSlice };
