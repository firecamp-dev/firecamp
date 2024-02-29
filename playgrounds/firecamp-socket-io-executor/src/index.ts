import v2 from 'socket.io-client-v2';
import v3 from 'socket.io-client-v3';
import v4 from 'socket.io-client-v4';

import Executor from './executor';
export default Executor;

export * from './executor.interface';
export * from './types';

export { v2 as SocketIOv2, v3 as SocketIOv3, v4 as SocketIOv4 };
