/**
 * reference: https://curl.se/libcurl/c/CURLOPT_HTTP_VERSION.html
 */
export enum EHttpVersion {
    /**
     * Setting this means we don't care, and that we'd
     * like the library to choose the best possible
     * for us!
     */
    None = 'None',
    /**
     * Enforce HTTP 1.0 requests.
     */
    V1_0 = 'V1_0',
    /**
     * Enforce HTTP 1.1 requests.
     */
    V1_1 = 'V1_1',
    /**
     * Attempt HTTP 2 requests.
     */
    V2_0 = 'V2_0',
    /**
     * Attempt HTTP 2 over TLS (HTTPS) only.
     */
    V2Tls = 'V2Tls',
    /**
     * Issue non-TLS HTTP requests using HTTP/2 without HTTP/1.1 Upgrade.
     */
    V2PriorKnowledge = 'V2PriorKnowledge',
    v3 = 'v3'
}

/**
 * Allow to configure http request
 * Supported in desktop app only
 */
export interface IRestConfig {
    /**
     * follow HTTP 3xx redirects. Defaults to 0, disabled
     * 
     * Defaults to true
     * 
     * Reference: https://curl.se/libcurl/c/CURLOPT_FOLLOWLOCATION.html
     */
    followLocation?: boolean

    /**
     * HTTP protocol version to use. Defaults to V2_0_Tls
     * 
     * Reference: https://curl.se/libcurl/c/CURLOPT_HTTP_VERSION.html
     */
    httpVersion?: EHttpVersion

    /**
     * maximum number of redirects allowed. Defaults to -1, unlimited
     * 
     * Defaults to -1
     * 
     * Reference: https://curl.se/libcurl/c/CURLOPT_MAXREDIRS.html
     */
    maxRedirects?: number

    /**
     * set in header. Defaults to null
     */
    origin?: string

    /**
     * If not false a server automatically reject clients with invalid certificates
     * 
     * Defaults to false
     */
    rejectUnauthorized?: boolean

    /**
     * maximum time the transfer is allowed to complete
     * Default timeout is 0 (zero) which means it never times out during transfer.
     * 
     * default: 0
     * 
     * Reference: https://curl.se/libcurl/c/CURLOPT_TIMEOUT_MS.html
     */
    requestTimeout?: number

    /**
     * HTTP user-agent header. Defaults to 'Firecamp_${app_version}'
     * 
     * Reference: https://curl.se/libcurl/c/CURLOPT_USERAGENT.html
     */
    userAgent?: string
}
