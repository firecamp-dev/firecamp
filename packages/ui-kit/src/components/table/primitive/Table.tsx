import { FC, useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
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
  allowRowRemove: true,
  allowRowAdd: true,
  allowSort: true,
};

const prepareTableInitState = (
  rows: any[],
  showDefaultEmptyRows?: boolean,
  defaultRow?: TPlainObject
) => {
  let _rows = {};
  let _orders = [];
  if (_array.isEmpty(rows)) {
    const row1Id = nanoid();
    const row2Id = nanoid();
    _orders.push(row1Id, row2Id);
    _rows = showDefaultEmptyRows
      ? {
          [row1Id]: { id: row1Id, ...defaultRow },
          [row2Id]: { id: row2Id, ...defaultRow },
        }
      : {};
  } else {
    _rows = rows.reduce((p, n) => {
      const id: string = n.id || nanoid();
      _orders.push(id);
      return { ...p, [id]: { id, ...n } };
    }, {});
  }
  return { rows: _rows, orders: _orders };
};

const Table: FC<ITable<any>> = ({
  columns,
  renderCell,
  renderColumn,
  rows = [],
  defaultRow = {},
  onChange,
  onMount = (api) => {},
  showDefaultEmptyRows = true,
  options = {},
}) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const rowBeingDragRef = useRef<HTMLTableElement>(null);
  const [_state, _setState] = useState<{
    rows: TPlainObject;
    orders: string[];
  }>(prepareTableInitState(rows, showDefaultEmptyRows, defaultRow));
  useTableResize(tableRef);

  const containerDivRef = useRef<HTMLTableElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  //get the width of container div in pixels
  useEffect(() => {
    if (!containerDivRef.current) return () => {};
    const resizeObserver = new ResizeObserver((entries) => {
      
      // We wrap it in requestAnimationFrame to avoid this error - ResizeObserver loop limit exceeded
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }
        
        setContainerWidth(containerDivRef.current?.clientWidth);
      });
      
    });
    resizeObserver.observe(containerDivRef.current);
    return () => resizeObserver.disconnect();
  }, [containerDivRef.current]);

  useEffect(() => {
    onMount(tableApi);
  }, []);

  useEffect(() => {
    _setState(prepareTableInitState(rows, showDefaultEmptyRows, defaultRow));
  }, [rows]);

  options = { ...defaultOptions, ...options };

  const handleDrag = (row: any) => {
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

      const state = {
        ...st,
        orders: [...orders],
      };
      _onChangeTable(state);
      return state;
    });
  };

  const _onChangeTable = (state: TPlainObject) => {
    const rs = state.orders.map((id: string) => state.rows[id]);
    onChange(rs);
  };

  const onChangeCell: TOnChangeCell = (
    cellKey: string,
    cellValue: any,
    rowId: string,
    e: any
  ) => {
    _setState((st) => {
      const state = {
        ...st,
        rows: {
          ...st.rows,
          [rowId]: { ...st.rows[rowId], [cellKey]: cellValue },
        },
      };
      _onChangeTable(state);
      return state;
    });
  };

  const getRows = () => {
    return _state.orders.map((id: string) => _state.rows[id]);
  };

  // each render assign apis to parent ref
  const tableApi: TTableApi<any> = {
    initialize: _misc.debounce(300, (rows: any[]) => {
      rows = rows.map((r) => {
        if (!r.id) r.id = nanoid();
        return r;
      });
      _setState({
        orders: rows.map((r) => r.id),
        rows: _keyBy(rows, 'id'),
      });
    }),
    // TODO: this is not working as of now, fix it later
    getRows,
    addRow: () => {
      if (!options.allowRowAdd) return;
      const id = nanoid();
      _setState((st) => {
        const state = {
          orders: [...st.orders, id],
          rows: {
            ...st.rows,
            [id]: { ...defaultRow, id },
          },
        };
        // currently not firing on change event on new empty row insertion
        _onChangeTable(state);
        return state;
      });
    },
    setRow: (row: any) => {
      if (!row?.id) return;
      _setState((st) => {
        const state = {
          ...st,
          rows: {
            ...st.rows,
            [row.id]: { ...defaultRow, id: row.id },
          },
        };
        _onChangeTable(state);
        return state;
      });
    },
    removeRow: (rowId: string | number) => {
      if (!options.allowRowRemove) return;
      _setState((st) => {
        if (!st.rows[rowId]) return st;
        const { rows } = st;
        delete rows[rowId];

        const state = {
          orders: st.orders.filter((id: string) => id != rowId),
          rows,
        };
        _onChangeTable(state);
        return state;
      });
    },
  };

  return (
    <div className={'w-full custom-scrollbar'} ref={containerDivRef}>
      <table
        className="primary-table border border-appBorder mb-4 w-auto"
        style={{ minWidth: '450px' }}
        ref={tableRef}
      >
        <THead>
          <Tr className="border text-base text-left font-semibold bg-focus2">
            {columns.map((c, i) => {
              return (
                <Th
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
        <TBody>
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
                options={options}
              />
            );
          })}
        </TBody>
      </table>
    </div>
  );
};

// const _groupBy = (array: any[], key: string) => {
//   return array.reduce((pv, x) => {
//     (pv[x[key]] = pv[x[key]] || []).push(x);
//     return pv;
//   }, {});
// };

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
// const _valueBy = (obj: TPlainObject) => {
//   return Object.keys(obj).reduce((pv: any[], k: string | number) => {
//     return [...pv, obj[k]];
//   }, []);
// };

export default Table;
export type { ITable, TTableApi };
