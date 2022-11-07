import {
  FC,
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { nanoid } from 'nanoid';
import { _array, _misc, _object } from '@firecamp/utils';
import cx from 'classnames';

import './table.sass';

const Table: FC<ITable<any>> = ({
  columns,
  renderCell,
  renderColumn,
  initialRows = [],
  defaultRow = {},
  onChange,
  onMount = (api) => {},
  showDefaultEmptyRows = true,
}) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const rowBeingDragRef = useRef<HTMLTableElement>(null);

  const [_state, _setState] = useState<TPlainObject>({
    orders: [],
    rows: {},
  });
  useTableResize(tableRef, _state.orders?.length);

  useEffect(() => {
    onMount(tableApi);
  }, []);

  const handleDrag = (row: any, index: number) => {
    rowBeingDragRef.current = row;
    // console.log(row, index, 'handleDrag');
  };

  const handleDrop = (row: any) => {
    _setState((st) => {
      const dragIndex = st.orders.findIndex(
        (id: string) => id == rowBeingDragRef.current.id
      );
      const dropIndex = st.orders.findIndex((id: string) => id == row.id);
      rowBeingDragRef.current = null;

      const { orders } = st;
      orders.splice(dropIndex, 0, st.orders.splice(dragIndex, 1)[0]);

      return {
        ...st,
        orders: [...orders],
      };
    });
  };

  useEffect(() => {
    let _initRows = {};
    let _orders = [];
    if (initialRows?.length) {
      _initRows = initialRows.reduce((p, n) => {
        const id: string = n.id || nanoid();
        _orders.push(id);
        return { ...p, [id]: { id, ...n } };
      }, {});
    }
    if (_object.isEmpty(_initRows)) {
      const row1Id = nanoid();
      const row2Id = nanoid();
      _orders.push(row1Id, row2Id);
      _initRows = showDefaultEmptyRows
        ? {
            [row1Id]: { id: row1Id, ...defaultRow },
            [row2Id]: { id: row2Id, ...defaultRow },
          }
        : {};
    }
    _setState({
      orders: _orders,
      rows: _initRows,
    });
  }, []);

  // each render assign apis to parent ref
  const tableApi = {
    initialize: (rows: any[]) => {
      rows = rows.map((r) => {
        // console.log(r.id, 555555);
        if (!r.id) r.id = nanoid();
        return r;
      });
      // console.log(_keyBy(rows, 'id'));
      _setState({
        orders: rows.map((r) => r.id),
        rows: _keyBy(rows, 'id'),
      });
    },
    getRows: () => {
      return _state.orders.map((id: string) => _state.rows[id]);
    },
    addRow: () => {
      const id = nanoid();
      _setState((st) => ({
        orders: [...st.orders, id],
        rows: {
          ...st.rows,
          [id]: { ...defaultRow, id },
        },
      }));
    },
    setRow: (row: any) => {
      if (!row?.id) return;
      _setState((st) => ({
        ...st,
        rows: {
          ...st.rows,
          [row.id]: { ...defaultRow, id: row.id },
        },
      }));
    },
    removeRow: (rowId: string | number) => {
      _setState((st) => {
        if (!st.rows[rowId]) return st;
        const { rows } = st;
        delete rows[rowId];
        return {
          orders: st.orders.filter((id: string) => id != rowId),
          rows,
        };
      });
    },
  };

  const _onChangeTable = _misc.debounce(100, (rows: TPlainObject) => {
    const rws = tableApi.getRows();
    onChange(rws);
  });

  const onChangeCell: TOnChangeCell = (
    cellKey: string,
    cellValue: any,
    rowId: string,
    e: any
  ) => {
    _setState((st) => {
      const rows = {
        ...st.rows,
        [rowId]: { ...st.rows[rowId], [cellKey]: cellValue },
      };
      _onChangeTable(rows);
      return { ...st, rows };
    });
  };

  return (
    <div className={'w-full'}>
      <table
        className="primary-table border border-appBorder mb-4"
        style={{ minWidth: '500px' }}
        ref={tableRef}
      >
        <thead>
          <Tr className="border text-base text-left font-semibold bg-focus2">
            {columns.map((c, i) => {
              return (
                <Th style={{ width: c.width }} key={i}>
                  {renderColumn(c)}
                </Th>
              );
            })}
          </Tr>
        </thead>
        <tbody>
          {_state.orders.map((rId: string, i: number) => {
            return (
              <TableRow
                columns={columns}
                index={i}
                row={_state.rows[rId]}
                tableApi={tableApi}
                renderCell={renderCell}
                onChangeCell={onChangeCell}
                key={rId}
                handleDrag={handleDrag}
                handleDrop={handleDrop}
              />
            );
          })}
        </tbody>
      </table>
      {JSON.stringify(_state.rows, () => {}, 2)}
    </div>
  );
};

