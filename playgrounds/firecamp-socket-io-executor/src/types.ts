import { EArgumentBodyType, ETypedArrayView, TId } from '@firecamp/types';

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

export enum ELogColors {
  Success = 'success',
  Danger = 'danger',
  Warning = 'warning',
}

// SocketIo log
export interface ILog {
  title: string;
  value: {
    value: string;
    type: EArgumentBodyType;
    typedArrayView?: ETypedArrayView;
  }[];
  __meta: {
    event: string;
    timestamp: number;
    type: ELogTypes;
    color: ELogColors;
    ackRef: any;
    length?: string;
  };
  __ref: {
    id: TId;
  };
}

export enum CustomLogTypes {
  ListenOn = 'Listening to',
  ListenOff = 'Listening off',
}

export enum EConnectionStatus {
  Connecting = 'connecting',
  Connect = 'connect',
  ConnectError = 'connect_error',
  ConnectTimeout = 'connect_timeout',
  SocketError = 'error',
  Disconnect = 'disconnect',
  Reconnect = 'reconnect',
  ReconnectAttempt = 'reconnect_attempt',
  Reconnecting = 'reconnecting',
  ReconnectError = 'reconnect_error',
  ReconnectFailed = 'reconnect_failed',
}
