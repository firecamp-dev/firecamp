import { flexRender, Row } from '@tanstack/react-table';
import { FC, Fragment } from 'react';
import { GrDrag } from '@react-icons/all-files/gr/GrDrag';
import { ITableRow, TPlainObject } from './Table';

const TableDraggableRow: FC<ITableRow> = (props) => {
  let { row, handleDrag, handleDrop } = props;

  return (
    <tr
      id={row.original.key}
      onDragStart={() => handleDrag(row.index)}
      draggable={true}
    >
      {row.getVisibleCells().map((cell: TPlainObject) => {
        return (
          <Fragment key={cell.id}>
            {cell.column.columnDef.accessorKey === 'action' ? (
              <td
                className={`border-b border-l first:border-l-0 border-appBorder`}
                style={{ width: cell.column.getSize() }}
                data-testid="row-sorter"
                onDrop={(e) => (e.preventDefault(), handleDrop(row.index))}
                onDragOver={(e) => e.preventDefault()}
              >
                <GrDrag />
              </td>
            ) : (
              flexRender(cell.column.columnDef.cell, cell.getContext())
            )}
          </Fragment>
        );
      })}
    </tr>
  );
};

export default TableDraggableRow;
