import Executor, {
  IExecutorInterface,
  TExecutorOptions,
} from '@firecamp/socket.io-executor/dist/esm';
import { ISocketIOEmitter, EFirecampAgent } from '@firecamp/types';
import { _env, _misc, _object } from '@firecamp/utils';
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
    const { playground } = state;

    if (
      ![EConnectionState.Ideal, EConnectionState.Closed].includes(
        playground.connectionState
      )
    ) {
      return;
    }

    try {
      const { url, config, connection } = state.request;
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

      const vars = state.context.environment.getPlainVariables();
      const _ops = _env.applyVariablesInSource(vars, options);

      const executor: IExecutorInterface =
        _misc.firecampAgent() === EFirecampAgent.Desktop
          ? window.fc.io(_ops)
          : new Executor(_ops);

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

      // set executor in playground
      state.setPlgExecutor(executor);

      // listen to on connect listener
      // state.listenOnConnect();
    } catch (e) {
      console.info(e);
    }
  },

  disconnect: () => {
    const state = get();
    const { playground } = state;
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

      const { connectionState, emitter, executor } = state.playground;
      if (connectionState != EConnectionState.Open || !executor) {
        state.addErrorLog('The connection is not open');
        return;
      }

      const vars = state.context.environment.getPlainVariables();
      const emtName = _env.applyVariablesInSource(vars, emitter.name);
      const emtValue = _env.applyVariablesInSource(vars, emitter.value);

      // send emitter
      if (emitter?.__meta.ack) {
        executor.emitWithAck(emtName, emtValue);
      } else {
        executor.emit(emtName, emtValue);
      }
    } catch (e) {
      console.info(e);
    }
  },

  togglePingConnection: (pinging: true, interval: number) => {
    const state = get();
    try {
      const { connectionState, executor } = state.playground;
      if (connectionState != EConnectionState.Open) {
        state.addErrorLog('The connection is not open');
        return;
      }
      if (pinging) {
        // ping
        executor?.ping(interval);
      } else {
        executor?.stopPinging();
      }
    } catch (e) {
      console.info(e);
    }
  },

  addListenersToExecutor: (eventNames: string | string[]) => {
    const state = get();
    try {
      const { connectionState, executor } = state.playground;
      if (connectionState != EConnectionState.Open) {
        state.addErrorLog('The connection is not open');
        return;
      }
      const names = Array.isArray(eventNames) ? eventNames : [eventNames];
      executor?.addListeners(names);
    } catch (e) {
      console.info(e);
    }
  },

  removeListenersFromExecutor: (eventNames) => {
    const state = get();
    try {
      const { connectionState, executor } = state.playground;
      if (connectionState != EConnectionState.Open) {
        state.addErrorLog('The connection is not open');
        return;
      }
      const names = Array.isArray(eventNames) ? eventNames : [eventNames];
      executor?.removeListeners(names);
    } catch (e) {
      console.info(e);
    }
  },
  removeAllListenersFromExecutor: () => {
    const state = get();
    try {
      const { connectionState, executor } = state.playground;
      if (connectionState != EConnectionState.Open) {
        state.addErrorLog('The connection is not open');
        return;
      }
      executor?.removeAllListeners();
    } catch (e) {
      console.info(e);
    }
  },
});

export { IHandleConnectionExecutorSlice, createHandleConnectionExecutor };
