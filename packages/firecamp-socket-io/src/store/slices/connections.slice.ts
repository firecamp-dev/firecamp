import { ISocketIOConnection, TId, EPushActionType } from '@firecamp/types';
import equal from 'deep-equal';
import _url from '@firecamp/url';

interface IConnectionsSlice {
  addConnection: (connection: ISocketIOConnection) => void;
  updateConnection: (connectionId: TId, key: string, value: any) => void;
  removeConnection: (connectionId: TId) => void;
}

const createConnectionSlice = (set, get): IConnectionsSlice => ({
  addConnection: (connection: ISocketIOConnection) => {
    let updatedConnections = [...get().request.connections, connection];
    set((s) => ({
      ...s,
      request: {
        ...s.request,
        connections: updatedConnections,
      },
    }));
    get()?.prepareRequestConnectionsPushAction(
      connection.id,
      EPushActionType.Insert
    );
  },
  updateConnection: (connectionId: TId, key: string, value: any) => {
    console.log({ key, value });

    //If connection id not provided
    if (!connectionId || !key) return;

    let { connections } = get()?.request;

    //If connection not found
    let connectionIndex = connections.findIndex((c) => c.id === connectionId);
    if (connectionIndex === -1) return;

    //Update connection
    let updatedConnection = Object.assign({}, connections[connectionIndex], {
      [key]: value,
    });

    // Ping on/off
    if (key === 'ping') {
      if (value) {
        get().togglePingConnection(
          connectionId,
          true,
          updatedConnection?.pingInterval
        );
      } else {
        get().togglePingConnection(connectionId, false);
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
      get().changeUrl({
        raw: get().request.url?.raw,
        [key]: value,
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

    get()?.prepareRequestConnectionsPushAction(
      connectionId,
      EPushActionType.Update,
      get()?.last?.request?.connections[connectionIndex],
      updatedConnection
    );
  },
  removeConnection: (connectionId: TId) => {
    let {
      request: { connections },
      runtime: { _dnp },
    } = get();

    let removeConnIndex = connections.findIndex(
      (conn) => conn.id === connectionId
    );
    if (removeConnIndex !== -1) {
      let resultConnections = [
          ...connections.slice(0, removeConnIndex),
          ...connections.slice(removeConnIndex + 1),
        ],
        newActiveConnection = _dnp.runtime_activeConnection;

      if (connectionId === _dnp.runtime_activeConnection) {
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
            runtime_activeConnection: newActiveConnection,
          },
        },
      }));
      get()?.prepareRequestConnectionsPushAction(
        connectionId,
        EPushActionType.Delete
      );
    }
  },
});

export { IConnectionsSlice, createConnectionSlice };
