import Executor, {
  IExecutorInterface,
  TExecutorOptions,
} from '@firecamp/socket.io-executor/dist/esm';
import { TId, ISocketIOEmitter, EFirecampAgent } from '@firecamp/types';
import { _misc, _object } from '@firecamp/utils';
import v2 from 'socket.io-client-v2';
import v3 from 'socket.io-client-v3';
import v4 from 'socket.io-client-v4';
import { EConnectionState } from '../../types';

interface IHandleConnectionExecutorSlice {
  connect: (connectionId: TId) => void;
  disconnect: (connectionId: TId, code?: number, reason?: string) => void;
  sendMessage: (connectionId: TId, emitter: ISocketIOEmitter) => void;
  togglePingConnection: (
    connectionId: TId,
    pinging: boolean,
    interval: number
  ) => void;
  addListenerToExecutor: (connectionId: TId, eventName: string) => void;
  addListenersToExecutor: (
    connectionId: TId,
    eventNames: Array<string>
  ) => void;
  removeListenerFromExecutor: (connectionId: TId, eventName: string) => void;
  removeListenersFromExecutor: (
    connectionId: TId,
    eventNames?: Array<string>
  ) => void;
  removeAllListenersFromExecutor: (connectionId: TId) => void;
  changeListenerToAllExecutors: (eventName: string, listen: boolean) => void;
}

const createHandleConnectionExecutor = (
  set,
  get
): IHandleConnectionExecutorSlice => ({
  connect: (connectionId: TId) => {
    /**
     * TOODs:
     * 1. Manage and parse environment variables
     * 2. Manager ssl n proxy logic
     */

    if (!connectionId) return;

    try {
      let url = get()?.request?.url,
        config = get()?.request?.config,
        connection = get()?.request?.connections.find(
          (c) => c.id === connectionId
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
        certificates: [], // TODO: add ssl certs
      };

      const executor: IExecutorInterface =
        _misc.firecampAgent() === EFirecampAgent.Desktop
          ? window.fc.io(options)
          : new Executor(options);

      // on open
      executor.onOpen(() => {
        get()?.changePlaygroundConnectionState(
          connectionId,
          EConnectionState.Open
        );
      });

      // on close
      executor.onClose(() => {
        get()?.changePlaygroundConnectionState(
          connectionId,
          EConnectionState.Closed
        );
      });

      // on reconnect
      executor.onConnecting(() => {
        get()?.changePlaygroundConnectionState(
          connectionId,
          EConnectionState.Connecting
        );
      });

      // get logs
      executor.logs((log) => {
        console.log({ log });

        if (!log) return;
        get()?.addConnectionLog(connectionId, log);
      });

      // connect
      executor.connect();

      // set executor in to playground
      get()?.changePlayground(connectionId, { executor });

      // listen to on connect listener
      get()?.listenOnConnect(connectionId);
    } catch (error) {
      console.info({
        API: 'socket.connect',
        connectionId,
        error,
      });
    }
  },

  disconnect: (connectionId: TId, code: number, reason: string) => {
    try {
      let existingPlayground = get().getPlayground(connectionId);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        // disconnect
        existingPlayground.executor?.close(code, reason);

        // set empty executor
        get()?.deleteExecutor(connectionId);
      } else {
        get()?.addErrorLog(connectionId, 'disconnected');
      }
    } catch (error) {
      console.info({
        API: 'socket.disconnect',
        connectionId,
        error,
      });
    }
  },

  sendMessage: (connectionId: TId, emitter: ISocketIOEmitter) => {
    try {
      /**
       * TODOs:
       * 1. Manage and parse environment variables
       * 2. history
       */

      let existingPlayground = get().getPlayground(connectionId);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        // TODO: check if connection open or not. if not then executor will send log with error emitter

        emitter = _object.omit(emitter, ['path']);
        // console.log({ emitter });

        // send emitter
        if (emitter?.__meta.ack) {
          existingPlayground.executor.emitWithAck(emitter.name, emitter.body);
        } else {
          existingPlayground.executor.emit(emitter.name, emitter.body);
        }
      } else {
        get()?.addErrorLog(connectionId, 'disconnected');
      }
    } catch (error) {
      console.info({
        API: 'socket.send',
        connectionId,
        emitter,
        error,
      });
    }
  },

  togglePingConnection: (
    connectionId: TId,
    pinging: true,
    interval: number
  ) => {
    try {
      let existingPlayground = get().getPlayground(connectionId);
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
        get()?.addErrorLog(connectionId, 'disconnected');
      }
    } catch (error) {
      console.info({
        API: 'socket.ping',
        connectionId,
        error,
      });
    }
  },
  addListenerToExecutor: (connectionId: TId, eventName: string) => {
    try {
      let existingPlayground = get().getPlayground(connectionId);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        existingPlayground.executor?.addListener(eventName);
      } else {
        get()?.addErrorLog(connectionId, 'disconnected');
      }
    } catch (error) {
      console.info({
        API: 'socket.addListener',
        connectionId,
        error,
      });
    }
  },
  addListenersToExecutor: (connectionId: TId, eventNames: Array<string>) => {
    try {
      let existingPlayground = get().getPlayground(connectionId);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        existingPlayground.executor?.addListeners(eventNames);
      } else {
        get()?.addErrorLog(connectionId, 'disconnected');
      }
    } catch (error) {
      console.info({
        API: 'socket.addListeners',
        connectionId,
        error,
      });
    }
  },
  removeListenerFromExecutor: (connectionId: TId, eventName: string) => {
    try {
      let existingPlayground = get().getPlayground(connectionId);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        existingPlayground.executor?.removeListener(eventName);
      } else {
        get()?.addErrorLog(connectionId, 'disconnected');
      }
    } catch (error) {
      console.info({
        API: 'socket.removeListener',
        connectionId,
        error,
      });
    }
  },
  removeListenersFromExecutor: (
    connectionId: TId,
    eventNames?: Array<string>
  ) => {
    try {
      let existingPlayground = get().getPlayground(connectionId);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        existingPlayground.executor?.removeListeners(eventNames);
      } else {
        get()?.addErrorLog(connectionId, 'disconnected');
      }
    } catch (error) {
      console.info({
        API: 'socket.removeListeners',
        connectionId,
        error,
      });
    }
  },
  removeAllListenersFromExecutor: (connectionId: TId) => {
    try {
      let existingPlayground = get().getPlayground(connectionId);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        existingPlayground.executor?.removeAllListeners();
      } else {
        get()?.addErrorLog(connectionId, 'disconnected');
      }
    } catch (error) {
      console.info({
        API: 'socket.removeAllListeners',
        connectionId,
        error,
      });
    }
  },
  changeListenerToAllExecutors: (eventName: string, listen: boolean) => {
    let existingPlaygrounds = get().playgrounds;

    for (let connectionId in existingPlaygrounds) {
      try {
        let existingPlayground = existingPlaygrounds[connectionId];
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
          get()?.addErrorLog(connectionId, 'disconnected');
        }
      } catch (error) {
        console.info({
          API: 'socket.changeListenerToAllExecutors',
          connectionId,
          error,
        });
      }
    }
  },
});

export { IHandleConnectionExecutorSlice, createHandleConnectionExecutor };
