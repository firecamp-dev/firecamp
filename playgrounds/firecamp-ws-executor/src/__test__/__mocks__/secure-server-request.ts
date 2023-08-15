import { nanoid } from 'nanoid';
import { ERequestTypes, IWebSocket } from '@firecamp/types';

const WsRequest: IWebSocket = {
  url: {
    raw: 'wss://localhost:3002/api/ws',
  },
  config: {
    maxRedirects: 3,
  },
  connection: {
    id: nanoid(),
    name: 'Default',
    ping: false,
    pingInterval: 3000,
  },
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
