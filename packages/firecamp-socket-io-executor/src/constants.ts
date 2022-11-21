export enum ELogTypes {
  SEND = 'S',
  RECEIVE = 'R',
  ACK = 'ACK',
  SYSTEM = 'SYS',
  UPGRADE = 'upgrade'
}

export enum ELogEvents {
  onOpen = 'onOpen',
  onClose = 'onClose',
  onConnecting = 'onConnecting',
  common = 'common'
}

export enum ELogColors {
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning'
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
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  TEXT = 'text',
  JSON = 'json',
  FILE = 'file',
  ARRAY_BUFFER = 'arraybuffer',
  ARRAY_BUFFER_VIEW = 'arraybufferview'
}

export enum CustomLogTypes {
  LISTEN_ON = 'L_ON',
  LISTEN_OFF = 'L_OFF'
}

export enum EClientVersion {
  v2 = 'v2',
  v3 = 'v3',
  v4 = 'v3'
}