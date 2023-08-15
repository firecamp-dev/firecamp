import { EMessageBodyType, ETypedArrayView, TId } from '@firecamp/types';

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
  value: {
    value: string;
    type: EMessageBodyType;
    typedArrayView?: ETypedArrayView;
  };
  __meta: {
    event: string;
    type: ELogTypes;
    color: ELogColors;
    ackRef: any;
    // message length
    length?: string;
    timestamp: number;
  };
  __ref: {
    id: TId;
  };
}
