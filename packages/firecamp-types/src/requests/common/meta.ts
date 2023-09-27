import { ERequestTypes } from '../..'

/**
 * metadata of the request
 */
export interface IMeta {
    /**
     * request name
     */
    name: string
    /**
     * request description
     */
    description?: string
    /**
     * request version
     */
    version: string
    /**
     * request type
     */
    type: ERequestTypes
}