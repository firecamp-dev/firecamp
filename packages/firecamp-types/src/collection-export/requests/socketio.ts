import { ERequestTypes, TId } from '../../common'
import { ISocketIO, ISocketIOConnection, ISocketIOEmitter } from '../../requests'
import { Header } from '../header'
import { QueryParam, Url } from '../url'

export interface SocketIOEmitter extends Omit<ISocketIOEmitter, '__ref'> {
    /**
     * reference info for leaf
     */
    __ref: {
        id: TId,
        requestId: TId
        requestType: ERequestTypes.SocketIO
        folderId?: TId
    }
}

export interface SocketIOConnection extends Omit<ISocketIOConnection, 'id' | 'headers' | 'queryParams'> {
    headers: Header[]
    queryParams: QueryParam[]
    auth: Header[]
}

/**
 * SocketIO request for export collection
 */
export interface SocketIO extends Omit<ISocketIO, '__ref' | 'url' | 'connection'> {
    /** request url */
    url: Url
    connection: SocketIOConnection
    __ref: {
        id: TId
        folderId?: TId
    }
}
