import { nanoid } from 'nanoid'
import { ERequestTypes, IWebSocket } from '@firecamp/types'

export default {
    url: {
        raw: 'wss://localhost:3002/api/ws'
    },
    _meta: {
        collection_id: nanoid(),
        id: nanoid(),
    },
    meta: {
        name: '',
        type: ERequestTypes.WebSocket
    },
    connections: [
        {
            id: nanoid(),
            name: 'Default',
            config: {
                ping: false,
                ping_interval: 3000
            }
        }
    ]
} as IWebSocket