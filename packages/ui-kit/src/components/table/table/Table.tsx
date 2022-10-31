import { FC, useEffect, useState, ReactNode, useRef } from 'react';
import {
  ColumnResizeMode,
  getCoreRowModel,
  useReactTable,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import cx from 'classnames';
import TableDraggableRow from './TableDraggableRow';
import '../../table-v3/primary-table/table.sass';

const Table: FC<ITable> = ({
  name = '',
  data = [],
  columns,
  resizable = false,
  columnRenderer = () => {},
  cellRenderer = () => {},
  width = 200,
  options = {},
}) => {
  const [tableData, setTableData] = useState(() => []);
  const [dragId, setDragId] = useState(0);
  const [containerWidth, setContainerWidth] = useState(width);

  const tableRef = useRef<HTMLTableElement>(null);
  const containerDivRef = useRef<HTMLTableElement>(null);

  const [columnResizeMode, setColumnResizeMode] =
    useState<ColumnResizeMode>('onChange');

  const columnHelper = createColumnHelper<any>();

  const columnDisplay = [
    ...columns.map((column) =>
      columnHelper.accessor(column.name, {
        id: column.name,
        ...(typeof column.width !== 'undefined' ? { size: column.width } : {}),
        minSize:
          typeof column.minSize !== 'undefined'
            ? column.minSize
            : typeof options.minColumnSize !== 'undefined'
            ? options.minColumnSize
            : 50,
        enableResizing:
          typeof column.enableResizing !== 'undefined'
            ? column.enableResizing
            : false,
        header: (col) => {
          return columnRenderer(
            typeof column.displayName !== 'undefined'
              ? column.displayName
              : column.name
          );
        },
        cell: ({ cell }) => {
          const value = cell.getValue();
          if (cell.getValue() !== 'undefined') {
            return cellRenderer({
              value,
              rowIndex: cell.row.index,
              columnId: cell.column.id,
              column: cell.column,
            });
          } else {
            return <></>;
          }
        },
      })
    ),
  ];

  useEffect(() => {
    setTableData(data);
  }, [data]);

  //get the width of container div in pixels
  useEffect(() => {
    if (!containerDivRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      setContainerWidth(containerDivRef.current.clientWidth);
    });
    resizeObserver.observe(containerDivRef.current);
    return () => resizeObserver.disconnect();
  }, [containerDivRef.current]);

  const table = useReactTable({
    data: tableData,
    columns: columnDisplay,
    enableColumnResizing: resizable,
    ...(resizable ? { columnResizeMode: columnResizeMode } : {}),
    getCoreRowModel: getCoreRowModel(),
  });

  const drag = (rowIndex: number) => {
    setDragId(rowIndex);
  };

  //reorder the index value for the table rows
  const drop = (rowIndex: number) => {
    tableData.splice(rowIndex, 0, tableData.splice(dragId, 1)[0]);
    setTableData([...tableData]);
  };

  return (
    <div
      className={cx(
        `w-full custom-scrollbar m-auto max-w-[calc(100%-24px)]`,
        options.containerClassName
      )}
      ref={containerDivRef}
    >
      <table
        className="primary-table border border-appBorder mb-4"
        id={name}
        ref={tableRef}
        style={{
          width: table.getTotalSize(),
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              className="border text-base text-left font-semibold bg-focus2"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <Th
                    key={header.id}
                    className={cx(
                      'overflow-hidden overflow-ellipsis whitespace-nowrap'
                    )}
                    style={{
                      minWidth:
                        header.index === columnDisplay.length - 1 &&
                        containerWidth > table.getTotalSize()
                          ? header.getSize() +
                            (containerWidth - table.getTotalSize() - 4)
                          : header.getSize(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getCanResize() && (
                      <div
                        data-testid="col-resizer"
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`pt-resizer h-full ${
                          header.column.getIsResizing() ? 'pt-resizing' : ''
                        }`}
                      ></div>
                    )}
                  </Th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <TableDraggableRow
                key={row.original.key}
                row={row}
                handleDrag={drag}
                handleDrop={drop}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
export type { ITable, ITableRow, TPlainObject };

const Th: FC<ITh> = ({ children = <></>, className = '', style = {} }) => {
  return (
    <th className={cx('p-1 border border-appBorder', className)} style={style}>
      {children}
    </th>
  );
};

export const Td: FC<ITd> = ({ children, className = '', style = {} }) => {
  return (
    <td
      className={cx(
        'border-b border-l first:border-l-0 border-appBorder',
        className
      )}
      style={style}
    >
      {children}
    </td>
  );
};

type TPlainObject = { [K: string]: any };
type ITable = {
  /** provide a unique id for the table */
  name: string;

  /** array of columns to be rendered, column should follow IColumn type */
  columns: Array<IColumn>;

  /** array of data to be rendered in table */
  data: Array<TPlainObject>;

  /** allow table columns to resize*/
  resizable: boolean;

  /** Component to format the column headings*/
  columnRenderer: (column: object | string) => string | JSX.Element;

  /** Component to format the table cell */
  cellRenderer: (cell: object) => string | JSX.Element;

  /** Minimum width for the table component*/
  width: number;

  /** table options */
  options: ITableOptions;
};
type ITableOptions = {
  /** class name for table wrapper div */
  containerClassName?: string;

  /** minimum column width (if not defined in columns object) */
  minColumnSize?: number;
};
type IColumn = {
  name: string;
  displayName?: string;
  width?: number;
  minSize?: number;
  maxSize?: number;
  enableResizing?: boolean;
};
type ITableRow = {
  row: TPlainObject;
  index?: number;
  handleDrop: Function;
  handleDrag: Function;
};
type ITh = { children: ReactNode; className?: string; style?: TPlainObject };
type ITd = { children: ReactNode; className?: string; style?: TPlainObject };

export const TableInput = (props: any) => {
  let { autoFocus, cell, rows, onChange } = props;
  const [inputValue, setInputValue] = useState(cell.value);

  return (
    <Td
      style={{ width: cell.column.getSize() }}
      className={
        ' h-[30px] relative overflow-hidden overflow-ellipsis whitespace-nowrap align-baseline'
      }
    >
      <input
        type="text"
        placeholder={``}
        value={inputValue}
        autoFocus={autoFocus}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onBlur={(e) => {
          let updatedRow = Object.assign([], rows);
          updatedRow[cell.rowIndex] = {
            ...updatedRow[cell.rowIndex],
            [cell.columnId]: e.target.value,
          };
          onChange(updatedRow);
        }}
        className="text-appForeground bg-appBackground h-[29px]  w-full
                            absolute top-0 left-0 !border-0 p-1 text-base overflow-ellipsis focus:!border-0"
      />
    </Td>
  );
};

export const TableColumnHeading = ({ heading }: TPlainObject) => {
  return <>{heading}</>;
};