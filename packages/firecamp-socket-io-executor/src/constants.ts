export enum ELogTypes {
  Send = 's',
  Receive = 'r',
  Ack = 'ack',
  System = 'sys',
  Upgrade= 'upgrade'
}

export enum ELogEvents {
  onOpen = 'onOpen',
  onClose = 'onClose',
  onConnecting = 'onConnecting',
  common = 'common'
}

export enum ELogColors {
  Success = 'success',
  Danger = 'danger',
  Warning = 'warning'
}

export enum ConnectionStatus {
  CONNECTING = 'connecting',
  CONNECT = 'connect',
  CONNECT_ERROR = 'connect_error',
  CONNECT_TIMEOUT = 'connect_timeout',
  ERROR = 'error',
  DISCONNECT = 'disconnect',
  RECONNECT = 'reconnect',
  RECONNECT_ATTEMPT = 'reconnect_attempt',
  RECONNECTING = 'reconnecting',
  RECONNECT_ERROR = 'reconnect_error',
  RECONNECT_FAILED = 'reconnect_failed'
}

export enum EArgumentType {
  Boolean = 'boolean',
  Number = 'number',
  Text = 'text',
  Json = 'json',
  File = 'file',
  ArrayBuffer = 'arraybuffer',
  ArrayBufferView = 'arraybufferview'
}

export enum CustomLogTypes {
  ListenOn = 'L_ON',
  ListenOff = 'L_OFF'
}

export enum EClientVersion {
  v2 = 'v2',
  v3 = 'v3',
  v4 = 'v3'
}