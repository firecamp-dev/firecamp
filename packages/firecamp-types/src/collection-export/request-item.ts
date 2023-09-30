import { WebSocketMessage, SocketIOEmitter, GraphQLPlayground } from '.'

/**
 * request items, which contains request data which transfers between server and client
 * like, in REST it's body, WebSocket it's message
 */
export type RequestItem = WebSocketMessage | SocketIOEmitter | GraphQLPlayground
