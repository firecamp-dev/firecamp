import Executor, {
  IExecutor,
  TExecutorOptions,
} from '@firecamp/ws-executor/dist/esm';
import { TId, IWebSocketMessage, EFirecampAgent } from '@firecamp/types';
import { IPlayground } from './playgrounds.slice';
import { _misc, _object } from '@firecamp/utils';
import { EConnectionState } from '../../types';
import { TStoreSlice } from '../store.type';

interface IHandleConnectionExecutorSlice {
  connect: (connectionId: TId) => void;
  disconnect: (connectionId: TId, code?: number, reason?: string) => void;
  sendMessage: (connectionId: TId, message: IWebSocketMessage) => void;
}

const createHandleConnectionExecutor: TStoreSlice<
  IHandleConnectionExecutorSlice
> = (set, get) => ({
  connect: (connectionId: TId) => {
    /**
     * TOODs:
     * 1. Manage and parse environment variables
     * 2. Manager ssl n proxy logic
     */

    console.log(connectionId, 'connectionId...');

    if (!connectionId) return;

    try {
      const state = get();
      console.log(state, '123456789');
      const url = state.request.url,
        config = state.request.config,
        connection = state.request.connections.find(
          (c) => c.id === connectionId
        );

      // console.log(connection, url);
      if (!connection || !url.raw) return;
      const options: TExecutorOptions = {
        url: { ...url, queryParams: connection.queryParams },
        config,
        connection,
        WebSocket,
        // agent: EFirecampAgent.Web,
        certificates: [], // TODO: add ssl certs
      };

      const executor: IExecutor =
        _misc.firecampAgent() === EFirecampAgent.Desktop
          ? // @ts-ignore
            window.fc.websocket(options)
          : new Executor(options);

      console.log(_misc.firecampAgent(), executor);

      // on open
      executor.onOpen(() => {
        state.changePlaygroundConnectionState(
          connectionId,
          EConnectionState.Open
        );
      });

      // on close
      executor.onClose(() => {
        state.changePlaygroundConnectionState(
          connectionId,
          EConnectionState.Closed
        );
      });

      // on reconnect
      executor.onConnecting(() => {
        state.changePlaygroundConnectionState(
          connectionId,
          EConnectionState.Connecting
        );
      });

      // get logs
      executor.logs((log) => {
        if (!log) return;
        state.addLog(connectionId, log);
      });

      // connect
      executor.connect();

      // set executor in to playground
      state.changePlayground(connectionId, { executor });
    } catch (error) {
      console.info({
        API: 'websocket.connect',
        connectionId,
        error,
      });
    }
  },

  disconnect: (connectionId: TId, code: number, reason: string) => {
    try {
      const state = get();
      const existingPlayground = state.playgrounds?.[connectionId];
      if (
        existingPlayground &&
        existingPlayground?.id === connectionId &&
        existingPlayground.executor &&
        existingPlayground.connectionState === EConnectionState.Open
      ) {
        // disconnect
        existingPlayground.executor?.disconnect(code, reason);

        // set empty executor
        state.deleteExecutor(connectionId);
      }
    } catch (error) {
      console.info({
        API: 'websocket.disconnect',
        connectionId,
        error,
      });
    }
  },

  sendMessage: (connectionId: TId, message: IWebSocketMessage) => {
    try {
      /**
       * TODOs:
       * 1. Manage and parse environment variables
       * 2. history
       */
      const state = get();
      const existingPlayground: IPlayground = state.playgrounds?.[connectionId];
      if (
        existingPlayground &&
        existingPlayground?.id === connectionId &&
        existingPlayground.executor &&
        existingPlayground.connectionState === EConnectionState.Open
      ) {
        // TODO: check if connection open or not. if not then executor will send log with error message

        message = _object.omit(message, ['path']) as IWebSocketMessage;
        console.log({ message }, 'send message');

        // send message
        existingPlayground.executor.send(message);
      }
    } catch (error) {
      console.info({
        API: 'websocket.send',
        connectionId,
        message,
        error,
      });
    }
  },
});

export { IHandleConnectionExecutorSlice, createHandleConnectionExecutor };
