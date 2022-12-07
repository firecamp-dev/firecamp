import {
  IWebSocketConnection,
  TId,
  IQueryParam,
} from '@firecamp/types';
import _url from '@firecamp/url';
import { IWebsocketStore } from '../websocket.store';

interface IConnectionsSlice {
  addConnection: (connection: IWebSocketConnection) => void;
  updateConnection: (connectionId: TId, key: string, value: any) => void;
  removeConnection: (connectionId: TId) => void;
  changeConQueryParams: (connectionId: TId, qps: IQueryParam[]) => void;
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
    // state.prepareRequestConnectionsPushAction(connection.id, 'i');
  },
  updateConnection: (connectionId: TId, key: string, value: any) => {
    //if connection id not provided, queryParams has dedicated change fn below
    if (!connectionId || !key || key == 'queryParams') return;

    const state = get();
    const { displayUrl } = state.runtime;
    const { connections } = state.request;

    const _connections = connections.map((c) => {
      if (c.id == connectionId) {
        if (key == 'config') {
          /**
           * Note: here for config update, value will be an object that holds updated key value pair from config
           * Example: value = { pingInterval: 10}
           */
          c = Object.assign({}, c, {
            [key]: Object.assign({}, c.config, value),
          });
        } else {
          c = Object.assign({}, c, { [key]: value });
        }
      }
      return c;
    });

    set((s) => ({
      request: { ...s.request, connections: _connections },
      runtime: { ...s.runtime, displayUrl },
    }));

    // state.prepareRequestConnectionsPushAction(
    //   connectionId,
    //   EPushActionType.Update,
    //   state.last?.request?.connections[connectionIndex],
    //   updatedConnection
    // );
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

    console.log(state.equalityChecker(qps, 'queryParams'));
  },
});

export { IConnectionsSlice, createConnectionSlice };
