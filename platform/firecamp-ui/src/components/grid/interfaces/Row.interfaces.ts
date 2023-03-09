export interface IRow {
    /**
     * Unique identifier
     */
    id?: string

    className?: string
    children?: Function | JSX.Element | JSX.Element[]
    flex?: string|number
    overflow?: string|number
    width?: string|number
    maxWidth?: string|number
    minWidth?: string|number
    height?: string|number
    maxHeight?: string|number
    minHeight?: string|number
}