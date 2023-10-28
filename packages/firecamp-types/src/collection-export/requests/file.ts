import { TId } from '../..'
import { IFile } from '../../requests'

/**
 * file request payload
 */
export interface File extends Omit<IFile, '__ref'> {
    __ref: {
        id: TId
        folderId?: TId
    }
}