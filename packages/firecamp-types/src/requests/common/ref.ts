import { TId } from '../..'

/**
 * reference info. of request
 */
export interface IRef {
    id: TId
    collectionId: TId
    folderId?: TId
    createdAt?: Date | number
    createdBy?: string
    updatedAt?: Date | number
    updatedBy?: string
}