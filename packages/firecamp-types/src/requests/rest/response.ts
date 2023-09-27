import { IHeader } from '../../common'
import { EHttpVersion } from './config'
import { ICurlRequestNetworkInfo, ICurlRequestSizeInfo, ICurlRequestTimeInfo } from './curl'

export interface IRestResponse {
    /**
     * response body
     */
    body?: any
    /**
     * total time of request execution start to finished
     */
    responseTime?: number
    /**
     * For axios lib. return the whole response body size
     */
    responseSize?: number
    /**
     * curl request's response size
     * @note supported on web and desktop app only
     */
    curlRequestSize?: ICurlRequestSizeInfo
    /**
     * HTTP version used while request execution
     * @note supported on web and desktop app only
     */
    httpVersion?: EHttpVersion
    /**
     * HTTP response status code
     */
    code?: number
    /**
     * HTTP response status message
     */
    status?: string
    /**
     * response headers
     */
    headers?: IHeader[]
    /**
     * cookies received from the server
     */
    cookies?: any[]
    /**
     * error occur in request execution
     */
    error?: {
        message?: string,
        code?: string | number,
        /** actual error with stack if available */
        e?: any
    }
    /**
     * detail log of request execution
     * @note supported on web and desktop app only
     */
    timeline?: string
    /**
     * Option available in electron agent only
     *
     * Contains the timeline chart of the request
     * execution
     * @note supported on web and desktop app only
     */
    times?: Array<ICurlRequestTimeInfo>
    /**
     * Option available in electron agent only
     *
     * Contains the details network info. of the request
     * execution
     * @note supported on web and desktop app only
     */
    network?: Array<ICurlRequestNetworkInfo>
}