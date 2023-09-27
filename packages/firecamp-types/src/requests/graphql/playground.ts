import { IRequestItem } from '../../common/request-item'

export enum EGraphQLOperationType {
    Query = 'q',
    Mutation = 'm',
    Subscription = 's'
}

type TValue = {
    query: string,
    variables: string
}
type TMeta = {
    /**
    * TODO: Need to check the backward compatibility
    * @deprecated
    * Active query type, default: 'q'
    */
    type?: EGraphQLOperationType | ''
}

export interface IGraphQLPlayground extends IRequestItem<TValue, TMeta> { }