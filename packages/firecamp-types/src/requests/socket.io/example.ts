import { IUrl } from '../..';
import { TId } from '../../common/general';
import { ESocketIOClientVersion } from './config';
import { ISocketIOConnection } from './connection';
import { IArgument, ISocketIOEmitter } from './emitter';

/**
 * listener example
 */
export interface IListenerExample {
  /**
   * listener arguments list
   */
  value?: IArgument[];
  /**
   * metadata of the listener
   */
  __meta?: {
    description?: string;
  };
  /**
   * reference info. of listener
   */
  __ref: {
    id: TId;
  };
}

/**
 * emitter example
 */
export interface IEmitterExample
  extends Omit<ISocketIOEmitter, '__ref' | '__meta'> {
  /**
   * metadata of the emitter
   */
  __meta?: {
    /**
     * emitter label, extra info.
     */
    label: string;
    /**
     * default: false, whether ack return by server or not
     */
    ack: boolean;
    description?: string;
  };
  /**
   * reference info. of emitter
   */
  __ref: {
    id: TId;
  };
}

/**
 * socket.io request example
 */
export interface ISocketIOExample {
  /**
   * connection configuration
   */
  connection: ISocketIOConnection;
  /**
   * connection endpoint
   */
  url: IUrl;
  /**
   * socket.io emitters examples
   */
  emitters: ISocketIOEmitter[];
  /**
   * socket.io listeners examples
   */
  listeners: IListenerExample[];
  /**
   * socket.io example setting
   */
  config: {
    /**
     * socket.io-client version
     */
    version: ESocketIOClientVersion | ESocketIOClientVersion.v4;
  };
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
