import { EVariableType } from '@firecamp/types';
import {
  ITableClasses,
  ITableOptions,
  ITableRows,
  TTableApi,
} from '../primitive/table.interfaces';

/** Table row cell interface */
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

  /** row data type one of  EVariableType */
  type?: EVariableType;

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

export interface IEnvironmentTable<R> {
  /** Title of the table, aka Header*/
  title?: string;
  /** Rows to be rendered on table*/
  rows?: R[];
  /** To provide additional functions to the primitive table */
  options?: ITableOptions;
  /** To provide the updated rows on ever changed value*/
  onChange: (rows: R[]) => any;
  /** To provide the table reference */
  onMount?: (tableApi: TTableApi) => any;
  classes?: ITableClasses;
}
