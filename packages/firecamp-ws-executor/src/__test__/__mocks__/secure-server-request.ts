import { nanoid } from 'nanoid';
import { ERequestTypes, IWebSocket } from '@firecamp/types';

const WsRequest: IWebSocket = {
  url: {
    raw: 'wss://localhost:3002/api/ws',
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
  __meta: {
    name: '',
    type: ERequestTypes.WebSocket,
    version: '2.0.0',
  },
  __ref: {
    collectionId: nanoid(),
    id: nanoid(),
  },
};

export default WsRequest;
