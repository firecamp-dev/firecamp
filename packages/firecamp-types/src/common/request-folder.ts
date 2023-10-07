import { ERequestTypes } from './request-types'
import { TId } from '.'

/**
 * request collection directory
 */
export interface IRequestFolder {
    /** folder name */
    name: string
    /** folder meta */
    __meta?: {
        fOrders?: TId[]
        iOrders?: TId[]
    }
    /** folder references */
    __ref: {
        id: TId,
        collectionId: TId
        requestId: TId
        folderId?: TId
        requestType: ERequestTypes
        createdAt?: Date | number
        createdBy?: string
        updatedAt?: Date | number
        updatedBy?: string
    },
}
