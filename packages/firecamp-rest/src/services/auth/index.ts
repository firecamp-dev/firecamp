import { EAuthTypes } from '@firecamp/types';
import { IAuthHeader, IExtra, TAuth } from './types';
import { aws4, basic, bearer, digest, oauth1, oauth2 } from './helpers';

export default class Auth {
  credentials: TAuth;
  extra: IExtra;
  authDetails: string | any;

  constructor(credentials: TAuth, extra: IExtra) {
    this.credentials = credentials;
    this.extra = extra;
  }

  async authorize(): Promise<void> {
    switch (this.extra.authType) {
      case EAuthTypes.Aws4:
        this.authDetails = aws4(this.credentials, this.extra);
        break;
      case EAuthTypes.Basic:
        this.authDetails = basic(this.credentials);
        break;
      case EAuthTypes.Bearer:
        this.authDetails = bearer(this.credentials);
        break;
      case EAuthTypes.Digest:
        this.authDetails = digest(this.credentials);
        break;
      case EAuthTypes.OAuth1:
        this.authDetails = oauth1(this.credentials, this.extra);
        break;
      case EAuthTypes.OAuth2:
        this.authDetails = await oauth2(this.credentials, this.extra);
        break;

      default:
        return Promise.reject('Invalid auth type');
    }
  }

  getHeader(): IAuthHeader | object {
    if (this.extra.authType === EAuthTypes.Aws4) {
      return { ...this.authDetails };
    } else
      return {
        Authorization: this.authDetails,
      };
  }
}
