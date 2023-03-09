import { ISocketIOConnection, TId, IQueryParam } from '@firecamp/types';
import isEqual from 'react-fast-compare';
import _url from '@firecamp/url';
import { TStoreSlice } from '../store.type';

interface IConnectionsSlice {
  addConnection: (connection: ISocketIOConnection) => void;
  updateConnection: (connectionId: TId, key: string, value: any) => void;
  removeConnection: (connectionId: TId) => void;
  changeConQueryParams: (connectionId: TId, qps: IQueryParam[]) => void;
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
  updateConnection: (connectionId: TId, key: string, value: any) => {
    const state = get();
    console.log({ key, value });

    //If connection id not provided
    if (!connectionId || !key) return;

    const { connections } = state.request;

    //If connection not found
    const connectionIndex = connections.findIndex((c) => c.id === connectionId);
    if (connectionIndex === -1) return;

    //Update connection
    let updatedConnection = Object.assign({}, connections[connectionIndex], {
      [key]: value,
    });

    // Ping on/off
    if (key === 'ping') {
      if (value) {
        state.togglePingConnection(
          connectionId,
          true,
          updatedConnection?.pingInterval
        );
      } else {
        state.togglePingConnection(connectionId, false);
      }
    }

    /**
     * TODO:
     * 1. Update ping/ ping interval call ping on/ off method
     */

    if (key === 'config') {
      // Note: here for config update, value will be an object that holds updated key value pair from config
      // Example: value = { pingInterval: 10}

      updatedConnection = Object.assign({}, connections[connectionIndex], {
        [key]: Object.assign({}, connections[connectionIndex]?.config, value),
      });
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

    // state.prepareRequestConnectionsPushAction(
    //   connectionId,
    //   'u',
    //   state.last?.request?.connections[connectionIndex],
    //   updatedConnection
    // );
  },
  removeConnection: (connectionId: TId) => {
    const state = get();
    const {
      request: { connections },
      runtime: { _dnp },
    } = state;

    const removeConnIndex = connections.findIndex(
      (conn) => conn.id === connectionId
    );
    if (removeConnIndex !== -1) {
      const resultConnections = [
        ...connections.slice(0, removeConnIndex),
        ...connections.slice(removeConnIndex + 1),
      ];
      let newActiveConnection = _dnp.runtime_activeConnection;

      if (connectionId === _dnp.runtime_activeConnection) {
        newActiveConnection = connections.find((c) => c.isDefault);
      }

      set((s) => ({
        request: {
          ...s.request,
          connections: resultConnections,
        },
        runtime: {
          ...s.runtime,
          _dnp: {
            ...s.runtime._dnp,
            runtimeActiveConnection: newActiveConnection,
          },
        },
      }));
      // state.prepareRequestConnectionsPushAction(connectionId, 'd');
    }
  },
  changeConQueryParams: (connectionId: TId, qps: IQueryParam[]) => {
    if (!connectionId) return;
    const state = get();
    let { displayUrl } = state.runtime;
    const { connections } = state.request;
    const _connections = connections.map((c) => {
      if (c.id == connectionId) {
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
