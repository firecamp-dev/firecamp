import { IWebSocketConnection, TId, EPushActionType } from '@firecamp/types';
import equal from 'deep-equal';
import { IWebsocketStore } from '../websocket.store'

interface IConnectionsSlice {
  addConnection: (connection: IWebSocketConnection) => void;
  updateConnection: (connectionId: TId, key: string, value: any) => void;
  removeConnection: (connectionId: TId) => void;
}

const createConnectionSlice = (set, get): IConnectionsSlice => ({
  addConnection: (connection: IWebSocketConnection) => {
    const state = get();
    const updatedConnections = [...state.request.connections, connection];
    set((s) => ({
      ...s,
      request: {
        ...s.request,
        connections: updatedConnections,
      },
    }));
    state.prepareRequestConnectionsPushAction(
      connection.id,
      EPushActionType.Insert
    );
  },
  updateConnection: (connectionId: TId, key: string, value: any) => {
    //If connection id not provided
    if (!connectionId || !key) return;

    const state = get();
    const { connections } = state.request;

    //If connection not found
    let connectionIndex = connections.findIndex((c) => c.id === connectionId);
    if (connectionIndex === -1) return;

    //Update connection
    let updatedConnection = Object.assign({}, connections[connectionIndex], {
      [key]: value,
    });

    if (key === 'config') {
      // Note: here for config update, value will be an object that holds updated key value pair from config
      // Example: value = { pingInterval: 10}

      updatedConnection = Object.assign({}, connections[connectionIndex], {
        [key]: Object.assign({}, connections[connectionIndex]?.config, value),
      });
    }

    if (equal(updatedConnection, connections[connectionIndex])) return;

    set((s) => ({
      ...s,
      request: {
        ...s.request,
        connections: [
          ...s.request.connections.slice(0, connectionIndex),
          updatedConnection,
          ...s.request.connections.slice(connectionIndex + 1),
        ],
      },
    }));

    state.prepareRequestConnectionsPushAction(
      connectionId,
      EPushActionType.Update,
      state.last?.request?.connections[connectionIndex],
      updatedConnection
    );
  },
  removeConnection: (connectionId: TId) => {
    const state = get() as IWebsocketStore;
    const {
      request: { connections },
      runtime: { _dnp },
    } = state;

    const removeConnIndex = connections.findIndex(
      (conn) => conn.id === connectionId
    );
    if (removeConnIndex !== -1) {
      let resultConnections = [
          ...connections.slice(0, removeConnIndex),
          ...connections.slice(removeConnIndex + 1),
        ],
        newActiveConnection = _dnp.runtimeActiveConnection;

      if (connectionId === _dnp.runtimeActiveConnection) {
        newActiveConnection = connections.find((c) => c.isDefault);
      }

      set((s) => ({
        ...s,
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
      state.prepareRequestConnectionsPushAction(
        connectionId,
        EPushActionType.Delete
      );
    }
  },
});

export { IConnectionsSlice, createConnectionSlice };
