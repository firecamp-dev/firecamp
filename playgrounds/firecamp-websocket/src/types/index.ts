export enum ELogTypes {
  Send = 's',
  Receive = 'r',
  Ack = 'ack',
  System = 'sys',
  Upgrade = 'upgrade',
}

export enum ELogColors {
  Success = 'success',
  Danger = 'danger',
}

export enum EConnectionState {
  Ideal = -1,
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

export enum EMessageTypes {
  System = 'sys',
  Send = 's',
  Receive = 'r',
}

export enum ESystemMessages {
  ClearAll = `clear all logs`,

  OnConnecting = `Socket has been  created . The connection is not yet open.`,
  OnConnect = `The connection is  open  and ready to communicate.`,
  OnDisconnecting = `The connection is in the process of  closing .`,
  Close = `The connection is  closed  or couldn't be opened.`,

  OnReconnect = `ws connection  re-connecting `,
  NotConnected = `The connection is not open yet.`,
  Error = `Connection was  broken `,

  Ping = `ping`,
  Pong = `pong`,
  Listen = `you're listening `,
  ListenOff = `you have listen off `,
}

export const EMessagePayloadTypes = {
  text: 'text',
  json: 'json',
  file: 'file',
  arraybuffer: 'arraybuffer',
  arraybufferview: 'arraybufferview',
  none: 'none',
};

export enum ERequestPanelTabs {
  Collection = 'Collection',
  Playgrounds = 'Playgrounds',
}

export enum EWebsocketConfigKeys {
  Protocols = 'protocols',
  Reconnect = 'reconnect',
  ReconnectAttempts = 'reconnectAttempts',
  ReconnectTimeout = 'reconnectTimeout',
  RejectUnauthorized = 'rejectUnauthorized',
  FollowRedirects = 'followRedirects',
  HandshakeTimeout = 'handshakeTimeout', //ms
  MaxRedirects = 'maxRedirects',
  ProtocolVersion = 'protocolVersion',
  Origin = 'origin',
  MaxPayload = 'maxPayload', //bytes
}

// request changes
export enum EReqChangeRootKeys {
  config = 'config',
  connection = 'connection', //queryParams and headers will be in connection
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
