import { IAuthAwsV4 } from './awsv4';
import { IAuthBasic } from './basic';
import { IAuthBearer } from './bearer';
import { IAuthDigest } from './digest';
import { IOAuth1 } from './oauth1';
import { IOAuth2 } from './oauth2';
import { IOAuth2UiState } from './rest-client-oauth2';

export * from './awsv4';
export * from './basic';
export * from './bearer';
export * from './digest';
export * from './oauth1';
export * from './oauth2';
export * from './rest-client-oauth2';

export enum EAuthTypes {
  None = 'none',
  Inherit = 'inherit',
  AwsV4 = 'awsv4',
  Basic = 'basic',
  Bearer = 'bearer',
  Digest = 'digest',
  OAuth1 = 'oauth1',
  OAuth2 = 'oauth2',
  Ntlm = 'ntlm',
  Hawk = 'hawk',
  Atlassian = 'atlassian',
  Nertc = 'nertc',
}

/** request auth payload */
export interface IAuth {
  value: IAuthAwsV4 | IAuthBasic | IAuthBearer | IAuthDigest | IOAuth1 | IOAuth2 | '' | null;
  type: EAuthTypes;
}

/** rest client specific auth */
export interface IAuthUiState {
  [EAuthTypes.AwsV4]?: IAuthAwsV4;
  [EAuthTypes.Basic]?: IAuthBasic;
  [EAuthTypes.Bearer]?: IAuthBearer;
  [EAuthTypes.Digest]?: IAuthDigest;
  [EAuthTypes.OAuth1]?: IOAuth1;
  [EAuthTypes.OAuth2]?: IOAuth2UiState;
  [EAuthTypes.Ntlm]?: {
    password: string;
    username: string;
    domain: string;
    workstation: string;
  };
  [EAuthTypes.Hawk]?: {
    id: string;
    key: string;
    algorithm: string;
    user: string;
    nonce: string;
    extraData: string;
    appId: string;
    delegation: string;
    timestamp: string;
  };
}
