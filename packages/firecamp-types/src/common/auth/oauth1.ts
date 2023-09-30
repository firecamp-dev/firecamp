export enum EOAuth1Signature {
    hmacSHA1 = 'HMAC-SHA1',
    hmacSHA256 = 'HMAC-SHA256',
    rsaSHA1 = 'RSA-SHA1',
    plaintext = 'PLAINTEXT'
}

/**
 * @ref: https://oauth1.wp-api.org/docs/basics/Auth-Flow.html
 * https://www.rfc-editor.org/rfc/rfc5849#section-2.1
 * https://www.rfc-editor.org/rfc/rfc5849#section-2.3
 * https://www.rfc-editor.org/rfc/rfc5849#section-3.1
 * https://www.rfc-editor.org/rfc/rfc5849#section-3.1.5
 * 
 * The native oauth keys look like
 * oauth_consumer_key
 * oauth_token
 * oauth_token_secret
 * oauth_signature_method
 * oauth_version
 * oauth_callback
 * oauth_verifier
 * oauth_timestamp
 * oauth_nonce
 * realm
 */
export interface IOAuth1 {
    consumerKey: string,
    consumerSecret: string,
    tokenKey: string
    tokenSecret: string

    //optional
    signatureMethod?: EOAuth1Signature,
    version?: string
    callbackUrl?: string
    verifier?: string
    timestamp?: string,
    nonce?: string
    realm?: string
}