//@ts-nocheck
import { FC, useCallback, useEffect, useRef, useState, useMemo } from 'react';

import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useFlexLayout,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce
} from 'react-table';
import './ReactTable.sass';
import { FixedSizeList } from 'react-window';
import scrollbarWidth from './scrollbarWidth';
import classnames from 'classnames';
// A great library for fuzzy filtering/sorting items
import { matchSorter } from 'match-sorter';

import { IHeadLessTable, IReactTable } from "./ReactTable.interfaces"

const headerProps = (props, { column }) => getStyles(props, column.align);

const cellProps = (props, { cell }) => getStyles(props, cell.column.align);

const getStyles = (props, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex',
    },
  },
];

const HeadLessTable: FC<IHeadLessTable> = ({
  columns,
  data,
  virtualListHeight,
  onRowClick = () => { },
  className = '',
}) => {
  const defaultColumn = useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
    }),
    []
  );

  // TODO: Check filter method of 'match-sorter' and replace with custom one.
  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
  }

  // Let the table remove the filter if the string is empty
  fuzzyTextFilterFn.autoRemove = (val) => !val;

  const filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const {
    state,
    rows,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
    },
    useResizeColumns,
    useFlexLayout,
    useFilters, // useFilters!
    useGlobalFilter,
    (hooks) => {
      hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
        // fix the parent group of the selection button to not be resizable
        const selectionGroupHeader = headerGroups[0].headers[0];
        selectionGroupHeader.canResize = false;
      });
    }
  );

  const activeRowRef = useRef(null);
  const tbodyRef = useRef(null);
  const listRef = useRef();
  const viewRef = useRef({
    newRows: 0,
    totalRows: rows.length,
    lastRowIndexBeforeScroll: 0,
    autoScrollOnRowAdd: true,
  });
  useEffect(() => {
    viewRef.current.totalRows = rows.length;
    if (viewRef.current.autoScrollOnRowAdd === true) {
      listRef.current.scrollToItem(rows.length - 1);
    }
    let tBodyChildren =
      tbodyRef.current?.children?.item(0).firstElementChild?.children;
    if (tBodyChildren) {
      let currentRow = tBodyChildren.namedItem(activeRowRef.current);
      if (currentRow) currentRow.focus();
      else {
        tBodyChildren.lastElementChild?.focus();
      }
    }
  }, [rows.length]);

  const _handleKeyDown = (event, row) => {
    event.stopPropagation();
    event.preventDefault();
    const currentRow = tbodyRef.current?.children
      ?.item(0)
      .firstElementChild?.children?.namedItem(row.id);

    switch (event.key) {
      case 'ArrowUp':
        currentRow?.previousElementSibling?.focus();
        break;
      case 'ArrowDown':
        currentRow?.nextElementSibling?.focus();
        break;
      default:
        break;
    }
  };

  const _renderRow = useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);

      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className={classnames(
            'tr',
            row.original.meta.color,
            row.original.meta.event,
            { active: activeRowRef.current == row.id }
          )}
          as="tr"
          id={row.id}
          tabIndex={0}
          onKeyDown={(e) => _handleKeyDown(e, row)}
          onFocus={(e) => {
            activeRowRef.current = row.id;
            viewRef.current.autoScrollOnRowAdd = false;
            onRowClick(row);
          }}
          onBlur={(e) => {
            //
          }}
        >
          {row.cells.map((cell) => {
            return (
              <div
                {...cell.getCellProps()}
                className={classnames('td', cell.row.original.meta.color)}
              >
                {cell?.value !== undefined ? cell.render('Cell') : '-'}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows.length]
  );

  let _onItemRendered = (e) => {
    // console.log(e, "_onItemRendered")
    // viewRef.current.visibleStopIndex = e.visibleStopIndex;
    if (e.visibleStopIndex == viewRef.current.totalRows - 1) {
      viewRef.current.autoScrollOnRowAdd = true;
      viewRef.current.lastRowIndexBeforeScroll = e.visibleStopIndex;
      viewRef.current.newRows = 0;
    } else {
      viewRef.current.autoScrollOnRowAdd = false;
      viewRef.current.newRows =
        viewRef.current.totalRows -
        (viewRef.current.lastRowIndexBeforeScroll + 1);
      if (e.visibleStopIndex > viewRef.current.lastRowIndexBeforeScroll) {
        viewRef.current.newRows =
          viewRef.current.totalRows - (e.visibleStopIndex + 1);
      } else {
        viewRef.current.newRows =
          viewRef.current.totalRows -
          (viewRef.current.lastRowIndexBeforeScroll + 1);
      }
    }
    // console.log(viewRef.current.newRows, listRef);
  };

  return (
    <div {...getTableProps()} className={classnames('fc-table h-full', className)}>
      <div>
        {headerGroups.map((headerGroup) => (
          <div
            {...headerGroup.getHeaderGroupProps({
              // style: { paddingRight: '15px' },
            })}
            className="tr"
          >
            {headerGroup.headers.map((column) => {
              // console.log({ column });
              return (
                <div {...column.getHeaderProps(headerProps)} className="th">
                  {column.render('Header')}
                  {/* Use column.getResizerProps to hook up the events correctly */}
                  {column.canResize && (
                    <div
                      {...column.getResizerProps()}
                      className={`resizer ${column.isResizing ? 'isResizing' : ''
                        }`}
                    />
                  )}
                  <div className="fc-react-table-filter">
                    {column.canFilter && column?.Filter
                      ? column?.render?.('Filter') || ''
                      : ''}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div
        {...getTableBodyProps()}
        as="tbody"
        ref={tbodyRef}
        style={{height: "calc(100% - 32px)"}}
      >
        <FixedSizeList
          ref={listRef}
          height={virtualListHeight}
          itemCount={rows.length}
          itemSize={32}
          //width={totalColumnsWidth + scrollBarSize}
          className="visible-scrollbar"
          // onScroll={_onItemRendered}
          onItemsRendered={_onItemRendered}
        >
          {_renderRow}
        </FixedSizeList>
      </div>
    </div>
  );
};

const ReactTable: FC<IReactTable> = ({
  virtualListHeight = 465,
  columns: propColumns,
  onLoad = () => { },
  onRowClick = () => { }, //todo: need to rename `onRowClick` to `onRowFocus`
  className = '',
}) => {
  let [data, setData] = useState([]);

  useEffect(() => {
    onLoad(_fns);
  }, []);

  const columns = useMemo(() => propColumns, []);
  const tableData = useMemo(() => data, [data.length]);

  const _fns = {
    addRow: (row) => {
      setData((ps) => [...ps, row]);
    },
    setRows: (rows) => {
      setData([...rows]);
    },
  };

  return (
    <HeadLessTable
      columns={columns}
      data={tableData}
      virtualListHeight={virtualListHeight}
      onRowClick={onRowClick}
      className={className}
    />
  );
};

export default ReactTable;
