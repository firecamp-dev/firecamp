import { ColumnResizeMode, getCoreRowModel, useReactTable, flexRender, createColumnHelper } from '@tanstack/react-table';
import React, { FC, useEffect, useState, ReactNode, useRef } from 'react';
import TableDraggableRow from "./TableDraggableRow";
import cx from "classnames";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend"
import "../../table-v3/primary-table/table.sass";

const Table: FC<ITable> = ({
    name = "",
    data = [],
    columns,
    tableResizable = false,
    columnRenderer = () => { },
    cellRenderer = () => { },
    tableWidth = 200
}) => {

    const [tableData, setTableData] = useState(() => [])

    const [columnResizeMode, setColumnResizeMode] = React.useState<ColumnResizeMode>('onChange')

    const columnHelper = createColumnHelper<any>()

    const columnDisplay = [
        ...columns.map(column => columnHelper.accessor(column.name,
            {
                id: (typeof column.displayName !== "undefined" ? column.displayName : column.name),
                ...(typeof column.width !== "undefined" ? { size: column.width } : {}),
                enableResizing: (typeof column.enableResizing !== "undefined") ? column.enableResizing: false,
                header: (col) => {
                    return columnRenderer(col.header.id)
                },
                cell: (props) => {
                    return cellRenderer(props)
                },
            }
        ))
    ];

    const tableRef = useRef<HTMLTableElement>(null);

    useEffect(() => {
        setTableData(data)
    }, [data]);

    const table = useReactTable({
        data: tableData,
        columns: columnDisplay,
        enableColumnResizing: tableResizable,
        ...(tableResizable ? { columnResizeMode: columnResizeMode } : {}),
        getCoreRowModel: getCoreRowModel(),
    });

    //reorder the index value for the table rows
    const reorderRow = (draggedRowIndex: number, targetRowIndex: number) => {
        tableData.splice(targetRowIndex, 0, tableData.splice(draggedRowIndex, 1)[0])
        setTableData([...tableData])
    }

    return (
        <div className={`w-full`} 
        // style={{ width: tableWidth + "px", overflowX: "auto" }} //to only keep the table container div within the provided width
    >

            <DndProvider backend={HTML5Backend}>
                <table className="primary-table border border-appBorder mb-4"
                    id={name}
                    ref={tableRef}
                    style={{
                        minWidth: table.getTotalSize() + (tableWidth - table.getTotalSize()), //adding additional width to table to match the whole div width
                        width: table.getTotalSize()
                    }}>
                    <thead>

                        {table.getHeaderGroups().map(headerGroup =>
                            <tr className="border text-base text-left font-semibold bg-focus2" key={headerGroup.id}>
                                {
                                    headerGroup.headers.map(header => {
                                        return <Th key={header.id}
                                            // className={`relative h-30 border overflow-ellipsis overflow-hidden ${!header.column.getCanResize() ? " w-auto" : ""}`}
                                            style={{ width: header.getSize() }}>
                                            {
                                                header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )
                                            }
                                            {
                                                header.column.getCanResize() && (
                                                    <div
                                                        onMouseDown={header.getResizeHandler()}
                                                        onTouchStart={header.getResizeHandler()}
                                                        className={`pt-resizer h-full ${header.column.getIsResizing() ? 'pt-resizing': ''}`}
                                                        // className={`absolute h-full w-2 block right-0 top-0 pt-resizer ${header.column.getIsResizing() ? 'pt-resizing' : ''}`}
                                                    ></div>)
                                            }
                                        </Th>
                                    })
                                }
                            </tr>)}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => {
                            return <TableDraggableRow key={row.original.id} row={row} reorderRow={reorderRow} />
                        })}

                    </tbody>
                </table>
            </DndProvider>
        </div>)
};

export default Table;
export type { ITable, ITableRow, TPlainObject }

const Th: FC<ITh> = ({ children = <></>, className = "", style = {} }) => {

    return (
        <th className={cx("p-1 border border-appBorder", className)} style={style}>
            {children}
        </th>
    )
}

export const Td: FC<ITd> = ({ children, className="", style={} })=> {
    return (
        <td className={cx("border-b border-l first:border-l-0 border-appBorder", className)}>
            {children}
        </td>
    )
}

type TPlainObject = { [K: string]: any }
type ITable = {
    name: string,
    data: Array<TPlainObject>,
    tableResizable: boolean,
    columns: Array<IColumn>,
    columnRenderer: (column: object | string) => string | JSX.Element,
    cellRenderer: (cell: object) => string | JSX.Element,
    tableWidth: number
}
type IColumn = {
    name: string,
    displayName?: string,
    width?: number,
    enableResizing?: boolean
}
type ITableRow = {
    reorderRow : Function
    row: TPlainObject,
    index?: number
}
type ITh = { children: ReactNode, className?: string, style?: TPlainObject}
type ITd = { children: ReactNode, className?: string, style?: TPlainObject}
