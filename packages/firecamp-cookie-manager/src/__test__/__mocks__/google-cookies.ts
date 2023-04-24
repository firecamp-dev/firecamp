export const cookieString =
  'id=a3fWa; Expires=Thu, 31 Oct 2021 07:28:00 GMT; Domain=google.com; Path=/';

export const updatedCookieString =
  'user=a3fWa; Expires=Thu, 31 Oct 2021 07:28:00 GMT; Domain=google.com; Path=/';

export const parsedCookie = {
  domain: 'google.com',
  key: 'id',
  path: '/',
  raw: 'id=a3fWa; Expires=Sun, 31 Oct 2021 07:28:00 GMT; Domain=google.com; Path=/',
};

export const updatedParsedCookie = {
  domain: 'google.com',
  key: 'user',
  path: '/',
  raw: 'user=a3fWa; Expires=Sun, 31 Oct 2021 07:28:00 GMT; Domain=google.com; Path=/',
};

export const storedCookie = {
  creation: '2022-04-21T10:16:13.459Z',
  domain: 'google.com',
  expires: '2021-10-31T07:28:00.000Z',
  key: 'id',
  path: '/',
  value: 'a3fWa',
};

export const updatedStoredCookie = {
  creation: '2022-04-21T10:16:13.459Z',
  domain: 'google.com',
  expires: '2021-10-31T07:28:00.000Z',
  key: 'user',
  path: '/',
  value: 'a3fWa',
};
