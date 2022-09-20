import { IRowCellMeta, ITableMeta } from './index'

export interface IPrimaryIFT {

    /**
     * Table rows
     */
    rows: Array<IRowCellMeta>

    /**
     * Whether table is mutable or not.
     */
    disable?: boolean

    /**
     * Table title/ label
     */
    title: string

    /**
     * Update table data
     */
    onChange?: (updates: Array<IRowCellMeta>) => void

    /**
     * Table meta data
     */
    meta?: ITableMeta
}