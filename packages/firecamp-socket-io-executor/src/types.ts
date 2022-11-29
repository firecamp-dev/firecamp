import { ETypedArrayView, ISocketIOEmitter } from '@firecamp/types';
import { EArgumentType } from './constants';

export interface IEmitterArgument {
  payload: any;
  meta: {
    type: EArgumentType;
    typedArrayView: '' | ETypedArrayView;
  };
}

// Socket.IO message payload for Firecamp request
export interface IEmitter {
  name: string; // Emitter name,
  body: Array<IEmitterArgument>;
}

// WebSocket log
export interface ILog {
  title: string;
  message: ISocketIOEmitter;
  meta: {
    id: string;
    event: string;
    timestamp: number;
    type: 'R' | 'S' | 'ACK' | 'SYS';
    color: 'success' | 'danger';
    ackRef: any;
  };
}
