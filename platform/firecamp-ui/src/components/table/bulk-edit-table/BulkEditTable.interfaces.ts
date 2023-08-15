import { IRowCellMeta } from '../basic-table/BasicTable.interfaces';
import { ITableOptions, TTableApi } from '../primitive/table.interfaces';

export interface IBulkEditTable {
  /** id for table */
  id?: string;

  /** row values*/
  rows: Array<IRowCellMeta>;

  /** whether row is disable or not. If true then no one can modify data */
  disabled?: boolean;

  /** title of table */
  title: string;

  /** updated table values */
  onChange: (updatedRows: Array<IRowCellMeta>) => void;

  /** on mount table callback to expose table api */
  onMount?: (tApi: TTableApi) => void;

  /** table options */
  options?: ITableOptions;

  /** debounce the changes */
  debounce?: number;
}
