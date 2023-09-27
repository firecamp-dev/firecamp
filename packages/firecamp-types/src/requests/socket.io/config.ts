export enum ESocketIOClientVersion {
    v2 = 'v2',
    v3 = 'v3',
    v4 = 'v4'
}

/**
 * #reference https://socket.io/docs/v4/client-options/
 */
export interface ISocketIOConfig {
    /**
     * socket.io client version. Defaults to v3
     */
    version?: ESocketIOClientVersion
    /**
     * If not false a server automatically reject clients with invalid certificates
     * Defaults to false
     */
    rejectUnauthorized?: boolean
    /**
     * delay between each reconnect attempt. Defaults to 3000
     */
    timeout?: number
    /**
     * reconnect on socket connection break. Defaults to false
     */
    reconnection?: boolean
    /**
     * number of reconnection attempts before giving up. Defaults to 3
     */
    reconnectionAttempts?: number
    /**
     * how long to initially wait before attempting a new reconnection. 
     * Defaults to 1000
     */
    reconnectionDelay?: number
    /**
     * maximum amount of time to wait between re-connection. 
     * Defaults to 5000
     */
    reconnectionDelayMax?: number
    /**
     * events start listening on connection open
     */
    onConnectListeners?: string[]
}
