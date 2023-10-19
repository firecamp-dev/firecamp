import { TId } from '../../common'

export interface ISocketIOListener {
    id: TId,
    name: string;
    description?: string
}