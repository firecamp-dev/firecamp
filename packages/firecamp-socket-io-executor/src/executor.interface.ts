import {
  IUrl,
  ICertificate,
  ISocketIOConfig,
  ISocketIOConnection,
  ISocketIOEmitter,
} from '@firecamp/types';
import { ELogEvents, ILog } from './types';

export interface TExecutorOptions {
  io: any;
  url: IUrl;
  connection: ISocketIOConnection;
  config: ISocketIOConfig;
  certificates?: ICertificate[];
}

export interface IExecutorInterface {
  /**
   * Prepare message log
   *
   * @param title - Title of the Log
   * @param message - Message to display in Log .
   *          when type belongs to [ R, S, ACK ], It's [ { payload, meta: { type, typedArrayView } } ]
   *          when type belongs to [SYS], it's STRING (empty "")
   * @param meta
   */
  log(title: string, message: any, meta: any): ILog;

  /**
   * Add listener on socket
   *
   * @param eventName
   */
  addListener(eventName: string): void;

  /**
   * Add multiple listeners on socket
   *
   * @param eventNames
   */
  addListeners(eventNames: Array<string>): void;

  /**
   * Remove a single active listener from the socket
   *
   * @param eventName
   */
  removeListener(eventName: string): void;

  /**
   * Remove multiple active listeners from the socket
   *
   * @param eventNames
   */
  removeListeners(eventNames: Array<string>): void;

  // Remove all active listeners from the socket
  removeAllListeners(): void;

  /**
   * Prepare the socket emitter payload to emit
   * over the socket server
   *
   * @param eventName
   * @param args
   */
  prepareEmitPayload(
    eventName: string,
    args: ISocketIOEmitter['value']
  ): Promise<any>;

  /**
   * Emit the arguments over the socket on specified event
   *
   * @param eventName
   * @param args
   */
  emit(eventName: string, args: ISocketIOEmitter['value']): Promise<void>;

  /**
   * Emit the arguments over the socket on specified event
   * with listen for the acknowledgement
   *
   * @param eventName
   * @param args
   */
  emitWithAck(
    eventName: string,
    args: ISocketIOEmitter['value']
  ): Promise<void>;

  /**
   * Start ping to the Socket.IO server
   *
   * @param interval
   */
  ping(interval: number): void;

  // Stop ping to the Socket.IO server
  stopPinging(): void;

  // Request to connect with the socket server
  connect(): any;

  // close the connection of the client with the socket server
  close(): void;

  // Unsubscribe from all emitters (subscribe, connectionState)
  unsubscribe(): void;

  // Return socket client id
  socketID(): string;

  // Return the connection is alive or not
  connected(): boolean;

  /**
   * Emit the log on event
   * @param log log payload
   * @param event event name (default: `${connectionId}-${eventName}`)
   */
  emitLog(log: ILog, event: ELogEvents): void;

  /**
   * Listen for connection open via callback
   * @param cb callback function
   */
  onOpen(cb: (log: ILog) => void): void;

  /**
   * Listen for connection close via callback
   * @param cb callback function
   */
  onClose(cb: (log: ILog) => void): void;

  /**
   * Listen for connecting via callback
   * @param cb callback function
   */
  onConnecting(cb: (log: ILog) => void): void;

  /**
   * Listen for common log via callback
   * @param cb callback function
   */
  logs(cb: (log: ILog) => void): void;
}
