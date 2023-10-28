import { ERequestTypes } from './request-types'
import { TId } from '.'

/**
 * request collection item
 */
export interface IRequestItem<V, M> {
     /** request item name */
      name: string
    
      value: V
      /** request item __meta */
      __meta: M,
      /**
       * request item reference info
       */
      __ref: {
          id: TId,
          collectionId: TId
          requestId: TId
          requestType: ERequestTypes
          folderId?: TId
          createdAt?: Date | number
          createdBy?: string
          updatedAt?: Date | number
          updatedBy?: string
      }
}
