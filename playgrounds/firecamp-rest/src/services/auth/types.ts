import {
  EHttpMethod,
  IAuthAwsV4,
  IAuthBasic,
  IAuthBearer,
  IAuthDigest,
  IOAuth1,
  IOAuth2,
  EFirecampAgent,
  IUrl,
} from '@firecamp/types';

export interface IAuthHeader {
  Authorization: string;
}

export interface IExtra {
  url?: IUrl;
  method?: EHttpMethod | string;
  body?: any;
  agent?: EFirecampAgent;
  headers?: object;
}

export type TAuth =
  | IAuthAwsV4
  | IAuthBasic
  | IAuthBearer
  | IAuthDigest
  | IOAuth1
  | IOAuth2
  | '';
