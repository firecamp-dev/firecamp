import { Request } from '.'
import { ICollection, TId } from '..'
import { Auth } from './auth'
import { Folder } from './folder'
import { RequestFolder } from './request-folder'
import { RequestItem } from './request-item'

/**
 * firecamp collection schema
 */
export interface Collection extends Omit<ICollection, '__meta' | '__ref' | 'auth'> {

    /**
     * collection root folders list
     */
    folders?: Folder[]
    /**
     * collection root requests list
     */
    requests?: Request[]
    /**
     * authentication applied on children rest request
     */
    auth?: Auth
    /**
     * request collection directory, which contains
     * group of leaves and sub-directories
     */
    requestFolders?: RequestFolder[]
    /**
     * request leaves
     */
    requestItems?: RequestItem[]

    /**
    * metadata about the collection
    */
    __meta: {

        /**
         * collection schema link
         */
        schema: string
        /**
         * collection version
         */
        version: '2.0.0'
        /**
         * collection root folders sequence orders list
         */
        fOrders?: TId[]
        /**
         * collection root requests orders list
         */
        rOrders?: TId[]
    },

    /** collection identity and references */
    __ref: {
        id: TId
    }
}