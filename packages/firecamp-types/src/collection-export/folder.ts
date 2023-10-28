import { IFolder, TId } from '..'
import { Auth } from './auth'

/**
 * collection schema folder payload
 */
export interface Folder extends Omit<IFolder, '__ref' | 'auth'> {
    /**
     * authentication applied on children rest request
     */
    auth?: Auth
    /**
     * reference info. of the folder
     */
    __ref: {
        /**
         * folder id
         */
        id: TId
        /**
         * folder parent folder id
         */
        folderId?: TId
    }
} { }
