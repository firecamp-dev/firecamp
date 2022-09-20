import { IColumnCellMeta, IRowCellMeta, ITableMeta } from './index';

export interface IIFT {
  /**
   * Table columns list ['disable', 'key', 'value']
   */
  columns: Array<IColumnCellMeta>;

  /**
   * Table rows/ table data
   */
  rows: Array<IRowCellMeta>;

  /**
   * Classname to add external styling to table
   */
  className: string;

  /**
   * A boolean value whether table is mutable or not. Passing true in disabled will make table immutable
   */
  disabled: boolean;

  /**
   * Table title/ label
   */
  title: string;

  /**
   * Table cell renderer functional component
   */
  cellRenderer: () => JSX.Element | JSX.Element[];

  /**
   * Update table data
   */
  onChange: (updates: Array<IRowCellMeta>) => void;

  /**
   * Table meta data
   */
  meta: ITableMeta;
}

/**
 * Table column cell
 */
export interface IColumnCell {
  /**
   * A boolean value states whether column of table is resizable or not
   */
  isResizable: boolean;

  /**
   * Resizable options
   */
  resizeOption: object;

  /**
   * Minimum width of column
   */
  minWidth: string | number;

  /**
   * Column title/ label
   */
  title: string;

  /**
   * Styling to column cell
   */
  className: string;
}

/**
 * Table row
 */
export interface IRow {
  /**
   * Columns row
   */
  columns: Array<IColumnCellMeta>;

  /**
   * Row data
   */
  row: any; //IRowCellMeta

  /**
   * Table cell renderer functional component
   */
  cellRenderer: (a: any, b: any) => JSX.Element | JSX.Element[];

  /**
   * Row index in table
   */
  rowIndex: number;

  /**
   * A boolean value to state table is mutable or not
   */
  isTableDisabled: boolean;

  /**
   * Update table
   */
  onChange: (updates: IRowCellMeta) => void;

  /**
   * Remove row by index
   */
  removeRow: () => any;

  /**
   * On sort rows from and to index
   */
  onSort: (fromIndex: number, toIndex: number) => any;

  /**
   * Table meta data
   */
  meta: ITableMeta;
}
