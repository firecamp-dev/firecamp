import {
  FC,
  MutableRefObject,
  ReactNode,
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { nanoid } from 'nanoid';
import { _array, _misc } from '@firecamp/utils';
import cx from 'classnames';

import './table.sass';

const Table: FC<ITable<any>> = ({
  columns,
  renderCell,
  renderColumn,
  initialRows = [],
  defaultRow = {},
  onChange,
  onLoad,
  apiRef,
  showDefaultEmptyRows = true,
}) => {
  const tableRef = useRef<HTMLTableElement>(null);
  // const tableApi = useRef<TTableApi>(null);
  useTableResize(tableRef);
  const row1Id = nanoid(),
    row2Id = nanoid(); // show two empty row on load
  const defaultRows = showDefaultEmptyRows
    ? {
        [row1Id]: { id: row1Id, ...defaultRow },
        [row2Id]: { id: row2Id, ...defaultRow },
      }
    : {};
  let [_rows, _setRows] = useState<TPlainObject>(defaultRows);

  useEffect(() => {
    // console.log(initialRows, 'initialRows...');
    if (initialRows?.length) {
      const _rows = initialRows.reduce((p, n) => {
        const id = n.id || nanoid();
        return { ...p, [id]: { id, ...n } };
      }, {});
      //   console.log(_rows, '_rows...');
      _setRows(_rows);
    }
  }, []);

  // each render assign apis to parent ref
  apiRef.current = {
    initialize: (rows: any[]) => {
      console.log(_keyBy(rows, 'id'));
      _setRows(_keyBy(rows, 'id'));
    },
    getRows: () => _valueBy(_rows),
    addRow: () => {
      const id = nanoid();
      _setRows((rws) => ({ ...rws, [id]: { id, ...defaultRow } }));
    },
    setRow: (row: any) => {
      if (!row?.id) return;
      _setRows((rws) => ({ ...rws, [row.id]: row }));
    },
    removeRow: (rowId: string | number) => {
      _setRows((rws) => {
        if (!rws[rowId]) return rws;
        delete rws[rowId];
        console.log(rws);
        return { ...rws };
      });
    },
  };

  const _onChangeTable = _misc.debounce(100, (rows: TPlainObject) => {
    const rws = _valueBy(rows);
    onChange(rws);
  });

  const onChangeCell: TOnChangeCell = (
    cellKey: string,
    cellValue: any,
    rowId: string,
    e: any
  ) => {
    _setRows((rws) => {
      console.log(rowId, rws[rowId]);
      const rows = {
        ...rws,
        [rowId]: { ...rws[rowId], [cellKey]: cellValue },
      };
      _onChangeTable(rows);
      return rows;
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
          {Object.keys(_rows).map((rId, i) => {
            return (
              <TableRow
                columns={columns}
                index={i}
                row={_rows[rId]}
                tableApi={apiRef.current}
                renderCell={renderCell}
                onChangeCell={onChangeCell}
                key={rId}
              />
            );
          })}
        </tbody>
      </table>
      {JSON.stringify(_rows, () => {}, 2)}
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
}) => {
  const onChange = (ck: string, cv: any, e: any) => {
    onChangeCell(ck, cv, row.id, e);
  };

  return (
    <Tr className="">
      {columns.map((c: IColumn, i: number) => {
        return (
          <Td key={i}>
            {renderCell(c, row[c.key], index, row, tableApi, onChange)}
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

const Td: FC<TTd> = ({ children, className = '', style = {} }) => {
  return (
    <td
      className={cx(
        'border-b border-l first:border-l-0 border-appBorder',
        className
      )}
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
  onLoad?: (tableApi: TTableApi) => void;
  apiRef: any;
  showDefaultEmptyRows?: boolean;
}

interface ITableRow<R> {
  index: number;
  columns: IColumn[];
  row: R;
  tableApi: TTableApi;
  renderCell: TRenderCell<R>;
  onChangeCell: TOnChangeCell;
}
interface IColumn {
  id: string;
  name: string;
  key: string;
  width?: string;
}

type TTr = { children: ReactNode; className?: string; style?: TPlainObject };
type TTh = { children: ReactNode; className?: string; style?: TPlainObject };
type TTd = { children: ReactNode; className?: string; style?: TPlainObject };

type TPlainObject = { [K: string]: any };
type TsORn = string | number;

type TRenderCell<R> = (
  column: IColumn,
  cellValue: any,
  index: number,
  row: R,
  tableApi: TTableApi,
  onChange: (ck: string, cv: any, e: any) => void
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

const useTableResize = (tableRef: MutableRefObject<HTMLTableElement>) => {
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
  }, []);
};
