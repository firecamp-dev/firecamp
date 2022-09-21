import { EAuthTypes, EHttpMethod, IAuthAws4, IAuthBasic, IAuthBearer, IAuthDigest, IOAuth1, IOAuth2, IUrl } from '@firecamp/types';
import { IAuthHeader, IExtra, TAuth } from './types';
import { aws4, basic, bearer, digest, oauth1, oauth2 } from './helpers';

export default class Auth {
  authType: EAuthTypes;
  credentials: TAuth;
  extra: IExtra;
  authHeader: string;
  aws4AuthHeaders: { [k: string]: any };

  constructor(authType: EAuthTypes, credentials: TAuth, extra: IExtra) {
    this.authType = authType;
    this.credentials = credentials;
    this.extra = extra;
  }

  async authorize(): Promise<void> {
    switch (this.authType) {
      case EAuthTypes.Aws4:
        this.aws4AuthHeaders = aws4(this.credentials as IAuthAws4, this.extra);
        break;
      case EAuthTypes.Basic:
        this.authHeader = basic(this.credentials as IAuthBasic);
        break;
      case EAuthTypes.Bearer:
        this.authHeader = bearer(this.credentials as IAuthBearer);
        break;
      case EAuthTypes.Digest:
        this.authHeader = digest(this.credentials as IAuthDigest, this.extra as { url: IUrl, method: EHttpMethod });
        break;
      case EAuthTypes.OAuth1:
        this.authHeader = oauth1(this.credentials as IOAuth1, this.extra);
        break;
      case EAuthTypes.OAuth2:
        this.authHeader = await oauth2(this.credentials as IOAuth2, this.extra);
        break;

      default:
        return Promise.reject('Invalid auth type');
    }
  }

  getHeader(): IAuthHeader | object {
    if (this.authType === EAuthTypes.Aws4) {
      return { ...this.aws4AuthHeaders };
    } else
      return { "Authorization": this.authHeader };
  }
}
