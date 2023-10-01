import Executor, {
  IExecutor,
  TExecutorOptions,
} from '@firecamp/ws-executor/dist/esm';
import { IWebSocketMessage, EFirecampAgent } from '@firecamp/types';
import { _env, _misc, _object } from '@firecamp/utils';
import { EConnectionState } from '../../types';
import { TStoreSlice } from '../store.type';

interface IHandleConnectionExecutorSlice {
  connect: () => void;
  disconnect: (code?: number, reason?: string) => void;
  sendMessage: () => void;
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

    try {
      const state = get();
      const { url, config, connection } = state.request;

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

      const vars = state.context.environment.getPlainVariables();
      const _ops = _env.applyVariablesInSource(vars, options);

      const executor: IExecutor =
        _misc.firecampAgent() === EFirecampAgent.Desktop
          ? // @ts-ignore
            window.fc.websocket(_ops)
          : new Executor(_ops);

      // console.log(_misc.firecampAgent(), executor);

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
        if (!log) return;
        state.addLog(log);
      });

      // connect
      executor.connect();

      // set executor in playground
      state.setPlaygroundExecutor(executor);
    } catch (error) {
      console.info({
        API: 'websocket.connect',
        error,
      });
    }
  },

  disconnect: (code: number, reason: string) => {
    try {
      const state = get();
      const { playground } = state;
      if (
        playground &&
        playground.executor &&
        playground.connectionState === EConnectionState.Open
      ) {
        // disconnect
        playground.executor?.disconnect(code, reason);

        // set empty executor
        state.deleteExecutor();
      }
    } catch (error) {
      console.info({
        API: 'websocket.disconnect',
        error,
      });
    }
  },

  sendMessage: () => {
    try {
      /**
       * TODOs:
       * 1. Manage and parse environment variables
       * 2. history
       */
      const state = get();
      const { playground } = state;
      if (
        playground &&
        playground.executor &&
        playground.connectionState === EConnectionState.Open
      ) {
        // TODO: check if connection open or not. if not then executor will send log with error message
        const { message } = playground;
        const _message = _object.omit(message, ['path']) as IWebSocketMessage;
        // console.log({ _message }, 'send message');

        const vars = state.context.environment.getPlainVariables();
        const _msg = _env.applyVariablesInSource(vars, _message);
        // send message
        playground.executor.send(_msg);
      }
    } catch (e) {
      console.error({ action: 'websocket.send', e });
    }
  },
});

export { IHandleConnectionExecutorSlice, createHandleConnectionExecutor };
