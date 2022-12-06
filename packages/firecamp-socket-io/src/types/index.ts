import { TId, EPushActionType } from '@firecamp/types';

export enum EPanel {
  Request= 'Request',
  Response= 'Response',
  All= 'All',
};

export enum EEmitterPayloadTypes {
  text = 'text',
  json = 'json',
  file = 'file',
  arraybuffer = 'arraybuffer',
  arraybufferview = 'arraybufferview',
  number = 'number',
  boolean = 'boolean',
  noBody = 'noBody',
}

export enum EConnectionState {
  Ideal = -1,
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

export enum ELogTypes {
  Send = 'S',
  Receive = 'R',
  Ack = 'ACK',
  System = 'SYS',
}

export enum ELogColors {
  Success = 'success',
  Danger = 'danger',
  Warning = 'warning',
}

export enum EPushActionMetaKeys {
  name = 'name',
  description = 'description',
  iOrders = 'iOrders',
  fOrders = 'fOrders',
}

export enum EPushActionUrlKeys {
  protocol = 'protocol',
  slashes = 'slashes',
  auth = 'auth',
  username = 'username',
  password = 'password',
  host = 'host',
  hostname = 'hostname',
  queryParams = 'queryParams',
  pathParams = 'pathParams',
  port = 'port',
  pathname = 'pathname',
  hash = 'hash',
  href = 'href',
  origin = 'origin',
}

export enum EPushActionConfigKeys {
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

export enum EPushAction_rootKeys {
  headers = 'headers',
}

export enum EPushAction_metaKeys {
  collectionId = 'collectionId',
  folderId = 'folderId',
  updatedAt = 'updatedAt',
  updatedBy = 'updatedBy',
}

export enum ICommitActionConnectionUpdate_root {
  namespace = 'namespace',
  path = 'path',
  ping = 'ping',
  forceNew = 'forceNew',
  pingInterval = 'pingInterval',
  transports = 'transports',
  headers = 'headers',
  queryParams = 'queryParams',
  auth = 'auth',
}

export interface IPushActionConnections {
  [EPushActionType.Insert]?: Array<TId>;
  [EPushActionType.Update]?: Array<{
    id: TId;
    _root?: Array<ICommitActionConnectionUpdate_root>;
  }>;
  [EPushActionType.Delete]?: Array<TId>;
}

// Leaf push action

export enum EPushActionMessage_RootKeys {
  name = 'name',
  body = 'body',
}

export enum EPushActionMessageMetaKeys {
  type = 'type',
  typedArrayView = 'typedArrayView',
}

export enum EPushActionMessage_metaKeys {
  parentId = 'parentId',
  updatedAt = 'updatedAt',
  updatedBy = 'updatedBy',
}

export interface IPushActionEmitter {
  [EPushActionType.Insert]?: Array<TId>;
  [EPushActionType.Update]?: Array<{
    id: TId;
    _root?: Array<EPushActionMessage_RootKeys>;
    __meta: Array<EPushActionMessageMetaKeys>;
    __ref: Array<EPushActionMessage_metaKeys>;
  }>;
  [EPushActionType.Delete]?: Array<TId>;
}

// Directory push action

export enum EPushActionDirectory_RootKeys {
  name = 'name',
}

export enum EPushActionDirectoryMetaKeys {
  fOrders = 'fOrders',
  iOrders = 'iOrders',
}

export enum EPushActionDirectory_metaKeys {
  parentId = 'parentId',
  updatedAt = 'updatedAt',
  updatedBy = 'updatedBy',
}

export interface IPushActionDirectory {
  [EPushActionType.Insert]?: Array<TId>;
  [EPushActionType.Update]?: Array<{
    id: TId;
    _root?: Array<EPushActionDirectory_RootKeys>;
    __meta: Array<EPushActionDirectoryMetaKeys>;
    __ref: Array<EPushActionDirectory_metaKeys>;
  }>;
  [EPushActionType.Delete]?: Array<TId>;
}
