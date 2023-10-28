import { IHeader, IQueryParam, TId } from '../../common'

/**
 * socket.io request connection. where each connection 
 * work as a separate socket.io client
 * 
 * @reference https://socket.io/docs/v3/client-api/#new-managerurl-options
 */
export interface ISocketIOConnection {
    /**
    * connection id
    * @deprecated
    */
    id?: TId
    /**
     * whether connection is default or not
     * note: key exist only in default connection
     */
    isDefault?: boolean
    /**
     * whether to reuse an existing connection. Defaults to false
     */
    forceNew?: boolean
    /**
     * socket.io connection name
     */
    name: string
    /**
     * communication channel that allows you to split the logic of your application over a single shared connection.
     * #reference https://socket.io/docs/v2/namespaces/
     */
    namespace?: string
    /**
     * name of the path that is captured on the server side.
     * Defaults to '/socket.io'
     */
    path?: string
    /**
         * whether to start sending ping event on connection open or not
         * Defaults to false
         */
    ping?: boolean
    /**
     * interval between each ping fire
     */
    pingInterval?: number
    /**
     * a list of transports to try (in order). Engine always attempts to connect directly with the first one,
     * provided the feature detection test for it passes.
     */
    transports?: {
        /**
         * defaults to true
         */
        websocket?: boolean
        /**
         * defaults to true
         */
        polling?: boolean
    }
    /**
     * connection wise headers list
     */
    headers?: IHeader[]
    /**
     * connection wise query params list
     */
    queryParams?: IQueryParam[]
    /**
     * connection wise auth list. support in client version >= 3
     */
    auth?: IHeader[]
}