import { ERequestTypes, IUrl, TId } from '../../common'
import { IMeta, IRef } from '../common'
import { ISocketIOConfig } from './config'
import { ISocketIOConnection } from './connection'
import { ISocketIOListener } from './listener'

export interface ISocketIO {

    /**
     * request endpoint
     */
    url: IUrl

    config?: ISocketIOConfig
    /**
    * socket.io connection
    */
    connection: ISocketIOConnection
    /**
     * listener event list
     */
    listeners?: ISocketIOListener[]
    /**
     * metadata about request
     */
    __meta: Omit<IMeta, 'type' | 'version'> & {
        /**
         * request type
         */
        type: ERequestTypes.SocketIO
        /**
         * request version
         */
        version: '2.0.0'
        /**
         * request dir orders
         */
        fOrders?: TId[]
        /**
         * request dir orders
         */
        iOrders?: TId[]
    }
    /**
     * request reference info.
     */
    __ref: IRef
}