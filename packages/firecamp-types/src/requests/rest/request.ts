import {
    IUrl,
    IAuth,
    IHeader,
    EHttpMethod,
    ERequestTypes,
    IScript,
} from "../../common"
import { IMeta, IRef } from '../common'
import { IRestBody } from './body'
import { IRestConfig } from './config'
import { IRestExample } from './example'

/**
 * rest request payload
 */
export interface IRest {
    /**
     * http request url
     * reference: https://www.npmjs.com/package/url-parse
     */
    url?: IUrl
    /**
     * http request method
     * doc: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
     */
    method: EHttpMethod | string
    /**
     * request auth payload
     */
    auth?: IAuth
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
     * http request body
     */
    body?: IRestBody

    /** request pre scripts, will execute in sequence before request execution start */
    preScripts: IScript[],

    /** request post scripts, will execute in sequence after request execution completion */
    postScripts: IScript[],

    /**
     * http request examples list
     */
    examples?: IRestExample[]

    /** metadata about request */
    __meta: Omit<IMeta, 'type' | 'version'> & {

        /**
         * request type
         */
        type: ERequestTypes.Rest
        /**
         * request version
         */
        version: '2.0.0'
    }
    /** request reference info */
    __ref: IRef
}