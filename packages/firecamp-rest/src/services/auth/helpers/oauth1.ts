import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import { IOAuth1, EOAuth1Signature } from '@firecamp/types';
import { IExtra } from '../types';

export default (credentials: IOAuth1, extra: IExtra): string => {
  const {
    consumerKey,
    consumerSecret,
    tokenKey,
    tokenSecret,
    callbackUrl,
    nonce,
    realm,
    signatureMethod,
    timestamp,
    verifier,
    version,
  } = credentials;

  const { method, url } = extra;

  const hashFunction = (signatureMethod: EOAuth1Signature): any => {
    switch (signatureMethod) {
      case EOAuth1Signature.hmacSHA1:
        return (baseString: string, key: string) =>
          crypto.createHmac('sha1', key).update(baseString).digest('base64');

      case EOAuth1Signature.hmacSHA256:
        return (baseString: string, key: string) =>
          crypto.createHmac('sha256', key).update(baseString).digest('base64');

      case EOAuth1Signature.plaintext:
        return (baseString: string) => baseString;

      default:
        return '';
    }
  };

  const oauth = new OAuth({
    consumer: {
      key: consumerKey,
      secret: consumerSecret,
    },
    signature_method: signatureMethod,
    version: version,
    hash_function: hashFunction(signatureMethod),
    realm: realm || null,
  });

  const requestData = {
    url: url.raw,
    method,
    data: {
      oauth_callback: callbackUrl || '',
      oauth_timestamp: timestamp || '',
      oauth_nonce: nonce || '',
      oauth_verifier: verifier || '',
    },
  };

  const token: { key: string; secret: string } = {
    key: tokenKey,
    secret: tokenSecret,
  };

  const data = oauth.authorize(requestData, token);
  const authInfo = oauth.toHeader(data).Authorization;

  // TODO: Review before remove
  // authInfo = authInfo.replace(/%7B%7B/g, '{{')
  // authInfo = authInfo.replace(/%7D%7D/g, '}}')

  return authInfo;
};
