import { nanoid } from 'nanoid';
import { ERequestTypes, IWebSocket } from '@firecamp/types';

export default {
  url: {
    raw: 'ws://localhost:3001/api/ws',
  },
  _meta: {
    collectionId: nanoid(),
    id: nanoid(),
  },
  meta: {
    name: '',
    type: ERequestTypes.WebSocket,
  },
  connections: [
    {
      id: nanoid(),
      name: 'Default',
      config: {
        ping: false,
        pingInterval: 3000,
      },
    },
  ],
} as IWebSocket;
