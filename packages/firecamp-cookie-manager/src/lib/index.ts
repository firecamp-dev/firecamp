import { Cookie, CookieJar } from 'tough-cookie'
import { getSetCookieHeader } from './helper'
import { ICookieToStore } from './types'

export default class CookieManager {
  cookieJar: CookieJar

  constructor() {
    this.cookieJar = new CookieJar()
    this.cookieJar['allowSpecialUseDomain'] = true
    this.cookieJar['rejectPublicSuffixes'] = false
  }

  /**
   * Accept the cookie object and return the cookie string
   * @param cookie
   * @returns {string}
   */
  prepareCookieString(cookie: any): string {
    return `${cookie.key}=${cookie.value}; Expires=${cookie.expires}; Domain=${cookie.domain
      }; Path=${cookie.path}; ${cookie.secure ? 'Secure' : ''}; ${cookie.httpOnly ? 'HttpOnly' : ''
      }`
  }

  /**
   * Parse cookie
   * @param cookie
   * @returns {undefined|Cookie}
   */
  parse(cookie: string): ICookieToStore {
    if (typeof cookie === 'object') cookie = this.prepareCookieString(cookie)

    const parsedCookie = Cookie.parse(cookie)
    const raw = Cookie.fromJSON(parsedCookie).toString()

    return {
      raw,
      key: parsedCookie.key,
      domain: parsedCookie.cdomain(),
      path: parsedCookie.path,
    }
  }

  /**
   * Parser set-cookie header fetch from the response header
   * @param {Array} headers
   * @param {String} requestURL require to add domain in the cookie if not exist
   * @returns {Array} cookies
   */
  parseHeaders(headers: string[] = [], requestURL: string): ICookieToStore[] | any {
    try {
      const setCookieHeader = getSetCookieHeader(headers)
      const cookies: ICookieToStore[] = []

      if (setCookieHeader) {
        setCookieHeader.map((cookie: string) => {
          let raw: string

          const parsedCookie = Cookie.parse(cookie)

          if (
            typeof parsedCookie === 'object' &&
            Object.keys(parsedCookie).length > 0 &&
            !parsedCookie.domain &&
            typeof requestURL === 'string' &&
            requestURL.length > 0
          ) {
            try {
              const parsedURL = new URL(requestURL)

              if (
                typeof parsedURL === 'object' &&
                typeof parsedURL.hostname === 'string' &&
                parsedURL.hostname.length > 0
              ) {
                parsedCookie.domain = parsedURL.hostname

                raw = Cookie.fromJSON(parsedCookie).toString()
              } else return
            } catch (error) {
              console.error(error)
            }
          } else {
            raw = Cookie.fromJSON(parsedCookie).toString()
          }

          cookies.push({
            raw,
            key: parsedCookie.key,
            domain: parsedCookie.cdomain(),
            path: parsedCookie.path,
          })
        })

        return cookies
      }

      return []
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Get the cookie
   * @param domain
   * @param path
   * @param key
   * @returns {Promise<unknown>}
   */
  getCookie(domain: string, path: string, key: string): Promise<Cookie> {
    return new Promise((resolve, reject) => {
      this.cookieJar['store'].findCookie(domain, path, key, (error: Error, cookie: Cookie) => {
        if (error) reject(error)
        resolve(cookie)
      })
    })
  }

  /**
   * Retrieve the list of cookies that can be sent in a Cookie header for the current url.
   * @param {String} url
   * @returns {String} cookie
   */
  getCookies(url = '') {
    return new Promise((resolve, reject) => {
      this.cookieJar.getCookies(url, (error, cookies) => {
        if (error) reject(error)
        resolve(cookies.join('; '))
      })
    })
  }

  getEachCookie(url = ''): Promise<Cookie[]> {
    return new Promise((resolve, reject) => {
      this.cookieJar.getCookies(url, (error, cookies) => {
        if (error) reject(error)
        resolve(cookies)
      })
    })
  }

  /**
   * Attempt to store cookies without domain
   * @param cookie
   */
  addCookie(cookie: ICookieToStore): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cookieJar['store'].putCookie(Cookie.parse(cookie.raw), (error: Error) => {
        if (error) reject(error)
        resolve()
      })
    })
  }

  /**
   * Attempt to store cookies without domain
   * @param {Array} cookies
   */
  addCookies(cookies: ICookieToStore[]): Promise<void> {
    return new Promise(async (resolve, reject) => {
      cookies.map((cookie) => {
        this.cookieJar['store'].putCookie(Cookie.parse(cookie.raw), (error: Error) => {
          if (error) reject(error)
        })
      })
      resolve()
    })
  }

  /**
   * Attempt to set the multiple cookies in the cookie jar.
   * @param {Array} cookies
   * @param {String} url
   */
  addCookiesByDomain(cookies: ICookieToStore[] = [], url: string = ''): Promise<void> {
    return new Promise((resolve, reject) => {
      cookies.map((cookie) => {
        this.cookieJar.setCookie(
          Cookie.parse(cookie.raw),
          url,
          (error, cookie) => {
            if (error) reject(error)
          }
        )
      })
      resolve()
    })
  }

  /**
   * Update an existing cookie.
   * @param {String} oldCookie
   * @param {String} newCookie
   * @returns {Promise<void>}
   */
  updateCookie(oldCookie: string = '', newCookie: ICookieToStore): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cookieJar['store'].updateCookie(
        oldCookie,
        Cookie.parse(newCookie.raw),
        (error: Error) => {
          if (error) reject(error)
          resolve()
        }
      )
    })
  }

  /**
   * Remove a cookie from the store
   * @param {String} domain
   * @param {String} path
   * @param {String} key
   * @returns {Promise<unknown>}
   */
  removeCookie(domain: string = '', path: string = '', key: string = ''): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cookieJar['store'].removeCookie(domain, path, key, (error: Error) => {
        if (error) reject(error)
        resolve()
      })
    })
  }

  /**
   * Removes matching cookies from the store.
   * @param {String} domain
   * @param {String} path
   * @returns {Promise<unknown>}
   */
  removeCookies(domain: string = '', path: string = ''): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cookieJar['store'].removeCookies(domain, path, (error: Error) => {
        if (error) reject(error)
        resolve()
      })
    })
  }

  /**
   * Removes all cookies from the store.
   * @returns {Promise<void>}
   */
  removeAllCookies(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cookieJar['store'].removeAllCookies((error: Error) => {
        if (error) reject(error)
        resolve()
      })
    })
  }

  /**
   * Converts cookie into string
   * @param {Object} cookie
   * @returns {string} cookie
   */
  cookieToString(cookie: string): string {
    return Cookie.fromJSON(Cookie.parse(cookie)).toString()
  }

  /**
   * Converts cookie string into json
   * @param {String} cookie
   * @returns {Object} cookie in JSON
   */
  cookieToJSON(cookie: string): any {
    return Cookie.parse(cookie).toJSON() || {}
  }
};
