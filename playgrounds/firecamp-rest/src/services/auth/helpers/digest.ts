import crypto from 'crypto';
import { EHttpMethod, IAuthDigest, IUrl } from '@firecamp/types';

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
    clientNonce,
    nonceCount,
    opaque,
    qop,
  } = credentials;

  const MD5_SESS = 'MD5-sess';
  const md5 = (string: string) =>
    crypto.createHash('md5').update(string).digest('hex');

  const AUTH_DETAILS = [
    `username="${username}"`,
    `realm="${realm}"`,
    `nonce="${nonce}"`,
    `uri="${url.raw}"`,
    `qop=${qop}`,
    `nc=${nonceCount.toString().padStart(8, '0')}`,
    `cnonce="${clientNonce}"`,
    `response=""`, //@note: response must be at index 7
    `opaque="${opaque}"`,
  ];

  const HA1 =
    algorithm === MD5_SESS
      ? md5(
          `${md5(
            `${username}:${realm}:${password}`
          )}:${nonce}:${clientNonce}:${md5(
            `${username}:${realm}:${password}:${nonce}:${clientNonce}`
          )}`
        )
      : md5(`${username}:${realm}:${password}`);

  const HA2 =
    qop === 'auth-int'
      ? md5(`${method}:${url.raw}:${md5('')}`)
      : md5(`${method}:${url.raw}`);

  const response = md5(
    `${HA1}:${nonce}:${nonceCount
      .toString()
      .padStart(8, '0')}:${clientNonce}:${qop}:${HA2}`
  );

  const updatedAuthDetails = [...AUTH_DETAILS];
  updatedAuthDetails[7] = `response="${response}"`;

  return `Digest ${updatedAuthDetails.join(',')}`;
};
