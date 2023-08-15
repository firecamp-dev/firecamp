import { EKeyValueTableRowType } from '@firecamp/types';
import {
  IColumn,
  ITable,
  ITableClasses,
  ITableOptions,
  ITableRows,
  TTableApi,
} from '../primitive/table.interfaces';

/** Table row cell interface */
export interface IRowCellMeta {
  /**
   * Row's unique id
   */
  id?: string;

  key: string;
  value?: string;
  file?: any;

  /**
   * Whether row is disable or not.
   */
  disable?: boolean;

  /** row data type one of  ['text', 'boolean', 'file'] */
  type?: EKeyValueTableRowType;

  /** row description */
  description?: string;
}

/** table column cell interface */
export interface IColumnCellMeta {
  key: string;

  /** name of the column */
  name?: string;

  /** row description */
  description?: string;

  /** row data type one of ['text', 'boolean', 'file'] */
  type?: string;

  /** whether row is disable or not. */
  disable?: boolean;

  /** width of the cell */
  width?: number | string;
}

export interface IBasicTable<R>
  extends Pick<
    ITable<R>,
    'rows' | 'options' | 'classes' | 'onChange' | 'onMount' | 'onFocusRow'
  > {
  /**
   *  Title of the table, aka Header
   *  TODO: @note: check this property if not in use then remove it
   */
  title?: string;
  columns?: IColumn[];
}
