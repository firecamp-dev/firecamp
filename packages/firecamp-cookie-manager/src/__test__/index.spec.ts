import _omit from 'lodash/omit';
import { googleCookies, mozillaCookies, zohoCookies } from './__mocks__';
import { CookieManager } from '..';

let cookieManager: CookieManager;

beforeAll(() => {
  cookieManager = new CookieManager();
});

it('should be defined', () => {
  expect(cookieManager).toBeDefined();
});

it('should parse the cookie string', () => {
  expect(cookieManager.parse(mozillaCookies.cookieString)).toMatchObject(
    mozillaCookies.parsedCookie
  );
});

it('should add cookie into cookie jar', async () => {
  await cookieManager.addCookie(zohoCookies.parsedCookie);

  let cookie: any = await cookieManager.getCookie(
    zohoCookies.parsedCookie.domain,
    zohoCookies.parsedCookie.path,
    zohoCookies.parsedCookie.key
  );

  expect(_omit(cookie, ['expires', 'creation'])).toMatchObject(
    _omit(zohoCookies.storedCookie, ['expires', 'creation'])
  );
});

it('should add multiple cookies into cookie jar', async () => {
  await cookieManager.addCookies([
    mozillaCookies.parsedCookie,
    googleCookies.parsedCookie,
  ]);

  let cookie: any = await cookieManager.getCookie(
    mozillaCookies.parsedCookie.domain,
    mozillaCookies.parsedCookie.path,
    mozillaCookies.parsedCookie.key
  );

  expect(_omit(cookie, ['expires', 'creation'])).toMatchObject(
    _omit(mozillaCookies.storedCookie, ['expires', 'creation'])
  );

  cookie = await cookieManager.getCookie(
    googleCookies.parsedCookie.domain,
    googleCookies.parsedCookie.path,
    googleCookies.parsedCookie.key
  );

  expect(_omit(cookie, ['expires', 'creation'])).toMatchObject(
    _omit(googleCookies.storedCookie, ['expires', 'creation'])
  );
});

it('should fetch all cookies using url', async () => {
  const cookies = await cookieManager.getCookies('http://zoho.in/mail');

  expect(cookies).toEqual(zohoCookies.cookieString);
});

it('should not fetch expires cookies using url', async () => {
  const cookies: any = await cookieManager.getCookies('http://google.com/');

  expect(cookies.length).toEqual(0);
});

it('should update cookie', async () => {
  await cookieManager.addCookie(googleCookies.updatedParsedCookie);

  let cookie: any = await cookieManager.getCookie(
    googleCookies.updatedParsedCookie.domain,
    googleCookies.updatedParsedCookie.path,
    googleCookies.updatedParsedCookie.key
  );

  expect(_omit(cookie, ['expires', 'creation'])).toMatchObject(
    _omit(googleCookies.updatedStoredCookie, ['expires', 'creation'])
  );
});

it('should remove cookie', async () => {
  await cookieManager.removeCookie(
    zohoCookies.parsedCookie.domain,
    zohoCookies.parsedCookie.path,
    zohoCookies.parsedCookie.key
  );

  const cookie: any = await cookieManager.getCookie(
    zohoCookies.parsedCookie.domain,
    zohoCookies.parsedCookie.path,
    zohoCookies.parsedCookie.key
  );

  expect(cookie).toBeNull();
});

it('should remove domain specific all cookies', async () => {
  await cookieManager.removeCookies(
    googleCookies.parsedCookie.domain,
    googleCookies.parsedCookie.path
  );

  const cookie = await cookieManager.getCookie(
    googleCookies.updatedParsedCookie.domain,
    googleCookies.updatedParsedCookie.path,
    googleCookies.updatedParsedCookie.key
  );

  // TODO: Why returning undefined
  expect(cookie).toBeUndefined();
});

it('should remove all cookies from cookie jar', async () => {
  await cookieManager.removeAllCookies();

  let cookie: any = await cookieManager.getCookie(
    mozillaCookies.parsedCookie.domain,
    mozillaCookies.parsedCookie.path,
    mozillaCookies.parsedCookie.key
  );

  // TODO: Why returning undefined
  expect(cookie).toBeUndefined();
});
