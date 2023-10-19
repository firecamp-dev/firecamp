import { TId } from '../..'

/**
 * represents the ssl certificate setting
 */
export interface ICertificate {
    __meta: {
        /**
         * default: false
         */
        disable: boolean
        /**
         * certificate path in system
         */
        filePath: string
        /**
         * request host for which certificate apply
         */
        host: string
        /**
         * sync certificate path with remote system
         * default: false
         */
        sync: boolean
        /**
         * certificate type
         */
        type: 'ssl'
    },
    __ref: {
        createdAt: string
        /**
         * user id 
         */
        createdBy: TId
        /**
         * preference type
         */
        type: 'certificate'
        /**
         * preference identity
         */
        id: TId
    }
}

/**
 * represents the proxy setting apply for the REST request
 */
export interface IProxy {
    /**
     * proxy server endpoint
     */
    url: string
    /**
     * disable proxy use for specific hosts
     * 
     * @reference: https://curl.se/libcurl/c/CURLOPT_NOPROXY.html
     */
    noProxy: string
    /**
     * host strings separated by comma on which proxy applied
     */
    setFor: string
    /**
     * allow or not to access secure domain
     * default true
     */
    rejectUnauthorized: boolean
    /**
     * disable the proxy to apply
     * default: true
     */
    disable: false
    /**
     * proxy reference info.
     */
    __ref: {
        /**
         * unique identity of the proxy
         */
        id: string
        /**
         * date and time when proxy created
         */
        createdAt?: Date | number
        /**
         * used id who created the proxy
         */
        createdBy?: TId
    }
}