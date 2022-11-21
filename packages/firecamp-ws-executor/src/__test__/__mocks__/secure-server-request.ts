import { nanoid } from 'nanoid';
import { ERequestTypes, IWebSocket } from '@firecamp/types';

const WsRequest: IWebSocket = {
  url: {
    raw: 'wss://localhost:3002/api/ws',
  },
  _meta: {
    collectionId: nanoid(),
    id: nanoid(),
  },
  meta: {
    name: '',
    type: ERequestTypes.WebSocket,
    version: '2.0.0',
  },
  config: {
    maxRedirects: 3,
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
};

export default WsRequest;
