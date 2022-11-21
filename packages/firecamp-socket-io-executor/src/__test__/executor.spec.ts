import v2 from 'socket.io-client-v2'
import v3 from 'socket.io-client-v3'
import v4 from 'socket.io-client-v4'
import { nanoid } from 'nanoid'

import Executor from "../"
import { IExecutorInterface } from "../executor.interface"
import { ESocketIOClientVersion } from '@firecamp/types'

let connection: IExecutorInterface
let secureConnection: IExecutorInterface

// TODO: How to access node socket.io-client library
// Initialize the socket.io-client service instance version wise
const io = {
    v2,
    v3,
    v4
}

beforeAll(() => {
    connection = new Executor({
        url: { raw: 'http://localhost:3001' },
        io,
        config: {
            version: ESocketIOClientVersion.v2
        },
        connection: {
            name: '',
            id: nanoid(),
            path: '/api/socket/v2',
            transports: {
                polling: true,
                websocket: true
            }
        }
    })

    // TODO: It should throw error. but its connected via browser socket.io-client lib, which not have mechanism to handle ssl validation
    secureConnection = new Executor({
        url: { raw: 'https://localhost:3002' },
        io,
        config: {
            version: ESocketIOClientVersion.v2,
            reject_unauthorized: false
        },
        connection: {
            name: '',
            id: nanoid(),
            path: '/api/socket/v2',
            transports: {
                polling: true,
                websocket: true
            }
        }
    })
})

describe('Executor instance', () => {
    it('should create connection instance', () => {
        expect(connection).toBeDefined()
    }, 60000)

    it('should create secure connection instance', () => {
        expect(secureConnection).toBeDefined()
    }, 60000)
})

describe('Connection', () => {
    it('should connect to the server', (done) => {
        connection.onOpen(() => done())

        connection.connect()
    }, 60000)

    it('should connect to the secure server', (done) => {
        secureConnection.onOpen(() => done())

        secureConnection.connect()
    }, 60000)
})

// TODO: Unable to handle async response received in subscribe
// TODO: Add test case to check all payload types
// describe('Message passing', () => {
//     it('should pass the emitter via connection', (done) => {
//         connection.subscribe((log: ILog) => {
//             if (log.meta.type === "R") {
//                 expect(log.message.payload).toEqual('hi')
//                 done()
//             }
//         })

//         connection.addListener('message')

//         connection.emit('message', [
//             {
//                 meta: { envelope: '', type: EArgumentType.TEXT },
//                 payload: 'hi'
//             }
//         ])
//     }, 60000)

// })

describe('should disconnect client', () => {
    it('should disconnect local client', (done) => {
        connection.logs(() => done())

        connection.close()
    })

    it('should disconnect secure server client', (done) => {
        secureConnection.logs(() => done())

        secureConnection.close()
    })
})