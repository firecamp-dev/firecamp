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
import {
  ITable,
  ITableOptions,
  IRow,
  IColumn,
  TOnChangeCell,
  TTableApi,
  TTd,
  TTh,
  TTr,
  TPlainObject,
} from './table.interfaces';

import './table.sass';

const defaultOptions: ITableOptions = {
  disabledColumns: [],
  allowRowRemove: true,
  allowRowAdd: true,
  allowSort: true,
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
  const [_state, _setState] = useState<TPlainObject>({
    orders: [],
    rows: {},
  });
  useTableResize(tableRef);

  const containerDivRef = useRef<HTMLTableElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  //get the width of container div in pixels
  useEffect(() => {
    if (!containerDivRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      setContainerWidth(containerDivRef.current.clientWidth);
    });
    resizeObserver.observe(containerDivRef.current);
    return () => resizeObserver.disconnect();
  }, [containerDivRef.current]);

  useEffect(() => {
    onMount(tableApi);
  }, []);

  useEffect(() => {
    let _rows = {};
    let _orders = [];
    if (rows?.length) {
      _rows = rows.reduce((p, n) => {
        const id: string = n.id || nanoid();
        _orders.push(id);
        return { ...p, [id]: { id, ...n } };
      }, {});
    }
    if (_object.isEmpty(_rows)) {
      const row1Id = nanoid();
      const row2Id = nanoid();
      _orders.push(row1Id, row2Id);
      _rows = showDefaultEmptyRows
        ? {
            [row1Id]: { id: row1Id, ...defaultRow },
            [row2Id]: { id: row2Id, ...defaultRow },
          }
        : {};
    }
    _setState({
      orders: _orders,
      rows: _rows,
    });
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
    return _state.orders;
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
        <thead>
          <Tr className="border text-base text-left font-semibold bg-focus2">
            {columns.map((c, i) => {
              return (
                <Th style={{ 
                  width: c.resizeWithContainer ? '100%' : parseInt(c.width),
                  minWidth: (
                     (!c.fixedWidth && c.resizeWithContainer &&
                  containerWidth > tableRef.current?.clientWidth) ? 
                      parseInt(c.width) +
                      (containerWidth - tableRef.current.clientWidth - 4) :
                     c.width)
                   }} key={i}
                   additionalProp={{
                    "data-allow_resize": !c.fixedWidth,
                    "data-initial_width": c.width
                   }}
                   >
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
                options={options}
              />
            );
          })}
        </tbody>
      </table>
      {JSON.stringify(_state.rows, () => {}, 2)}
    </div>
  );
};

const TableRow: FC<IRow<any>> = ({
  index,
  columns,
  row,
  tableApi,
  renderCell,
  onChangeCell,
  handleDrag,
  handleDrop,
  options,
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
              handleDrag,
              options
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

const Th: FC<TTh> = ({ children, className = '', style = {}, additionalProp = {} }) => {
  return (
    <th className={cx('p-1 border border-appBorder', className)} style={style} {...additionalProp}>
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

const useTableResize = (tableRef: MutableRefObject<HTMLTableElement>) => {
  useEffect(() => {
    const createResizableTable = (table: HTMLElement) => {
      const cols = table.querySelectorAll('th');
      [].forEach.call(cols, (col: HTMLElement) => {
        // Add a resizer element to the column
        const resizer = document.createElement('div');
        resizer.classList.add('pt-resizer');
        resizer.dataset.testid = "col-resizer";

        // Set the height
        resizer.style.height = `${table.offsetHeight}px`;

        //add resizer element to the cols whose width are not fixed
        if(col.dataset.allow_resize === "true"){
          col.appendChild(resizer);
          createResizableColumn(col, resizer);
        }
        
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
        //prevent resize when new width is less than the provided col width
        if((w + dx) >= parseInt(col.dataset.initial_width))
        col.style.minWidth = `${w + dx}px`;
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
  }, []);
};
