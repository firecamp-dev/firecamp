/**
 * websocket request config
 * @reference https://github.com/websockets/ws/blob/HEAD/doc/ws.md#new-websocketaddress-protocols-options
 */
 export interface IWebSocketConfig {
    /**
     * The list of subprotocols.
     */
    protocols?: string | Array<string>;
    /**
     * reconnect on socket connection break. Defaults to false
     */
    reconnect?: boolean;
    /**
     * how many time reconnect attempts perform. Defaults to 3
     */
    reconnectAttempts?: number;
    /**
     * delay between each reconnect attempt. Defaults to 3000
     */
    reconnectTimeout?: number;
    /**
     * If not false a server automatically reject clients with invalid certificates
     * Defaults to false
     */
    rejectUnauthorized?: boolean;
    /**
     * Whether or not to follow redirects. Defaults to false.
     */
    followRedirects?: boolean;
    /**
     * Timeout in milliseconds for the handshake request. This is reset after every redirection.
     */
    handshakeTimeout?: number;
    /**
     * The maximum number of redirects allowed. Defaults to 10.
     */
    maxRedirects?: number;
    /**
     * Value of the Sec-WebSocket-Version header. Defaults to 13
     */
    protocolVersion?: number;
    /**
     * Value of the Origin or Sec-WebSocket-Origin header depending on the protocolVersion.
     */
    origin?: string;
    /**
     * The maximum allowed message size in bytes.
     */
    maxPayload?: number;
}
