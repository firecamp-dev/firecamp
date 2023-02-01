import { IRowCellMeta } from '../basic-table/BasicTable.interfaces';
import { ITableOptions } from '../primitive/table.interfaces';

export enum ERowType {
  Text = 'text',
  File = 'file',
}

export interface IMultipartIFT {
  /** table rows */
  rows: Array<IRowCellMeta>;

  /** multipart table key to represent multipart value (Which key holds value). default key 'value' */
  multipartKey?: string;

  /** update table data */
  onChange: (updates: Array<IRowCellMeta>) => void;
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
  options?: ITableOptions
}
