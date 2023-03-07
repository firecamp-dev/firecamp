import {
  ETypedArrayView,
  EMessageBodyType,
  IWebSocketMessage,
  TId,
} from '@firecamp/types';

export enum ELogColors {
  Success = 'success',
  Danger = 'danger',
}

export enum ELogTypes {
  Send = 's',
  Receive = 'r',
  Ack = 'ack',
  System = 'sys',
  Upgrade = 'upgrade',
}

export enum ELogEvents {
  onOpen = 'onOpen',
  onClose = 'onClose',
  onConnecting = 'onConnecting',
  common = 'common',
}

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
    length?: string;
  };
  __ref: {
    id: TId;
  };
}

// WebSocket received message
export interface IWebSocketResponseMessage {
  value: string;
  __meta: {
    type: EMessageBodyType;
    typedArrayView?: ETypedArrayView;
  };
}
