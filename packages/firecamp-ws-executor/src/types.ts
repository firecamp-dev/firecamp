import {
  EEnvelope,
  EMessageBodyType,
  IWebSocketMessage,
} from '@firecamp/types';
import { ELogColors, ELogTypes } from './constants';

// WebSocket log
export interface ILog {
  title: string;
  message: Omit<IWebSocketMessage, 'name' | '__ref'>;
  __meta: {
    event: string;
    timestamp: number;
    type: ELogTypes;
    color: ELogColors;
    ackRef: any;
    // Message length
    length: string;
  };
  __ref: {
    id: string;
  };
}

// WebSocket received message
export interface IWebSocketResponseMessage {
  body: any;
  meta: {
    type: EMessageBodyType;
    envelope?: EEnvelope;
  };
}
