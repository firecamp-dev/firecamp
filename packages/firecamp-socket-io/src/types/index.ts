import { TId, EPushActionType } from '@firecamp/types';

export enum EPushActionMetaKeys {
  name = 'name',
  description = 'description',
  leaf_orders = 'leaf_orders',
  dir_orders = 'dir_orders',
}

export enum EPushActionUrlKeys {
  protocol = 'protocol',
  slashes = 'slashes',
  auth = 'auth',
  username = 'username',
  password = 'password',
  host = 'host',
  hostname = 'hostname',
  query_params = 'query_params',
  path_params = 'path_params',
  port = 'port',
  pathname = 'pathname',
  hash = 'hash',
  href = 'href',
  origin = 'origin',
}

export enum EPushActionConfigKeys {
  version = 'version',
  default_connection = 'default_connection',
  timeout = 'timeout',
  reconnectionAttempts = 'reconnectionAttempts',
  reconnectionDelay = 'reconnectionDelay',
  reconnectionDelayMax = 'reconnectionDelayMax',
  reconnection = 'reconnection',
  rejectUnauthorized = 'rejectUnauthorized',
  on_connect_listeners = 'on_connect_listeners',
}

export enum EPushAction_rootKeys {
  headers = 'headers',
}

export enum EPushAction_metaKeys {
  collection_id = 'collection_id',
  folder_id = 'folder_id',
  updated_at = 'updated_at',
  updated_by = 'updated_by',
}

export enum ICommitActionConnectionUpdate_root {
  namespace = 'namespace',
  path = 'path',
  ping = 'ping',
  forceNew = 'forceNew',
  ping_interval = 'ping_interval',
  transports = 'transports',
  headers = 'headers',
  query_params = 'query_params',
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
  envelope = 'envelope',
}

export enum EPushActionMessage_metaKeys {
  parent_id = 'parent_id',
  updated_at = 'updated_at',
  updated_by = 'updated_by',
}

export interface IPushActionEmitter {
  [EPushActionType.Insert]?: Array<TId>;
  [EPushActionType.Update]?: Array<{
    id: TId;
    _root?: Array<EPushActionMessage_RootKeys>;
    meta?: Array<EPushActionMessageMetaKeys>;
    _meta?: Array<EPushActionMessage_metaKeys>;
  }>;
  [EPushActionType.Delete]?: Array<TId>;
}

// Directory push action

export enum EPushActionDirectory_RootKeys {
  name = 'name',
}

export enum EPushActionDirectoryMetaKeys {
  dir_orders = 'dir_orders',
  leaf_orders = 'leaf_orders',
}

export enum EPushActionDirectory_metaKeys {
  parent_id = 'parent_id',
  updated_at = 'updated_at',
  updated_by = 'updated_by',
}

export interface IPushActionDirectory {
  [EPushActionType.Insert]?: Array<TId>;
  [EPushActionType.Update]?: Array<{
    id: TId;
    _root?: Array<EPushActionDirectory_RootKeys>;
    meta?: Array<EPushActionDirectoryMetaKeys>;
    _meta?: Array<EPushActionDirectory_metaKeys>;
  }>;
  [EPushActionType.Delete]?: Array<TId>;
}
