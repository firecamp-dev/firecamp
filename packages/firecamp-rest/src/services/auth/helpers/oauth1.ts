import { IOAuth1, EOAuth1Signature } from '@firecamp/types';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
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
    method: method,
    data: {
      oauth_callback: '',
      oauth_timestamp: '',
      oauth_nonce: '',
      oauth_verifier: '',
    },
  };

  if (callback_url) requestData.data.oauth_callback = callback_url;

  if (timestamp) requestData.data.oauth_timestamp = timestamp;

  if (nonce) requestData.data.oauth_nonce = nonce;

  if (verifier) requestData.data.oauth_verifier = verifier;

  let token = null;

  if (token_key && token_secret) {
    token = {
      key: token_key,
      secret: token_secret,
    };
  } else if (token_key) {
    token = { key: token_key };
  }

  const data = oauth.authorize(requestData, token);

  let authInfo = oauth.toHeader(data).Authorization;

  // TODO: Review before remove
  // authInfo = authInfo.replace(/%7B%7B/g, '{{')
  // authInfo = authInfo.replace(/%7D%7D/g, '}}')

  return authInfo;
};
