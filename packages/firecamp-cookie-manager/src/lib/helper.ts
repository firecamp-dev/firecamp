export const getSetCookieHeader = (headers: any): string[] =>
  headers['set-cookie'] || headers['Set-Cookie'];
