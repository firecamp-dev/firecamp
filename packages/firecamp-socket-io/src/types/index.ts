export enum EEmitterPayloadTypes {
  Text = 'text',
  Json = 'json',
  File = 'file',
  ArrayBuffer = 'arraybuffer',
  ArrayBufferView = 'arraybufferview',
  Number = 'number',
  Boolean = 'boolean',
  None = 'none',
}

export enum EConnectionState {
  Ideal = -1,
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

export enum ELogTypes {
  Send = 's',
  Receive = 'r',
  Ack = 'ack',
  System = 'sys',
}

export enum ELogColors {
  Success = 'success',
  Danger = 'danger',
  Warning = 'warning',
}

export enum EReqChangeMetaKeys {
  name = 'name',
  description = 'description',
  iOrders = 'iOrders',
  fOrders = 'fOrders',
}

export enum EReqChangeUrlKeys {
  raw = 'raw',
  queryParams = 'queryParams',
  pathParams = 'pathParams',
}

export enum EReqChangeConfigKeys {
  version = 'version',
  defaultConnection = 'defaultConnection',
  timeout = 'timeout',
  reconnectionAttempts = 'reconnectionAttempts',
  reconnectionDelay = 'reconnectionDelay',
  reconnectionDelayMax = 'reconnectionDelayMax',
  reconnection = 'reconnection',
  rejectUnauthorized = 'rejectUnauthorized',
  onConnectListeners = 'onConnectListeners',
}

export enum EReqChangeRootKeys {
  headers = 'headers',
  config = 'config',
  listeners = 'listeners',
}
