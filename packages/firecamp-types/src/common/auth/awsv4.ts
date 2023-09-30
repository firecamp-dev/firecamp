/**
 * @ref: https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-auth-using-authorization-header.html
 */
export interface IAuthAwsV4 {
    accessKey: string
    region?: string
    secretKey: string
    service?: string
    sessionToken?: string
}