const TableRow: FC<ITableRow<any>> = ({
  index,
  columns,
  row,
  tableApi,
  renderCell,
  onChangeCell,
  handleDrag,
  handleDrop,
}) => {
  const onChange = (ck: string, cv: any, e: any) => {
    onChangeCell(ck, cv, row.id, e);
  };

  return (
    <Tr className="">
      {columns.map((c: IColumn, i: number) => {
        return (
          <Td
            key={i}
            style={{ width: c.width }}
            row={row}
            handleDrop={handleDrop}
          >
            {renderCell(
              c,
              row[c.key],
              index,
              row,
              tableApi,
              onChange,
              handleDrag
            )}
          </Td>
        );
      })}
    </Tr>
  );
};

const Tr: FC<TTr> = ({ className = '', children, style = {} }) => {
  return (
    <tr className={className} style={style}>
      {children}
    </tr>
  );
};

const Th: FC<TTh> = ({ children, className = '', style = {} }) => {
  return (
    <th className={cx('p-1 border border-appBorder', className)} style={style}>
      {children}
    </th>
  );
};

const Td: FC<TTd<any>> = ({
  children,
  className = '',
  row,
  handleDrop,
  style = {},
}) => {
  return (
    <td
      className={cx(
        'relative border-b border-l first:border-l-0 border-appBorder',
        className
      )}
      style={{ ...style, height: '27px' }}
      data-testid="row-sorter"
      onDrop={(e) => {
        e.preventDefault();
        handleDrop(row);
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      {children}
    </td>
  );
};

interface ITable<R> {
  initialRows?: R[];
  columns: Array<IColumn>;
  renderColumn: (column: IColumn) => string | JSX.Element;
  renderCell: TRenderCell<R>;
  onChange: (rows: R[]) => void;
  defaultRow?: R;
  //@deprecated
  onMount?: (tableApi: TTableApi) => void;
  showDefaultEmptyRows?: boolean;
}

interface ITableRow<R> {
  index: number;
  columns: IColumn[];
  row: R;
  tableApi: TTableApi;
  renderCell: TRenderCell<R>;
  onChangeCell: TOnChangeCell;
  handleDrag: (row: R) => void;
  handleDrop: (row: R) => void;
}
interface IColumn {
  id: string;
  name: string;
  key: string;
  width?: string;
}

type TTr = { children: ReactNode; className?: string; style?: TPlainObject };
type TTh = { children: ReactNode; className?: string; style?: TPlainObject };
type TTd<R> = {
  row: R;
  handleDrop: (row: R) => void;
  children: ReactNode;
  className?: string;
  style?: TPlainObject;
};

type TPlainObject = { [K: string]: any };
type TsORn = string | number;

type TRenderCell<R> = (
  column: IColumn,
  cellValue: any,
  index: number,
  row: R,
  tableApi: TTableApi,
  onChange: (ck: string, cv: any, e: any) => void,
  handleDrag: (row: R) => void
) => ReactNode;
type TOnChangeCell = (
  cellKey: string,
  cellValue: any,
  rowId: string,
  e: any
) => void;
type TTableApi<R = any> = {
  initialize: (rows: R[]) => void;
  getRows: () => R[];
  addRow: () => void;
  setRow: (row: R) => void;
  removeRow: (rowId: TsORn) => void;
};

const _groupBy = (array: any[], key: string) => {
  return array.reduce((pv, x) => {
    (pv[x[key]] = pv[x[key]] || []).push(x);
    return pv;
  }, {});
};

/**
 * array to object by any key of given object
 */
const _keyBy = (array: any[], key: string) => {
  return array.reduce((pv, x) => {
    pv[x[key]] = x || {};
    return pv;
  }, {});
};

/**
 * create an array of given object's values (ignore keys)
 * { a: 1, b: 2 } => [1, 2]
 */
const _valueBy = (obj: TPlainObject) => {
  return Object.keys(obj).reduce((pv: any[], k: string | number) => {
    return [...pv, obj[k]];
  }, []);
};

export default Table;
export type { ITable, TTableApi };

const useTableResize = (
  tableRef: MutableRefObject<HTMLTableElement>,
  rowCount = 0 // just to reinitialize resize hook so new added rows will also get handler ui same with removed rows
) => {
  useEffect(() => {
    const createResizableTable = (table: HTMLElement) => {
      const cols = table.querySelectorAll('th');
      [].forEach.call(cols, (col: HTMLElement) => {
        // Add a resizer element to the column
        const resizer = document.createElement('div');
        resizer.classList.add('pt-resizer');

        // Set the height
        resizer.style.height = `${table.offsetHeight}px`;
        col.appendChild(resizer);
        createResizableColumn(col, resizer);
      });
    };

    const createResizableColumn = (col: HTMLElement, resizer: HTMLElement) => {
      let x = 0;
      let w = 0;

      const mouseDownHandler = (e: MouseEvent) => {
        x = e.clientX;

        const styles = window.getComputedStyle(col);
        w = parseInt(styles.width, 10);

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);

        resizer.classList.add('pt-resizing');
      };

      const mouseMoveHandler = (e: MouseEvent) => {
        const dx = e.clientX - x;
        col.style.width = `${w + dx}px`;
      };

      const mouseUpHandler = () => {
        resizer.classList.remove('pt-resizing');
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

      resizer.addEventListener('mousedown', mouseDownHandler);
    };

    setTimeout(() => {
      if (tableRef.current) createResizableTable(tableRef.current);
    }, 500);
  }, [rowCount]);
};
