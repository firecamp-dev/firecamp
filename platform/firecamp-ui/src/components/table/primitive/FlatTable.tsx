import { FC, useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import cx from 'classnames';
import { _array, _misc, _object } from '@firecamp/utils';
import {
  ITable,
  ITableOptions,
  TOnChangeCell,
  TTableApi,
  TPlainObject,
} from './table.interfaces';
import { TableRow, TBody, Th, THead, Tr } from './TableElements';
import useTableResize from './useTableResize';
import './table.sass';

const defaultOptions: ITableOptions = {
  disabledColumns: [],
  hiddenColumns: [],
  allowRowRemove: true,
  allowRowAdd: true,
  allowSort: true,
};

const prepareTableInitState = (
  rows: any[],
  showDefaultEmptyRows?: boolean,
  defaultRow?: TPlainObject
) => {
  if (_array.isEmpty(rows)) {
    const row1Id = nanoid();
    const row2Id = nanoid();
    rows = showDefaultEmptyRows
      ? [
          { id: row1Id, ...defaultRow },
          { id: row2Id, ...defaultRow },
        ]
      : [];
  }
  return rows;
};

/**
 * FltTable is very much similar to primitive table expect it's meant to built for LogTable with virtual scroll
 * another difference is the state is managed with Row[] instead of { rows:{}, orders: []} in primitive table
 * we can merge both tables after reviewing the performance
 */
const FlatTable: FC<ITable<any>> = ({
  columns,
  renderCell,
  renderColumn,
  rows: propRows = [],
  defaultRow = {},
  onChange,
  onFocusRow,
  onMount = (api) => {},
  showDefaultEmptyRows = true,
  options = {},
  classes = {
    container: '',
    table: '',
    thead: '',
    theadTr: '',
    tbody: '',
    th: '',
    tr: '',
    td: '',
  },
}) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const tableRowRef = useRef<HTMLTableRowElement>(null);
  const rowBeingDragRef = useRef<HTMLTableElement>(null);
  const [rows, setRows] = useState<any[]>(
    prepareTableInitState(propRows, showDefaultEmptyRows, defaultRow)
  );
  useTableResize(tableRef);

  const containerDivRef = useRef<HTMLTableElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  //get the width of container div in pixels
  useEffect(() => {
    if (!containerDivRef.current) return () => {};
    const resizeObserver = new ResizeObserver(() => {
      if (containerDivRef?.current)
        setContainerWidth(containerDivRef.current?.clientWidth);
    });
    resizeObserver.observe(containerDivRef.current);
    return () => {
      if (containerDivRef?.current) containerDivRef.current = null;
      return resizeObserver.disconnect();
    };
  }, [containerDivRef.current]);

  useEffect(() => {
    onMount(tableApi);
  }, []);

  // useEffect(() => {
  //   setRows(prepareTableInitState(propRows, showDefaultEmptyRows, defaultRow));
  // }, [propRows]);

  options = { ...defaultOptions, ...options };

  const handleDrag = (row: any) => {
    rowBeingDragRef.current = row;
    // console.log(row, index, 'handleDrag');
  };

  const handleDrop = (row: any) => {
    setRows((rs) => {
      const dragIndex = rs.findIndex(
        (r: any) => r.id == rowBeingDragRef.current.id
      );
      const dropIndex = rs.findIndex((r: any) => r.id == row.id);
      rowBeingDragRef.current = null;
      rs.splice(dropIndex, 0, rs.splice(dragIndex, 1)[0]);
      _onChangeTable(rs);
      return rs;
    });
  };

  const _onChangeTable = (rows: any[]) => {
    onChange(rows);
  };

  const onChangeCell: TOnChangeCell = (
    cellKey: string,
    cellValue: any,
    rowId: string,
    e: any
  ) => {
    setRows((rs) => {
      rs = rs.map((r) => {
        if (r.id == rowId) {
          return { ...r, [cellKey]: cellValue };
        }
        return r;
      });
      _onChangeTable(rs);
      return rs;
    });
  };

  const getRows = () => {
    return rows;
  };

  // each render assign apis to parent ref
  const tableApi: TTableApi<any> = {
    initialize: _misc.debounce(100, (rows: any[]) => {
      setRows(rows);
    }),
    // initialize: (rows: any[]) => {
    //   setRows(rows);
    // },
    // TODO: this is not working as of now, fix it later
    getRows,
    addRow: () => {
      if (!options.allowRowAdd) return;
      const id = nanoid();
      const row = { ...defaultRow, id };
      setRows((s) => {
        _onChangeTable(rows);
        return [...s, row];
      });
    },
    setRow: (row: any) => {
      if (!row?.id) return;
      setRows((s) => {
        rows.map((r) => {
          if (r.id == row.id) {
            return row;
          }
          return r;
        });
        _onChangeTable(rows);
        return rows;
      });
    },
    removeRow: (rowId: string | number) => {
      if (!options.allowRowRemove) return;
      setRows((s) => {
        const _rs = rows.filter((r) => r.id !== rowId);
        _onChangeTable(_rs);
        return _rs;
      });
    },
  };

  return (
    <div
      className={`w-full custom-scrollbar ${classes.container}`}
      ref={containerDivRef}
    >
      <table
        className={`primary-table border border-appBorder mb-4 w-auto ${classes.table}`}
        style={{ minWidth: '450px' }}
        ref={tableRef}
        onKeyDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          // console.log(tableRowRef.current?.nextElementSibling);
          switch (e.key) {
            case 'ArrowUp':
              const previousTr = tableRowRef.current
                ?.previousElementSibling as HTMLTableRowElement;
              if (previousTr) previousTr.focus();

              break;
            case 'ArrowDown':
              const nextTr = tableRowRef.current
                ?.nextElementSibling as HTMLTableRowElement;
              if (nextTr) nextTr.focus();

              break;
            default:
              break;
          }
        }}
      >
        <THead className={classes.thead}>
          <Tr
            className={`border text-base text-left font-semibold bg-focus2 ${classes.theadTr}`}
          >
            {columns.map((c, i) => {
              return (
                <Th
                  className={cx(classes.th, {'hidden': options?.hiddenColumns?.includes(c.key)})}
                  style={{
                    width: c.resizeWithContainer ? '100%' : parseInt(c.width),
                    minWidth:
                      !c.fixedWidth &&
                      c.resizeWithContainer &&
                      containerWidth > tableRef.current?.clientWidth
                        ? parseInt(c.width) +
                          (containerWidth - tableRef.current.clientWidth - 4)
                        : c.width,
                  }}
                  key={i}
                  additionalProp={{
                    'data-allow_resize': !c.fixedWidth,
                    'data-initial_width': c.width,
                  }}
                >
                  {renderColumn(c)}
                </Th>
              );
            })}
          </Tr>
        </THead>
        <TBody className={classes.tbody}>
          {rows.map((row: any, i: number) => {
            return (
              <TableRow
                classes={{ tr: classes.tr, td: classes.td }}
                columns={columns}
                index={i}
                key={i}
                row={row}
                tableApi={tableApi}
                renderCell={renderCell}
                handleDrag={handleDrag}
                handleDrop={handleDrop}
                options={options}
                onChangeCell={onChangeCell}
                onFocus={(rowDom) => {
                  tableRowRef.current = rowDom;
                  if (typeof onFocusRow == 'function') onFocusRow(row);
                }}
                onClick={(rowDom) => {
                  // console.log(rowDom);
                  tableRowRef.current = rowDom;
                  setTimeout(() => {
                    tableRowRef.current.focus();
                  });
                }}
              />
            );
          })}
        </TBody>
      </table>
    </div>
  );
};

export default FlatTable;
export type { ITable, TTableApi };
