import { TId, EPushActionType } from '@firecamp/types';

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
  System = 'SYS',
  Send = 'S',
  Receive = 'R',
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
  noBody: 'noBody',
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

// Request push action

export enum EPushActionRootKeys {
  headers = 'headers',
}

export enum EPushAction_metaKeys {
  collectionId = 'collectionId',
  folderId = 'folderId',
  updatedAt = 'updatedAt',
  updatedBy = 'updatedBy',
}

export enum EPushActionMetaKeys {
  name = 'name',
  description = 'description',
  iOrders = 'iOrders',
  fOrders = 'fOrders',
}
export enum EPushActionUrlKeys {
  raw = 'raw',
  queryParams = 'queryParams',
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
  [EPushActionType.Insert]?: Array<TId>;
  [EPushActionType.Update]?: Array<{
    id: TId;
    _root?: Array<string>;
    config?: Array<string>;
  }>;
  [EPushActionType.Delete]?: Array<TId>;
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
  [EPushActionType.Insert]?: Array<TId>;
  [EPushActionType.Update]?: Array<{
    id: TId;
    _root?: Array<EPushActionMessage_Root>;
    meta?: Array<EPushActionMessageMeta>;
    _meta?: Array<EPushActionMessage_meta>;
  }>;
  [EPushActionType.Delete]?: Array<TId>;
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
  [EPushActionType.Insert]?: Array<TId>;
  [EPushActionType.Update]?: Array<{
    id: TId;
    _root?: Array<EPushActionDirectory_Root>;
    meta?: Array<EPushActionDirectoryMeta>;
    _meta?: Array<EPushActionDirectory_meta>;
  }>;
  [EPushActionType.Delete]?: Array<TId>;
}
