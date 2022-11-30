import { IUiAuth, IRest } from '@firecamp/types';

export enum EPushAction_rootKeys {
  method = 'method',
  headers = 'headers',
  config = 'config',
}

export enum EPushActionMetaKeys {
  name = 'name',
  description = 'description',
  activeBodyType = 'activeBodyType',
  activeAuthType = 'activeAuthType',
  inheritScripts = 'inheritScripts',
}

export enum EPushActionUrlKeys {
  raw = 'raw',
  queryParams = 'queryParams',
  pathParams = 'pathParams',
}

export enum EPushActionScriptsKeys {
  pre = 'pre',
  post = 'post',
  test = 'test',
}

export enum EPushAction_metaKeys {
  collectionId = 'collectionId',
  folderId = 'folderId',
  updatedAt = 'updatedAt',
  updatedBy = 'updatedBy',
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
  MaxRedirects = 'maxRedirects',
  FollowLocation = 'followLocation',
  RejectUnauthorized = 'rejectUnauthorized',
  RequestTimeout = 'requestTimeout',
}

export interface IRestClientRequest extends Omit<IRest, 'auth'> {
  auth?: IUiAuth;
}
