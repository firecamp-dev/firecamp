import {
    IHeader,
    IUrl,
    EHttpMethod,
    ERequestTypes
} from '../../common'
import { IRestConfig } from '../rest/config'
import { IMeta, IRef } from '../common'

/**
 * graphql request payload
 */
export interface IGraphQL {

    /**
     * graphql request method
     * doc: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
     */
    method: EHttpMethod
    /**
     * graphql request url
     * reference: https://www.npmjs.com/package/url-parse
     */
    url?: IUrl
    /**
     * Allow to configure http request
     * Supported in desktop app only
     * 
     * reference: https://node-libcurl-docs.netlify.app/interfaces/_lib_generated_curloption_.curloption.html
     */
    config?: IRestConfig
    /**
     * request headers
     */
    headers?: IHeader[]

    /**
     * metadata about request
     */
    __meta: Omit<IMeta, 'type' | 'version'> & {
        /**
         * request type
         */
        type: ERequestTypes.GraphQL
        /**
         * request version
         */
        version: '2.0.0'
    }
    /**
     * request reference info.
     */
    __ref: IRef
}
