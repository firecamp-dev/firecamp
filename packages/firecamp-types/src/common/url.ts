import { IPathParam } from './path-param'
import { IQueryParam } from "./query-param"

/**
 * http request url
 * reference: https://www.npmjs.com/package/url-parse
 */
export interface IUrl {
  /**
   * represents the raw string of the request URL
   */
  raw: string
  /**
   * firecamp url specific query param
   * doc: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#query
   */
  queryParams?: IQueryParam[]
  /**
   * Path parameters are variable parts of a URL path. They are typically used to point to a specific
   * resource within a collection, such as a user identified by ID. A URL can have several path parameters,
   * each denoted by preceding ':'
   */
  pathParams?: IPathParam[]
}