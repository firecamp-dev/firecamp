import { ERequestTypes, TId } from '../../common'
import { IWebSocket, IWebSocketConnection, IWebSocketMessage } from '../../requests'
import { Header } from '../header'
import { QueryParam, Url } from '../url'

/**
 * websocket message
 */
export interface WebSocketMessage extends Omit<IWebSocketMessage, '__ref'> {
    /**
     * reference info for leaf
     */
    __ref: {
        id: TId,
        requestId: TId
        requestType: ERequestTypes.WebSocket
        folderId?: TId
    }
}

/**
 * websocket connection
 */
export interface WebSocketConnection extends Omit<IWebSocketConnection, 'id' | 'headers' | 'queryParams'> {
    headers?: Header[]
    queryParams?: QueryParam[]
}

/**
 * WebSocket request for export collection
 */
export interface WebSocket extends Omit<IWebSocket, '__ref' | 'url' | 'connection'> {
    /**
     * request url
     */
    url: Url
    /**
     * websocket connection 
     */
    connection: WebSocketConnection
    __ref: {
        id: TId
        folderId?: TId
    }
}
