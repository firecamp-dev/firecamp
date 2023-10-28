import { TId, ERequestTypes } from '../..'
import {
    IGraphQL,
    IGraphQLPlayground,
    IRestConfig
} from '../../requests'
import { Header } from '../header'
import { Url } from '../url'

// omit reference info. as not require in export payload
export interface GraphQLPlayground extends Omit<IGraphQLPlayground, '__ref'> {
    /**
     * reference info for leaf
     */
    __ref: {
        id: TId,
        requestId: TId
        requestType: ERequestTypes.GraphQL
        folderId?: TId
    }
}

/**
 * GraphQL request for export collection
 */
export interface GraphQL extends Omit<IGraphQL, '__ref' | 'url' | 'headers' | 'examples'> {
    /**
     * request url
     */
    url: Url
    /**
     * request headers
     */
    headers?: Header[]
    /**
     * request config
     */
    config: IRestConfig
    __ref: {
        id: TId
        folderId?: TId
    }
}
