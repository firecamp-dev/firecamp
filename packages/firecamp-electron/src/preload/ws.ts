import * as WebSocket from 'ws';
import WebSocketExecutor, {
  IExecutor,
  TExecutorOptions,
} from '@firecamp/ws-executor/dist/cjs';
import { EOAuth2Types, IRest, IWebSocketMessage, TId } from '@firecamp/types';

// holds the WebSocket and Socket.IO connections
const Executors = new Map();
export const PreloadWS = (options: TExecutorOptions): IExecutor => {
  Executors.set(
    options.connection.id,
    new WebSocketExecutor({ ...options, WebSocket })
  );

  return {
    connect() {
      const executor: IExecutor = Executors.get(options.connection.id);
      executor.connect();
      Executors.set(options.connection.id, executor);
    },
    connected() {
      const executor: IExecutor = Executors.get(options.connection.id);
      return executor?.connected();
    },
    readyState() {
      const executor: IExecutor = Executors.get(options.connection.id);
      return executor.readyState();
    },
    async send(message: IWebSocketMessage) {
      const executor: IExecutor = Executors.get(options.connection.id);
      await executor.send(message);
      return Promise.resolve();
    },
    ping(interval: number) {
      const executor: IExecutor = Executors.get(options.connection.id);
      executor.ping(interval);
      Executors.set(options.connection.id, executor);
    },
    stopPinging() {
      const executor: IExecutor = Executors.get(options.connection.id);
      executor.stopPinging();
      Executors.set(options.connection.id, executor);
    },
    logs(cb) {
      const executor: IExecutor = Executors.get(options.connection.id);
      executor.logs(cb);
    },
    onClose(cb) {
      const executor: IExecutor = Executors.get(options.connection.id);
      executor.onClose(cb);
    },
    onConnecting(cb) {
      const executor: IExecutor = Executors.get(options.connection.id);
      executor.onConnecting(cb);
    },
    onOpen(cb) {
      const executor: IExecutor = Executors.get(options.connection.id);
      executor.onOpen(cb);
    },
    disconnect(code: number, reason: string) {
      const executor: IExecutor = Executors.get(options.connection.id);
      executor.disconnect(code, reason);
      Executors.delete(options.connection.id);
    },
  };
};
