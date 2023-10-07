export enum EOAuth2Types {
    Implicit = 'implicit',
    Password = 'password',
    ClientCredentials = 'clientCredentials',
    Code = 'code'
}

export interface IOAuth2Code {
    grantType: EOAuth2Types.Code
    callback: string
    authUrl: string
    accessTokenUrl: string
    clientId: string
    clientSecret: string
    scope?: string
    state?: string
}

export interface IOAuth2Password {
    grantType: EOAuth2Types.Password
    accessTokenUrl: string
    username: string
    password: string
    clientId: string
    clientSecret: string
    scope?: string
}

export interface IOAuth2Implicit {
    grantType: EOAuth2Types.Implicit
    callback: string
    authUrl: string
    clientId: string
    scope?: string
    state?: string
}

export interface IOAuth2ClientCredentials {
    grantType: EOAuth2Types.ClientCredentials
    accessTokenUrl: string
    clientId: string
    clientSecret: string
    scope?: string
}

/**
 * @ref: https://datatracker.ietf.org/doc/html/rfc6749
 */
export type IOAuth2 = IOAuth2Code | IOAuth2Implicit | IOAuth2Password | IOAuth2ClientCredentials