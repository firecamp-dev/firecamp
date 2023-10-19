import {
    ERequestTypes
} from '../../common'
import { IMeta, IRef } from '../common'
import { EFileRequestVersion } from './version'

/**
 * Type of data file request contains
 */
export enum EFileDataType {
    MarkDown = 'md',
    Json = 'json',
    Xml = 'xml',
    Yaml = 'yaml',
    JS = 'js'
}

/**
 * file request payload
 */
export interface IFile {
    /**
     * File data
     */
    data: string
    /**
     * metadata about request
     */
    __meta: Omit<IMeta, 'type' | 'version' | 'fOrders' | 'iOrders'> & {
        /**
         * Type of data file request contains
         */
        dataType: EFileDataType
        /**
         * file type
         */
        type: ERequestTypes.File
        /**
         * request version
         */
        version?: EFileRequestVersion.V1
    }
    /**
     * request reference info.
     */
    __ref: IRef
}
