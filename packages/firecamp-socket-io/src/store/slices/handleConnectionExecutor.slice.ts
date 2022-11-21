import Executor, {
  IExecutorInterface,
  TExecutorOptions,
} from '@firecamp/socket.io-executor/dist/esm';
import { TId, ISocketIOEmitter, EFirecampAgent } from '@firecamp/types';
import { _misc, _object } from '@firecamp/utils'
import v2 from 'socket.io-client-v2';
import v3 from 'socket.io-client-v3';
import v4 from 'socket.io-client-v4';
import { EConnectionState } from '../../constants';

interface IHandleConnectionExecutorSlice {
  connect: (connection_id: TId) => void;
  disconnect: (connection_id: TId, code: number, reason: string) => void;
  sendMessage: (connection_id: TId, emitter: ISocketIOEmitter) => void;
  togglePingConnection: (
    connection_id: TId,
    pinging: boolean,
    interval: number
  ) => void;
  addListenerToExecutor: (connection_id: TId, eventName: string) => void;
  addListenersToExecutor: (
    connection_id: TId,
    eventNames: Array<string>
  ) => void;
  removeListenerFromExecutor: (
    connection_id: TId,
    eventName: string
  ) => void;
  removeListenersFromExecutor: (
    connection_id: TId,
    eventNames?: Array<string>
  ) => void;
  removeAllListenersFromExecutor: (connection_id: TId) => void;
  changeListenerToAllExecutors: (eventName: string, listen: boolean) => void;
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
        io: {
          v2,
          v3,
          v4,
        },
        url,
        config,
        connection,
        certificates: [], // TODO: add ssl certi
      };

      const executor: IExecutorInterface = _misc.firecampAgent() === EFirecampAgent.desktop
        ? window.fc.io(options)
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
        console.log({ log });

        if (!log) return;
        get()?.addConnectionLog(connection_id, log);
      });

      // connect
      executor.connect();

      // set executorin to playground
      get()?.changePlayground(connection_id, { executor });

      // listen to on connect listener
      get()?.listenOnConnect(connection_id);
    } catch (error) {
      console.info({
        API: 'socket.connect',
        connection_id,
        error,
      });
    }
  },

  disconnect: (connection_id: TId, code: number, reason: string) => {
    try {
      let existingPlayground = get().getPlayground(connection_id);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        // disconnect
        existingPlayground.executor?.close(code, reason);

        // set empty executor
        get()?.deleteExecutor(connection_id);
      } else {
        get()?.addErrorLog(connection_id, 'disconnected');
      }
    } catch (error) {
      console.info({
        API: 'socket.disconnect',
        connection_id,
        error,
      });
    }
  },

  sendMessage: (connection_id: TId, emitter: ISocketIOEmitter) => {
    try {
      /**
       * TODOs:
       * 1. Manage and parse environment variables
       * 2. history
       */

      let existingPlayground = get().getPlayground(connection_id);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        // TODO: check if connection open or not. if not then executor will send log with error emitter

        emitter = _object.omit(emitter, ['path']);
        // console.log({ emitter });

        // send emitter
        if (emitter?.meta?.ack) {
          existingPlayground.executor.emitWithAck(emitter.name, emitter.body);
        } else {
          existingPlayground.executor.emit(emitter.name, emitter.body);
        }
      } else {
        get()?.addErrorLog(connection_id, 'disconnected');
      }
    } catch (error) {
      console.info({
        API: 'socket.send',
        connection_id,
        emitter,
        error,
      });
    }
  },

  togglePingConnection: (
    connection_id: TId,
    pinging: true,
    interval: number
  ) => {
    try {
      let existingPlayground = get().getPlayground(connection_id);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        if (pinging) {
          // ping
          existingPlayground.executor?.ping(interval);
        } else {
          existingPlayground.executor?.stopPinging();
        }
      } else {
        get()?.addErrorLog(connection_id, 'disconnected');
      }
    } catch (error) {
      console.info({
        API: 'socket.ping',
        connection_id,
        error,
      });
    }
  },
  addListenerToExecutor: (connection_id: TId, eventName: string) => {
    try {
      let existingPlayground = get().getPlayground(connection_id);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        existingPlayground.executor?.addListener(eventName);
      } else {
        get()?.addErrorLog(connection_id, 'disconnected');
      }
    } catch (error) {
      console.info({
        API: 'socket.addListener',
        connection_id,
        error,
      });
    }
  },
  addListenersToExecutor: (
    connection_id: TId,
    eventNames: Array<string>
  ) => {
    try {
      let existingPlayground = get().getPlayground(connection_id);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        existingPlayground.executor?.addListeners(eventNames);
      } else {
        get()?.addErrorLog(connection_id, 'disconnected');
      }
    } catch (error) {
      console.info({
        API: 'socket.addListeners',
        connection_id,
        error,
      });
    }
  },
  removeListenerFromExecutor: (connection_id: TId, eventName: string) => {
    try {
      let existingPlayground = get().getPlayground(connection_id);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        existingPlayground.executor?.removeListener(eventName);
      } else {
        get()?.addErrorLog(connection_id, 'disconnected');
      }
    } catch (error) {
      console.info({
        API: 'socket.removeListener',
        connection_id,
        error,
      });
    }
  },
  removeListenersFromExecutor: (
    connection_id: TId,
    eventNames?: Array<string>
  ) => {
    try {
      let existingPlayground = get().getPlayground(connection_id);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        existingPlayground.executor?.removeListeners(eventNames);
      } else {
        get()?.addErrorLog(connection_id, 'disconnected');
      }
    } catch (error) {
      console.info({
        API: 'socket.removeListeners',
        connection_id,
        error,
      });
    }
  },
  removeAllListenersFromExecutor: (connection_id: TId) => {
    try {
      let existingPlayground = get().getPlayground(connection_id);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        existingPlayground.executor?.removeAllListeners();
      } else {
        get()?.addErrorLog(connection_id, 'disconnected');
      }
    } catch (error) {
      console.info({
        API: 'socket.removeAllListeners',
        connection_id,
        error,
      });
    }
  },
  changeListenerToAllExecutors: (eventName: string, listen: boolean) => {
    let existingPlaygrounds = get().playgrounds;

    for (let connection_id in existingPlaygrounds) {
      try {
        let existingPlayground = existingPlaygrounds[connection_id];
        if (
          existingPlayground &&
          existingPlayground?.connectionState === EConnectionState.Open &&
          existingPlayground.executor
        ) {
          if (listen) {
            existingPlayground.executor?.addListener(eventName);
          } else {
            existingPlayground.executor?.removeListener(eventName);
          }
        } else {
          get()?.addErrorLog(connection_id, 'disconnected');
        }
      } catch (error) {
        console.info({
          API: 'socket.changeListenerToAllExecutors',
          connection_id,
          error,
        });
      }
    }
  },
});

export { IHandleConnectionExecutorSlice, createHandleConnectionExecutor };
