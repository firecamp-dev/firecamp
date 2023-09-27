/**
 * @ref: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
 */
export interface cookie {
  name: string
  value: string
  expires: string | number
  maxAge: string  // value is in seconds, Here it's 5min * 60s = 300
  domain: string
  path: string | '/'
  secure: boolean
  httpOnly: boolean
  session: boolean
}

export interface ICookie extends cookie {}