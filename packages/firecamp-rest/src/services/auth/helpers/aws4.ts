import { IAuthAws4 } from '@firecamp/types';
import aws from 'aws4';
import { IExtra } from '../types';

export default (credentials: IAuthAws4, extra: IExtra): object => {
  if (typeof extra.body === 'object') extra.body = '';

  if (
    !extra.headers ||
    !extra.headers['Content-Type'] ||
    !extra.headers['content-type']
  ) {
    extra.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  aws.sign(credentials, {
    accessKeyId: credentials.access_key,
    secretAccessKey: credentials.secret_key,
  });

  const authHeaders = credentials['headers'];

  if (!Array.isArray(authHeaders)) {
    // Convert header value into string if type is not string
    for (const header in authHeaders) {
      if (typeof authHeaders[header] !== 'string')
        authHeaders[header] = String(authHeaders[header]);
    }
  }

  return authHeaders;
};
