import { IQueryParam, IPathParam } from '..'

// omit reference info. as not require in export payload
export interface QueryParam extends Omit<IQueryParam, 'id'> { }

// omit reference info. as not require in export payload
export interface PathParam extends Omit<IPathParam, 'id'> { }

// omit referential info. which are not require in export
export interface Url {
    /**
     * represents the raw string of the request URL
     */
    raw: string
    /**
     * firecamp url specific query param
     * doc: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#query
     */
    queryParams?: QueryParam[]
    /**
     * Path parameters are variable parts of a URL path. They are typically used to point to a specific
     * resource within a collection, such as a user identified by ID. A URL can have several path parameters,
     * each denoted by preceding ':'
     */
    pathParams?: PathParam[]
}