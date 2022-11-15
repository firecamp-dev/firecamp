import { TId, EPushActionType } from '@firecamp/types';

export enum ERequestPanelTabs {
  Collection = 'Collection',
  Playgrounds = 'Playgrounds',
}

export enum EWebsocketConfigKeys {
  Protocols = 'protocols',
  Reconnect = 'reconnect',
  Reconnect_attempts = 'reconnect_attempts',
  Reconnect_timeout = 'reconnect_timeout',
  Reject_unauthorized = 'reject_unauthorized',
  Follow_redirects = 'follow_redirects',
  Handshake_timeout = 'handshake_timeout', //ms
  Max_redirects = 'max_redirects',
  Protocol_version = 'protocol_version',
  Origin = 'origin',
  Max_payload = 'max_payload', //bytes
}

// Request push action

export enum EPushAction_rootKeys {
  headers = 'headers',
}

export enum EPushAction_metaKeys {
  collection_id = 'collection_id',
  folder_id = 'folder_id',
  updated_at = 'updated_at',
  updated_by = 'updated_by',
}

export enum EPushActionMetaKeys {
  name = 'name',
  description = 'description',
  leaf_orders = 'leaf_orders',
  dir_orders = 'dir_orders',
}
export enum EPushActionUrlKeys {
  raw = 'raw',
  query_params = 'query_params',
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
  envelope = 'envelope',
}

export enum EPushActionMessage_meta {
  parent_id = 'parent_id',
  updated_at = 'updated_at',
  updated_by = 'updated_by',
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
  dir_orders = 'dir_orders',
  leaf_orders = 'leaf_orders',
}

export enum EPushActionDirectory_meta {
  parent_id = 'parent_id',
  updated_at = 'updated_at',
  updated_by = 'updated_by',
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
