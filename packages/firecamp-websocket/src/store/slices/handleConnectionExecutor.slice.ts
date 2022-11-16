import Executor, {
  IExecutor,
  TExecutorOptions,
} from '@firecamp/ws-executor/dist/esm';
import { TId, IWebSocketMessage, EFirecampAgent } from '@firecamp/types';
import { IPlayground } from './playgrounds.slice';
import { _misc, _object } from '@firecamp/utils';
import { EConnectionState } from '../../types';

interface IHandleConnectionExecutorSlice {
  connect: (connection_id: TId) => void;
  disconnect: (connection_id: TId, code: number, reason: string) => void;
  sendMessage: (connection_id: TId, message: IWebSocketMessage) => void;
}

const createHandleConnectionExecutor = (
  set,
  get
): IHandleConnectionExecutorSlice => ({
  connect: (connection_id: TId) => {
    /**
     * TOODs:
     * 1. Manage and parse environment variables
     * 2. Manager ssl n proxy logic
     */

    if (!connection_id) return;

    try {
      let url = get()?.request?.url,
        config = get()?.request?.config,
        connection = get()?.request?.connections.find(
          (c) => c.id === connection_id
        );

      if (!connection || !url.raw) return;

      const options: TExecutorOptions = {
        url,
        config,
        connection,
        WebSocket,
        agent: EFirecampAgent.extension,
        certificates: [], // TODO: add ssl certi
      };

      const executor: IExecutor =
        _misc.firecampAgent() === EFirecampAgent.desktop
          ? window.fc.websocket(options)
          : new Executor(options);

      // on open
      executor.onOpen(() => {
        get()?.changePlaygroundConnectionState(
          connection_id,
          EConnectionState.Open
        );
      });

      // on close
      executor.onClose(() => {
        get()?.changePlaygroundConnectionState(
          connection_id,
          EConnectionState.Closed
        );
      });

      // on reconnect
      executor.onConnecting(() => {
        get()?.changePlaygroundConnectionState(
          connection_id,
          EConnectionState.Connecting
        );
      });

      // get logs
      executor.logs((log) => {
        if (!log) return;
        get()?.addConnectionLog(connection_id, log);
      });

      // connect
      executor.connect();

      // set executorin to playground
      get()?.changePlayground(connection_id, { executor });
    } catch (error) {
      console.info({
        API: 'websocket.connect',
        connection_id,
        error,
      });
    }
  },

  disconnect: (connection_id: TId, code: number, reason: string) => {
    try {
      let existingPlayground = get()?.playgrounds?.[connection_id];
      if (
        existingPlayground &&
        existingPlayground?.id === connection_id &&
        existingPlayground.executor &&
        existingPlayground.connectionState === EConnectionState.Open
      ) {
        // disconnect
        existingPlayground.executor?.disconnect(code, reason);

        // set empty executor
        get()?.deleteExecutor(connection_id);
      }
    } catch (error) {
      console.info({
        API: 'websocket.disconnect',
        connection_id,
        error,
      });
    }
  },

  sendMessage: (connection_id: TId, message: IWebSocketMessage) => {
    try {
      /**
       * TODOs:
       * 1. Manage and parse environment variables
       * 2. history
       */

      let existingPlayground: IPlayground = get()?.playgrounds?.[connection_id];
      if (
        existingPlayground &&
        existingPlayground?.id === connection_id &&
        existingPlayground.executor &&
        existingPlayground.connectionState === EConnectionState.Open
      ) {
        // TODO: check if connection open or not. if not then executor will send log with error message

        message = _object.omit(message, ['path']);
        // console.log({ message });

        // send message
        existingPlayground.executor.send(message);
      }
    } catch (error) {
      console.info({
        API: 'websocket.send',
        connection_id,
        message,
        error,
      });
    }
  },
});

export { IHandleConnectionExecutorSlice, createHandleConnectionExecutor };
