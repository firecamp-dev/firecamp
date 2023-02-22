import { IRowCellMeta } from '../basic-table/BasicTable.interfaces';
import {
  ITableOptions,
  ITableRows,
  TTableApi,
} from '../primitive/table.interfaces';

export enum ERowType {
  Text = 'text',
  File = 'file',
}

export interface IMultipartTable<R> {
  /** Rows to be rendered on table*/
  rows?: R[];
  /** To provide additional functions to the primitive table */
  options?: ITableOptions;
  /** To provide the updated rows on ever changed value*/
  onChange: (rows: ITableRows) => any;
  /** To provide the table reference */
  onMount?: (tableApi: TTableApi) => any;
}

export interface IMultiPartInput {
  /**
   * row data
   */
  row: IRowCellMeta;

  /** row value */
  value: string | number | boolean | object;

  /** on change text input value*/
  onChange?: (evt: object) => void;

  /** on select file from explorer */
  onChangeFile?: (evt: object) => void;

  /** on change row type one of ['text', 'file'] */
  onChangeRowType?: (type: ERowType) => void;

  /** Table options */
  options?: ITableOptions;
}
