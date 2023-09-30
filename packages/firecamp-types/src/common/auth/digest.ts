/**
 * @ref: https://datatracker.ietf.org/doc/html/rfc7616
 */
export interface IAuthDigest {
    password: string
    username: string
    realm?: string
    nonce?: string
    algorithm?: string
    qop?: string
    nonceCount?: string
    clientNonce?: string
    opaque?: string
}
