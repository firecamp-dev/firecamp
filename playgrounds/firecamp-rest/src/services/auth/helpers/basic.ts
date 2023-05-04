import { IAuthBasic } from '@firecamp/types';

export default ({ username, password }: IAuthBasic): string => {
  const _s = `${username}:${password}`;
  if (typeof window !== 'undefined') {
    // Browser
    const utf8String = unescape(encodeURIComponent(_s));
    const base64String = btoa(utf8String);
    return base64String;
  } else {
    // Node.js
    const utf8String = Buffer.from(_s, 'utf8');
    const base64String = utf8String.toString('base64');
    return base64String;
  }
};
