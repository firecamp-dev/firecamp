import CryptoJS from 'crypto-js';
import { IOAuth1, EOAuth1Signature } from '@firecamp/types';
import { IExtra } from '../types';

export default (credentials: IOAuth1, extra: IExtra): string => {
  let {
    consumerKey,
    consumerSecret,
    tokenKey,
    tokenSecret,
    signatureMethod,
    timestamp,
    nonce,
    callbackUrl,
    realm,
    verifier,
    version = '1.0',
  } = credentials;

  nonce =
    nonce || CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Base64);
  timestamp = timestamp || Math.floor(+timestamp / 1000).toString();
  const { method, url } = extra;

  const oauth: any = {
    oauth_callback: callbackUrl,
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: parseInt((Date.now() / 1000).toString()),
    oauth_token: tokenKey,
    oauth_version: version,
    realm,
    oauth_verifier: verifier,
  };

  const baseString = [
    method.toUpperCase(),
    url.raw,
    Object.keys(oauth)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(oauth[key])}`)
      .join('&'),
  ]
    .map(encodeURIComponent)
    .join('&');

  const signingKey = `${encodeURIComponent(
    consumerSecret
  )}&${encodeURIComponent(tokenSecret)}`;

  let signature: string;
  if (signatureMethod === EOAuth1Signature.hmacSHA1) {
    signature = CryptoJS.HmacSHA1(baseString, signingKey).toString(
      CryptoJS.enc.Base64
    );
  } else if (signatureMethod === EOAuth1Signature.hmacSHA256) {
    signature = CryptoJS.HmacSHA256(baseString, signingKey).toString(
      CryptoJS.enc.Base64
    );
  } else if (signatureMethod === EOAuth1Signature.plaintext) {
    signature = signingKey;
  } else {
    throw new Error(`Unsupported signature method: ${signatureMethod}`);
  }

  oauth.oauth_signature = signature;

  const header = `OAuth ${Object.keys(oauth)
    .sort()
    .map((key) => `${key}="${encodeURIComponent(oauth[key])}"`)
    .join(', ')}`;

  return header;
};
