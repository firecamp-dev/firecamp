import { ERequestTypes, IUrl, TId } from '../../common'
import { IWebSocketConfig } from './config'
import { IMeta, IRef } from '../common'
import { IWebSocketConnection } from './connection'

/**
 * WebSocket request
 */
export interface IWebSocket {
    /** request endpoint */
    url: IUrl
    /**
     * websocket request config
     * reference: https://github.com/websockets/ws/blob/HEAD/doc/ws.md#new-websocketaddress-protocols-options
     */
    config?: IWebSocketConfig
    /**
     * websocket connection 
     */
    connection: IWebSocketConnection

    /**
     * metadata about request
     */
    __meta: Omit<IMeta, 'type' | 'version'> & {
        /** request type */
        type: ERequestTypes.WebSocket
        /** request version */
        version: '2.0.0'
        /** request dir orders */
        fOrders?: TId[]
        /**
         * request item orders
         * @deprecated use iOrders instead. 
         * */
        leafOrders?: TId[]
        /** alias of leafOrders */
        iOrders?: TId[]
    }
    /**
     * request reference info.
     */
    __ref: IRef
}