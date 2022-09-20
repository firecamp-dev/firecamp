import { EHttpMethod, IHeader, IRestBody, IUrl } from '@firecamp/types'

/**
 * request instance
 */
export interface IScriptRequest {
    /**
     * request URL
     */
    url: IUrl

    /**
     * request headers
     */
    headers: IHeader[]

    /**
     * HTTP method
     */
    method: EHttpMethod | string

    /**
     * request body
     */
    body: IRestBody

    /**
     * add the new header or update the existing header
     */
    addHeader: (headerName: string, headerValue: string) => void

    /**
     * update the existing header
     */
    updateHeader: (headerName: string, headerValue: string) => void

    /**
     * return the header value
     */
    getHeader: (headerName: string) => string

    /**
     * returns a js object, { [headerName]: headerValue,... } 
     */
    getHeaders: () => { [key: string]: string }

    /**
     * remove the header
     */
    removeHeader: (...headerNames: string[]) => void

    /**
     * set the new query or update the existing query
     */
    addQueryParam: (queryName: string, queryValue: string) => void

    /**
     * update the existing query
     */
    updateQueryParam: (queryName: string, queryValue: string) => void

    /**
     * return the query value
     */
    getQueryParam: (queryName: string) => string | undefined

    /**
     * remove the query
     */
    removeQueryParam: (...queryNames: string[]) => void

    /**
     * returns a js object, { [queryName]: queryValue,... } 
     */
    getQueries: () => { [key: string]: string }
}


export interface IRequestAssertions {
    /**
     * should have request URL same
     */
    url: (url: IUrl) => void

    /**
     * should have request method same
     */
    method: (method: string) => void

    /**
     * should have query
     */
    query: (queryName: string) => void

    /**
     * should have header
     */
    header: (headerName: string) => void

    /**
     * should have body set/have body of content type
     */
    body: (contentType?: string) => void
}