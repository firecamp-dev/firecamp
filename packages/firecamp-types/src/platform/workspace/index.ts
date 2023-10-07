import { TId } from '../../common'

export enum EWorkspaceType {
    Personal = 1,
    Organization = 2
}

export interface IWorkspace {
    name: string
    description: string
    __meta: {
        /**
         * @deprecated: active environment managed in user preference
         */
        activeEnv?: string
        cOrders: TId[]
        type: EWorkspaceType
    }
    __ref: {
        createdAt?: Date | number
        createdBy?: string
        updatedAt?: Date | number
        updatedBy?: string
        orgId?: TId
        id: TId
    }
}