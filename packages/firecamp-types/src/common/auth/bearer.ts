/**
 * @ref: https://datatracker.ietf.org/doc/html/rfc6750
 */
export interface IAuthBearer {
    token: string
    prefix?: string | 'Bearer'
}
