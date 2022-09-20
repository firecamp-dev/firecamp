// @ts-nocheck
import { FC } from 'react';
import { useState, useEffect, useRef } from 'react';

import classnames from 'classnames';
import { Button, EButtonColor, EButtonSize, Resizable } from '@firecamp/ui-kit';
import equal from 'deep-equal';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import { _array, _string } from '@firecamp/utils'

import useDidUpdateEffect from '../../hooks/useDidUpdateEffect';
import Row from './Row';

import { defaultColumns, defaultMeta, defaultRow, resizeOption } from './constants';
import { IIFT, IColumnCell } from '../interfaces/IFT.interfaces';
import { IColumnCellMeta } from '../interfaces';

/**
 * _normaliseRows: To normalise rows. Row must have all the required keys.
 * @param {*} rows : <type: Array> // Array of rows which you want to normalise
 */
const _normaliseRows = (rows: any[] = []) => {
  if (_array.isEmpty(rows)) {
    return [{ ...defaultRow }];
  }

  return rows
    .map((r, i) => {
      let value = r.value || '';
      if (r.type === 'text' && !_string.isString(value)) {
        // If type of cell is 'text' and value type is not text then set value as empty string.
        value = '';
      }

      return {
        key: _string.isString(r.key) ? r.key : '',
        value: value,
        disable: typeof r.disable === 'boolean' ? r.disable : false,
        type: r.type || 'text',
        description: r.description,
      };
    })
    .filter((r) => r.key || r.value || r.description);
};

const IFT: FC<IIFT> = ({
  columns: pColumns = [],
  rows: pRows = [], //default row on init
  className = '',
  disabled = false,
  title = '',
  cellRenderer = (a, b) => <span>cell</span>,
  onChange = () => {},
  meta = defaultMeta,
}) => {
  /**
   * Merge prop meta and default met
   */
  meta = {
    ...defaultMeta,
    ...meta,
  };

  let [rows, setRows] = useState(_normaliseRows(pRows));
  let [columns, setColumns] = useState<IColumnCellMeta[]>(defaultColumns);
  let prevRows = useRef(pRows);

  // onChange will pass changes rows after first render
  //tableData: collection of rows with proper formate and required keys
  //If passed rows (prop) is not same as normalised rows, return normalised rows in callback as updated rows.
  useDidUpdateEffect(() => {
    let tableData = _normaliseRows(rows);

    // console.log(`tableData, prevRows.current`, tableData, prevRows.current);
    if (!equal(tableData, prevRows.current)) {
      onChange(tableData || []);
    }
  }, [rows]);

  //Update rows on update prop rows
  useDidUpdateEffect(() => {
    // normalize table rows
    const normalizedRows = _normaliseRows(pRows);

    // TODO: Need to check the requirement of this logic
    // Merge existing rows with updated (prop) rows

    // Check if existing and new table data same
    if (!equal(normalizedRows, rows)) {
      prevRows.current = rows;
      setRows(normalizedRows || []);
    }

    prevRows.current = pRows;
  }, [pRows]);

  //Add if there are no rows
  useEffect(() => {
    if (!rows || !rows.length) {
      _addRow();
    }

    /**
     * do not show description column if allowDescription is not true
     */
    if (meta.allowDescription !== true) {
      setColumns(defaultColumns.filter((c) => c.key !== 'description'));
    }
  }, []);

  // on cell value change... update the rows array internally
  let _onChange = (rowIndex, cell) => {
    if (disabled) return;

    // console.log({ rowIndex, cell });

    let updatedValues = Array.from(rows);
    if (updatedValues[rowIndex]) {
      updatedValues[rowIndex] = {
        ...updatedValues[rowIndex],
        [cell.key]: cell.value,
      };
      setRows(updatedValues);
    }

    if (rows.length - 1 == rowIndex) {
      // _addRow();
    }
  };

  // add new row at bottom...
  let _addRow = () => {
    if (disabled) return;

    // setRows(ps => [...ps, {}]);
    setRows((ps) => [...ps, { ...defaultRow }]);
  };

  /**
   * Remove row by rowIndex
   * @param index
   * @private
   */
  let _removeRow = (index) => {
    if (!meta.allowRowRemove || index < 0 || rows.length == 1 || disabled)
      return;

    let newRows = rows.filter((r, i) => i != index);
    setRows([...newRows]);
  };

  /**
   * _onSortRows: Row sorting from and to index
   * @param {*} fromIndex : <type: number> // row index from which row is dragged
   * @param {*} toIndex <type: number> // row index to which row is dropped
   */
  const _onSortRows = (fromIndex = 0, toIndex = 0) => {
    const totalRows = rows.length;
    const draggedRow = rows[fromIndex];

    //return if following conditions are true,
    //1. fromIndex and toIndex are same, reason: row is not sorted
    //2. fromIndex is greter than rows length, reason: row doesn't exists
    //3. toIndex is greter than rows length, reason: row doesn't exists
    //4. if draggedRow not exist
    if (
      fromIndex == toIndex ||
      fromIndex > totalRows - 1 ||
      toIndex > totalRows - 1 ||
      !draggedRow
    )
      return;

    let sortedRows = [...rows];
    sortedRows.splice(fromIndex, 1);
    sortedRows.splice(toIndex, 0, draggedRow);
    console.log(`sortedRows`, sortedRows);
    if (!equal(rows.length, sortedRows)) {
      setRows(sortedRows);
    }
  };
  // console.log({ meta });

  return (
    <div>
      <div className="smart-table-header-wrapper">
        {title ? <div className="smart-table-header">{title}</div> : ''}
      </div>
      <div className={`with-border invisible-scroll smart-table ${className}`}>
        <div className="list-header smart-table-row smart-table-header">
          {columns.map((c, i) => (
            <ColumnCell
              title={c.name}
              minWidth={40}
              resizeOption={resizeOption}
              className={c.className}
              isResizable={true}
              key={i}
            />
          ))}
        </div>

        {rows.map((r, i) => {
          return (
            <Row
              columns={columns}
              row={r}
              rowIndex={i}
              disable={r.disable || false}
              key={`table-row-${i}`}
              cellRenderer={cellRenderer}
              onChange={(cell) => _onChange(i, cell)}
              removeRow={() => _removeRow(i)}
              onSort={_onSortRows}
              isTableDisabled={disabled}
              meta={meta}
              // onRowSort={_fns._onRowSort}
            />
          );
        })}
        {!disabled && meta.allowRowAdd ? (
          <div className="smart-table-footer">
            <Button
              onClick={_addRow}
              text="Add Row"
              color={EButtonColor.Primary}
              size={EButtonSize.Small}
              transparent={true}
              ghost={true}
              // color="primary-alt"
              className="small transparent font-light without-border with-padding with-icon-left"
              icon={<VscAdd size={16} />}
              // iconClass="iconv2-add-icon"
            />
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

const ColumnCell: FC<IColumnCell> = ({
  isResizable = true,
  resizeOption = {},
  minWidth,
  title = 'key',
  className,
}) => {
  const Title = ({ className, title }) => (
    <div className={classnames('' + 'smart-table-row-cell', className)}>
      {title}
    </div>
  );

  if (!isResizable) return <Title title={title} className={className} />;
  return (
    <Resizable minWidth={minWidth} {...resizeOption}>
      <Title title={title} className={className} />
    </Resizable>
  );
};

export default IFT;
