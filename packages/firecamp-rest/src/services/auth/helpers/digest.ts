import { EHttpMethod, IAuthDigest, IUrl } from '@firecamp/types';
import crypto from 'crypto';

export default (
  credentials: IAuthDigest,
  { url, method }: { url: IUrl; method: EHttpMethod }
): string => {
  const {
    algorithm,
    username,
    password,
    realm,
    nonce,
    client_nonce,
    nonce_count,
    opaque,
    qop,
  } = credentials;

  const md5 = (string: string) =>
    crypto.createHash('md5').update(string).digest('hex');

  const HA1 =
    algorithm?.toLocaleLowerCase() === 'MD5-sess'
      ? md5(
          md5(`${username}:${realm}:${password}`) + `:${nonce}:${client_nonce}`
        )
      : md5(`${username}:${realm}:${password}`);

  // TODO: How to manage qop = auth-int
  const HA2 = md5(`${method || EHttpMethod.GET}:${url.raw}`);

  // TODO: How to manage qop = auth-int
  const response = md5(`${HA1}:${nonce}:${HA2}`);

  const authDetails = [
    `username="${username}"`,
    `realm="${realm}"`,
    `nonce="${nonce}"`,
    `uri="${url.raw}"`,
    `qop=${qop}`,
    `nc=${nonce_count}`,
    `cnonce="${client_nonce}"`,
    `response="${response}"`,
    `opaque="${opaque}"`,
  ];

  return `Digest ${authDetails.join(',')}`;
};
