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
import { TStoreSlice } from '../store.type';

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

const createHandleConnectionExecutor: TStoreSlice<
  IHandleConnectionExecutorSlice
> = (set, get) => ({
  connect: (connectionId: TId) => {
    /**
     * TOODs:
     * 1. Manage and parse environment variables
     * 2. Manager ssl n proxy logic
     */

    if (!connectionId) return;
    const state = get();

    try {
      const url = state.request?.url,
        config = state.request?.config,
        connection = state.request?.connections.find(
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
        console.log({ log });

        if (!log) return;
        state.addLog(connectionId, log);
      });

      // connect
      executor.connect();

      // set executor in to playground
      state.setPlgExecutor(connectionId, executor);

      // listen to on connect listener
      state.listenOnConnect(connectionId);
    } catch (error) {
      console.info({
        API: 'socket.connect',
        connectionId,
        error,
      });
    }
  },

  disconnect: (connectionId: TId, code: number, reason: string) => {
    const state = get();
    try {
      const existingPlayground = state.getPlayground(connectionId);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        // disconnect
        existingPlayground.executor?.close(code, reason);

        // set empty executor
        state.deleteExecutor(connectionId);
      } else {
        state.addErrorLog(connectionId, 'disconnected');
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
    const state = get();
    try {
      /**
       * TODOs:
       * 1. Manage and parse environment variables
       * 2. history
       */

      const existingPlayground = state.getPlayground(connectionId);
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
          existingPlayground.executor.emitWithAck(emitter.name, emitter.value);
        } else {
          existingPlayground.executor.emit(emitter.name, emitter.value);
        }
      } else {
        state.addErrorLog(connectionId, 'disconnected');
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
    const state = get();
    try {
      const existingPlayground = state.getPlayground(connectionId);
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
        state.addErrorLog(connectionId, 'disconnected');
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
    const state = get();
    try {
      const existingPlayground = state.getPlayground(connectionId);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        existingPlayground.executor?.addListener(eventName);
      } else {
        state.addErrorLog(connectionId, 'disconnected');
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
    const state = get();
    try {
      const existingPlayground = state.getPlayground(connectionId);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        existingPlayground.executor?.addListeners(eventNames);
      } else {
        state.addErrorLog(connectionId, 'disconnected');
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
    const state = get();
    try {
      const existingPlayground = state.getPlayground(connectionId);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        existingPlayground.executor?.removeListener(eventName);
      } else {
        state.addErrorLog(connectionId, 'disconnected');
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
    const state = get();
    try {
      const existingPlayground = state.getPlayground(connectionId);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        existingPlayground.executor?.removeListeners(eventNames);
      } else {
        state.addErrorLog(connectionId, 'disconnected');
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
    const state = get();
    try {
      const existingPlayground = state.getPlayground(connectionId);
      if (
        existingPlayground &&
        existingPlayground?.connectionState === EConnectionState.Open &&
        existingPlayground.executor
      ) {
        existingPlayground.executor?.removeAllListeners();
      } else {
        state.addErrorLog(connectionId, 'disconnected');
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
    const state = get();
    const existingPlaygrounds = state.playgrounds;

    for (let connectionId in existingPlaygrounds) {
      try {
        const existingPlayground = existingPlaygrounds[connectionId];
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
          state.addErrorLog(connectionId, 'disconnected');
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
