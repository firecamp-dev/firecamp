import { IUiAuth, IRest } from '@firecamp/types';

export enum EPushAction_rootKeys {
  method = 'method',
  headers = 'headers',
  config = 'config',
}

export enum EPushActionMetaKeys {
  name = 'name',
  description = 'description',
  active_body_type = 'active_body_type',
  active_auth_type = 'active_auth_type',
  inherit_scripts = 'inherit_scripts',
}

export enum EPushActionUrlKeys {
  raw = 'raw',
  query_params = 'query_params',
  path_params = 'path_params',
}

export enum EPushActionScriptsKeys {
  pre = 'pre',
  post = 'post',
  test = 'test',
}

export enum EPushAction_metaKeys {
  collection_id = 'collection_id',
  folder_id = 'folder_id',
  updated_at = 'updated_at',
  updated_by = 'updated_by',
}

export enum ERequestPanelTabs {
  Body = 'Body',
  Auths = 'Auths',
  Headers = 'Headers',
  Params = 'Params',
  Scripts = 'Scripts',
  Config = 'Config',
}

export enum ERestConfigKeys {
  MaxRedirects = 'max_redirects',
  FollowLocation = 'follow_location',
  RejectUnauthorized = 'reject_unauthorized',
  RequestTimeout = 'request_timeout',
}

export interface IRestClientRequest extends Omit<IRest, 'auth'> {
  auth?: IUiAuth;
}
