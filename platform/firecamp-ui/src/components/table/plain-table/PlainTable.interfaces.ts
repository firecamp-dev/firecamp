import { IColumn, ITable } from '../primitive/table.interfaces';

export interface IPlainTable<R>
  extends Pick<
    ITable<R>,
    'rows' | 'options' | 'classes' | 'onChange' | 'onMount' | 'onFocusRow'
  > {
  title?: string;
  columns?: IColumn[];
}
