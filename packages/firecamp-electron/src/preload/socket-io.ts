import SocketIOExecutor, {
  SocketIOv2,
  SocketIOv3,
  SocketIOv4,
  TExecutorOptions,
  IExecutorInterface,
} from '@firecamp/socket.io-executor/dist/cjs';

// holds the WebSocket and Socket.IO connections
const Executors = new Map();
export const PreloadSocketIO = (
  config: TExecutorOptions
): Omit<
  IExecutorInterface,
  'log' | 'emitLog' | 'prepareEmitPayload' | 'unsubscribe'
> => {
  const { id } = config.connection;
  Executors.set(
    id,
    new SocketIOExecutor({
      ...config,
      io: { v2: SocketIOv2, v3: SocketIOv3, v4: SocketIOv4 },
    })
  );

  return {
    connect() {
      const executor = Executors.get(id);
      if (!executor) return;
      executor.connect();
      Executors.set(id, executor);
    },
    socketID() {
      const executor = Executors.get(id);
      if (!executor) return;
      return executor.socketID();
    },
    addListener(eventName: string) {
      const executor = Executors.get(id);
      if (!executor) return;
      executor.addListener(eventName);
      Executors.set(id, executor);
    },
    addListeners(eventNames: string[]) {
      const executor = Executors.get(id);
      if (!executor) return;
      executor.addListeners(eventNames);
      Executors.set(id, executor);
    },
    removeListener(eventName: string) {
      const executor = Executors.get(id);
      if (!executor) return;
      executor.removeListener(eventName);
      Executors.set(id, executor);
    },
    removeListeners(eventNames: string[]) {
      const executor = Executors.get(id);
      if (!executor) return;
      executor.removeListeners(eventNames);
      Executors.set(id, executor);
    },
    removeAllListeners() {
      const executor = Executors.get(id);
      if (!executor) return;
      executor.removeAllListeners();
      Executors.set(id, executor);
    },
    connected() {
      const executor = Executors.get(id);
      if (!executor) return;
      return executor?.connected();
    },
    async emit(eventName: string, args: any[]) {
      const executor = Executors.get(id);
      if (!executor) return;
      await executor.emit(eventName, args);
    },
    async emitWithAck(eventName: string, args: any[]) {
      const executor = Executors.get(id);
      if (!executor) return Promise.resolve();
      await executor.emitWithAck(eventName, args);
    },
    ping(interval: number) {
      const executor = Executors.get(id);
      if (!executor) return;
      executor.ping(interval);
      Executors.set(id, executor);
    },
    stopPinging() {
      const executor = Executors.get(id);
      if (!executor) return;
      executor.stopPinging();
      Executors.set(id, executor);
    },
    close() {
      const executor = Executors.get(id);
      if (!executor) return;
      executor.close();
      Executors.delete(id);
    },
    onOpen(cb: any) {
      const executor: IExecutorInterface = Executors.get(id);
      if (!executor) return;
      executor.onOpen(cb);
    },
    onClose(cb: any) {
      const executor: IExecutorInterface = Executors.get(id);
      if (!executor) return;
      executor.onClose(cb);
    },
    onConnecting(cb: any) {
      const executor: IExecutorInterface = Executors.get(id);
      if (!executor) return;
      executor.onConnecting(cb);
    },
    logs(cb: any) {
      const executor: IExecutorInterface = Executors.get(id);
      if (!executor) return;
      executor.logs(cb);
    },
  };
};
