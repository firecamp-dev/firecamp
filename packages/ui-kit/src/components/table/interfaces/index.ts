import { EKeyValueTableRowType } from '@firecamp/types';

/**
 * Table row cell interface
 */
export interface IRowCellMeta {
  /**
   * Row's unique identity
   */
  id?: string;

  key: string;
  value?: string;

  /**
   * Whether row is disable or not.
   */
  disable?: boolean;

  /**
   * Row data type one of  ['text', 'boolean', 'file']
   */
  type?: EKeyValueTableRowType;

  /**
   * Row description
   */
  description?: string;
}

/**
 * Table column cell interface
 */
export interface IColumnCellMeta {
  key: string;

  /**
   * Name of the column
   */
  name?: string;

  /**
   * Row description
   */
  description?: string;

  /**
   * Row data type one of ['text', 'boolean', 'file']
   */
  type?: string;

  /**
   * Whether row is disable or not.
   */
  disable?: boolean;

  /**
   * Width of the cell
   */
  width?: number | string;
}

/**
 * Table meta data
 */
export interface ITableMeta {
  /**
   * Disabled column's keys. One can not update within the column included in to disabledColumns
   */
  disabledColumns?: Array<string>;

  /**
   * A boolean value whether allow to remove row or not
   */
  allowRowRemove?: boolean;

  /**
   * A boolean value whether allow to add new row or not
   */
  allowRowAdd?: boolean;

  /**
   * A boolean value whether allow to sort rows or not
   */
  allowSort?: boolean;

  /**
   * Table view/ mode language
   */
  mode?: string | { key: string; value: string };

  language?: string;

  /**
   * Allow to show description column or not
   */
  allowDescription?: boolean;
}
