import {
  IUrl,
  IWebSocketConfig,
  IWebSocketConnection,
  ICertificate,
  IWebSocketMessage,
} from '@firecamp/types';
import { ILog } from './types';

export type TExecutorOptions = {
  url: IUrl;
  config?: IWebSocketConfig;
  connection: IWebSocketConnection;
  certificates: ICertificate[];
  WebSocket: any;
};

export interface IExecutor {
  // Request to connect with the socket server
  connect(): any;

  // Callback func. called when the socket connection open
  onOpen(cb: (log: ILog) => void): void;

  // Callback func. called when the socket connection close
  onClose(cb: (log: ILog) => void): void;

  // Callback func. called when socket connection trying to connect
  onConnecting(cb: (log: ILog) => void): void;

  /**
   * Callback func. called when common actions fired, like
   * - message sent
   * - message received
   * - error
   * @param cb
   */
  logs(cb: (log: ILog) => void): void;

  /**
   * disconnect the socket connection
   * @param code status code
   * @param reason reason to close the connection
   */
  disconnect(code?: number, reason?: string): void;

  // Return the boolean value by checking connection is open or not
  connected(): boolean;

  // return the ready state of the connection
  readyState(): number;

  // send the websocket message to the server
  send(message: IWebSocketMessage): Promise<void>;

  // request to ping to the socket server
  ping(interval: number): void;

  // stop ping to the socket server
  stopPinging(): void;
}
