import { TId } from "./general"

/** Request path */
export type TRequestPath = {
    path: string,
    items: { id: TId, path: string }[]
}