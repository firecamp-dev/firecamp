import { TId } from '@firecamp/types';

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

export enum EPanel {
  Request = 'REQUEST',
  Response = 'RESPONSE',
  All = 'ALL',
}

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
export enum EReChangeRootKeys {
  headers = 'headers',
  config = 'config',
}

export enum EReqChangeMetaKeys {
  name = 'name',
  description = 'description',
  iOrders = 'iOrders',
  fOrders = 'fOrders',
}
export enum EReqChangeUrlKeys {
  raw = 'raw',
}

export enum EPushActionConfigKeys {
  reconnect = 'reconnect',
  reconnectAttempts = 'reconnectAttempts',
  reconnectTimeout = 'reconnectTimeout',
  protocols = 'protocols',
  rejectUnauthorized = 'rejectUnauthorized',
  handshakeTimeout = 'handshakeTimeout',
  protocolVersion = 'protocolVersion',
  maxRedirects = 'maxRedirects',
  followRedirects = 'followRedirects',
  origin = 'origin',
  maxPayload = 'maxPayload',
}

export interface IPushActionConnections {
  ['i']?: Array<TId>;
  ['u']?: Array<{
    id: TId;
    _root?: Array<string>;
    config?: Array<string>;
  }>;
  ['d']?: Array<TId>;
}

// Leaf push action

export enum EPushActionMessage_Root {
  name = 'name',
  body = 'body',
}

export enum EPushActionMessageMeta {
  type = 'type',
  typedArrayView = 'typedArrayView',
}

export enum EPushActionMessage_meta {
  parentId = 'parentId',
  updatedAt = 'updatedAt',
  updatedBy = 'updatedBy',
}

export interface IPushActionMessage {
  ['i']?: Array<TId>;
  ['u']?: Array<{
    id: TId;
    _root?: Array<EPushActionMessage_Root>;
    __meta?: Array<EPushActionMessageMeta>;
    __ref?: Array<EPushActionMessage_meta>;
  }>;
  ['d']?: Array<TId>;
}

// Directory push action

export enum EPushActionDirectory_Root {
  name = 'name',
}

export enum EPushActionDirectoryMeta {
  fOrders = 'fOrders',
  iOrders = 'iOrders',
}

export enum EPushActionDirectory_meta {
  parentId = 'parentId',
  updatedAt = 'updatedAt',
  updatedBy = 'updatedBy',
}

export interface IPushActionDirectory {
  ['i']?: Array<TId>;
  ['u']?: Array<{
    id: TId;
    _root?: Array<EPushActionDirectory_Root>;
    __meta?: Array<EPushActionDirectoryMeta>;
    __ref?: Array<EPushActionDirectory_meta>;
  }>;
  ['d']?: Array<TId>;
}
