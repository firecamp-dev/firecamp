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

  const auth_headers = credentials['headers'];

  if (!Array.isArray(auth_headers)) {
    // Convert header value into string if type is not string
    for (const header in auth_headers) {
      if (typeof auth_headers[header] !== 'string')
        auth_headers[header] = String(auth_headers[header]);
    }
  }

  return auth_headers;
};
