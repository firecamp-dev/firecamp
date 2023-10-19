import { Rest, SocketIO, GraphQL, WebSocket, File } from '..'

export * from './file'
export * from './graphql'
export * from './rest'
export * from './socketio'
export * from './websocket'

/**
 * types of request supported
 */
export type Request = Rest | WebSocket | SocketIO | GraphQL | File
