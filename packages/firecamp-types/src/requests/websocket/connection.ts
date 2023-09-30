import { IHeader, IQueryParam } from '../../common';
import { TId } from '../../common/general';

/**
 * websocket request connection. where each connection
 * work as a separate websocket client
 */
export interface IWebSocketConnection {
  /**
   * connection id
   * @deprecated
   */
  id: TId;
  /**
   * connection wise headers list
   */
  headers?: IHeader[];
  /**
   * connection wise query params list
   */
  queryParams?: IQueryParam[];
  /**
   * whether connection is default or not
   * note: key exist only in default connection
   */
  isDefault?: boolean;
  /**
   * websocket connection name
   */
  name: string;
  /**
   * whether to start sending ping event on connection open or not
   * Defaults to false
   */
  ping?: boolean;
  /**
   * interval between each ping fire
   */
  pingInterval?: number;

}
