import { TId } from '../..'
import {
    IRestExample,
    IRest,
    IResponse,
    IRestBody,
} from '../../requests'
import { Auth } from '../auth'
import { Header } from '../header'
import { Url } from '../url'


/**
 * Rest request example for export collection
 */
export interface Example extends Omit<IRestExample, 'url' | 'body' | 'headers' | 'response' | '__ref'> {
    url: Url
    body?: IRestBody
    headers?: Array<Header>
    response?: Omit<IResponse, 'headers'> & {
        headers?: Array<Header>
    }
}

/**
 * Http request for export collection
 */
export interface Rest extends Omit<IRest, '__ref' | 'url' | 'headers' | 'body' | 'auth' | 'examples'> {
    /**
     * request url
     */
    url: Url
    headers?: Header[]
    body?: IRestBody
    /**
     * request auth payload
     */
    auth?: Auth
    __ref: {
        id: TId
        folderId?: TId
    }
}
