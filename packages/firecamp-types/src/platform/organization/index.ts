import { TId } from '../../common'

/**
 * firecamp organization, where multiple org. created
 * where each org. contains multiple workspaces
 */
export interface IOrganization {
    description?: string
    name: string
    __ref: {
        createdAt?: Date | number
        createdBy?: string
        id: TId
    }
}