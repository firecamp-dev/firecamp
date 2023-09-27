import { ETypedArrayView, IUrl } from '../..';
import { TId } from '../../common/general';
import { IWebSocketConnection } from './connection';
import { EMessageBodyType, IWebSocketMessage } from './message';

/**
 * websocket message example
 */
export interface IMessageExample
  extends Omit<IWebSocketMessage, '__ref' | '__meta'> {
  /**
   * metadata of the message
   */
  __meta?: {
    type: EMessageBodyType;
    typedArrayView: ETypedArrayView;
    description?: string;
  };
  /**
   * reference info. of message
   */
  __ref: {
    id: TId;
  };
}

export interface IWebSocketExample {
  /**
   * connection configuration
   */
  connection: IWebSocketConnection;
  /**
   * connection endpoint
   */
  url: IUrl;
  /**
   * websocket messages
   */
  messages: IMessageExample[];
  /**
   * example reference info
   */
  __ref: {
    /**
     * example id
     */
    id: TId;
  };
}
