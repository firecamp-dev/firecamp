import {
    IOAuth2Code,
    EOAuth2Types,
    IOAuth2Password,
    IOAuth2Implicit,
    IOAuth2ClientCredentials,
    IAuth,
    EAuthTypes
} from '..'

// set specific grant_type
export interface OAuth2Code extends Omit<IOAuth2Code, 'grant_type'> {
    grant_type: EOAuth2Types.Code
}

// set specific grant_type

export interface OAuth2Password extends Omit<IOAuth2Password, 'grant_type'> {
    grant_type: EOAuth2Types.Password
}

// set specific grant_type

export interface OAuth2Implicit extends Omit<IOAuth2Implicit, 'grant_type'> {
    grant_type: EOAuth2Types.Implicit
}

// set specific grant_type
export interface OAuth2ClientCredentials extends Omit<IOAuth2ClientCredentials, 'grant_type'> {
    grant_type: EOAuth2Types.ClientCredentials
}

/**
 * types of oauth2 config.
 */
export interface Auth extends Omit<IAuth, EAuthTypes.OAuth2> {
    /**
     * doc: https://datatracker.ietf.org/doc/html/rfc6749
     */
    [EAuthTypes.OAuth2]?: OAuth2Code | OAuth2Password | OAuth2Implicit | OAuth2ClientCredentials
}