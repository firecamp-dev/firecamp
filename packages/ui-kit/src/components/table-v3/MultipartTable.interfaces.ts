import { IRowCellMeta } from '../table/interfaces/index';

export interface IMultipartIFT {
  /**
   * Table row data
   */
  rows: Array<IRowCellMeta>;

  /**
   * multipart table key to represent multipart value (Which key holds value). default key 'value'
   */
  multipartKey?: string;

  /**
   * Update table data
   */
  onChange: (updates: Array<IRowCellMeta>) => void;
}

export interface IMultiPartInput {
  /**
   * Row data
   */
  row: IRowCellMeta;

  /**
   * Row value
   */
  value: string | number | boolean | object;

  /**
   * Update row value
   */
  onChange?: (updates: string | number | boolean | object) => void;

  /**
   * Update row type one of ['text', 'file']
   */
  onChangeRowType?: (type: string) => void;
}
