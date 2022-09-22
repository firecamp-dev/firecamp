import { flexRender, Row } from "@tanstack/react-table";
import { useDrag, useDrop } from "react-dnd";
import { FC, Fragment } from "react";
import { ITableRow, TPlainObject } from "./Table";

const TableDraggableRow : FC<ITableRow> = (props) => {

    let { row, reorderRow } = props

    const [, dropRef] = useDrop({
        accept: 'rows',
        drop: (draggedRow: ITableRow) => {
            reorderRow(draggedRow.index, row.index)
        },
    })

    const [{ isDragging }, dragRef, previewRef] = useDrag({
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
        item: () => row,
        type: 'rows',
    })

    return (<tr ref={previewRef}>
        {
            row.getVisibleCells().map((cell: TPlainObject) => {
                return <Fragment key={cell.id}>
                    {(cell.column.columnDef.accessorKey === "action") ?
                        <td className={`border-b border-l first:border-l-0 border-appBorder`} ref={dropRef}>
                            <button ref={dragRef}>🟰</button>
                        </td>
                        : flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Fragment>
            })
        }
    </tr>
    )
}


export default TableDraggableRow;