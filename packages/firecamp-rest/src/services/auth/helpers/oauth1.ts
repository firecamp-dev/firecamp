import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import { IOAuth1, EOAuth1Signature } from '@firecamp/types';
import { IExtra } from '../types';

export default (credentials: IOAuth1, extra: IExtra): string => {
  const {
    consumer_key,
    consumer_secret,
    token_key,
    token_secret,
    callback_url,
    nonce,
    realm,
    signature_method,
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
      key: consumer_key,
      secret: consumer_secret,
    },
    signature_method: signature_method,
    version: version,
    hash_function: hashFunction(signature_method),
    realm: realm || null,
  });

  const requestData = {
    url: url.raw,
    method,
    data: {
      oauth_callback: callback_url || '',
      oauth_timestamp: timestamp || '',
      oauth_nonce: nonce || '',
      oauth_verifier: verifier || '',
    },
  };

  let token: { key: string, secret: string } = { key: token_key, secret: token_secret };

  const data = oauth.authorize(requestData, token);
  const authInfo = oauth.toHeader(data).Authorization;

  // TODO: Review before remove
  // authInfo = authInfo.replace(/%7B%7B/g, '{{')
  // authInfo = authInfo.replace(/%7D%7D/g, '}}')

  return authInfo;
};
