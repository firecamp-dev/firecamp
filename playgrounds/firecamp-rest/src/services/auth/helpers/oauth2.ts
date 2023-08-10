import { EOAuth2Types, IOAuth2, EFirecampAgent } from '@firecamp/types';
import { IExtra } from '../types';

export default (credentials: IOAuth2, extra: IExtra): Promise<string> => {
  if (extra.agent !== EFirecampAgent.Desktop)
    return Promise.reject(
      'Please download desktop application to use OAuth2 features.'
    );

  switch (credentials.grantType) {
    case EOAuth2Types.Code:
      //@ts-ignore
      return window.fc.http.oauth2(EOAuth2Types.Code, credentials);
    case EOAuth2Types.ClientCredentials:
      //@ts-ignore
      return window.fc.http.oauth2(EOAuth2Types.ClientCredentials, credentials);
    case EOAuth2Types.Implicit:
      //@ts-ignore
      return window.fc.http.oauth2(EOAuth2Types.Implicit, credentials);
    case EOAuth2Types.Password:
      //@ts-ignore
      return window.fc.http.oauth2(EOAuth2Types.Password, credentials);
    default:
      return Promise.reject('Invalid Grant Type');
  }
};
