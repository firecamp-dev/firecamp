import Executor, {
  IExecutorInterface,
  TExecutorOptions,
} from '@firecamp/socket.io-executor/dist/esm';
import { ISocketIOEmitter, EFirecampAgent } from '@firecamp/types';
import { _misc, _object } from '@firecamp/utils';
import v2 from 'socket.io-client-v2';
import v3 from 'socket.io-client-v3';
import v4 from 'socket.io-client-v4';
import { TStoreSlice } from '../store.type';
import { EConnectionState } from '../../types';

interface IHandleConnectionExecutorSlice {
  connect: () => void;
  disconnect: (code?: number, reason?: string) => void;
  emit: (emitter: ISocketIOEmitter) => void;
  togglePingConnection: (pinging: boolean, interval: number) => void;
  addListenersToExecutor: (eventNames: string | string[]) => void;
  removeListenersFromExecutor: (eventNames?: string | string[]) => void;
  removeAllListenersFromExecutor: () => void;
}

const createHandleConnectionExecutor: TStoreSlice<
  IHandleConnectionExecutorSlice
> = (set, get) => ({
  connect: () => {
    /**
     * TOODs:
     * 1. Manage and parse environment variables
     * 2. Manager ssl n proxy logic
     */
    const state = get();
    const conId = state.getActiveConnectionId();
    const playground = state.getPlayground();

    if (
      ![EConnectionState.Ideal, EConnectionState.Closed].includes(
        playground.connectionState
      )
    ) {
      return;
    }

    try {
      const url = state.request?.url,
        config = state.request?.config,
        connection = state.request?.connections.find((c) => c.id === conId);

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
        state.changePlaygroundConnectionState(EConnectionState.Open);
      });

      // on close
      executor.onClose(() => {
        state.changePlaygroundConnectionState(EConnectionState.Closed);
      });

      // on reconnect
      executor.onConnecting(() => {
        state.changePlaygroundConnectionState(EConnectionState.Connecting);
      });

      // get logs
      executor.logs((log) => {
        console.log({ log });

        if (!log) return;
        state.addLog(log);
      });

      // connect
      executor.connect();

      // set executor in to playground
      state.setPlgExecutor(executor);

      // listen to on connect listener
      // state.listenOnConnect();
    } catch (e) {
      console.info(e);
    }
  },

  disconnect: () => {
    const state = get();
    const playground = state.getPlayground();
    if (
      ![EConnectionState.Connecting, EConnectionState.Open].includes(
        playground.connectionState
      )
    ) {
      state.addErrorLog('The connection is not open');
      return;
    }

    try {
      // disconnect
      playground.executor?.close();
      // set empty executor
      state.deleteExecutor();
    } catch (e) {
      console.info(e);
    }
  },

  emit: (emitter: ISocketIOEmitter) => {
    const state = get();
    try {
      /**
       * TODOs:
       * 1. Manage and parse environment variables
       */

      const playground = state.getPlayground();
      if (
        playground?.connectionState != EConnectionState.Open ||
        !playground.executor
      ) {
        state.addErrorLog('The connection is not open');
        return;
      }
      // send emitter
      if (emitter?.__meta.ack) {
        playground.executor.emitWithAck(emitter.name, emitter.value);
      } else {
        playground.executor.emit(emitter.name, emitter.value);
      }
    } catch (e) {
      console.info(e);
    }
  },

  togglePingConnection: (pinging: true, interval: number) => {
    const state = get();
    try {
      const playground = state.getPlayground();
      if (playground?.connectionState != EConnectionState.Open) {
        state.addErrorLog('The connection is not open');
        return;
      }
      if (pinging) {
        // ping
        playground.executor?.ping(interval);
      } else {
        playground.executor?.stopPinging();
      }
    } catch (e) {
      console.info(e);
    }
  },

  addListenersToExecutor: (eventNames: string | string[]) => {
    const state = get();
    try {
      const playground = state.getPlayground();
      if (playground?.connectionState != EConnectionState.Open) {
        state.addErrorLog('The connection is not open');
        return;
      }
      const names = Array.isArray(eventNames) ? eventNames : [eventNames];
      playground.executor?.addListeners(names);
    } catch (e) {
      console.info(e);
    }
  },

  removeListenersFromExecutor: (eventNames) => {
    const state = get();
    try {
      const playground = state.getPlayground();
      if (playground?.connectionState != EConnectionState.Open) {
        state.addErrorLog('The connection is not open');
        return;
      }
      const names = Array.isArray(eventNames) ? eventNames : [eventNames];
      playground.executor?.removeListeners(names);
    } catch (e) {
      console.info(e);
    }
  },
  removeAllListenersFromExecutor: () => {
    const state = get();
    try {
      const playground = state.getPlayground();
      if (playground?.connectionState != EConnectionState.Open) {
        state.addErrorLog('The connection is not open');
        return;
      }
      playground.executor?.removeAllListeners();
    } catch (e) {
      console.info(e);
    }
  },
});

export { IHandleConnectionExecutorSlice, createHandleConnectionExecutor };
