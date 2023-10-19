import { TId } from './general';

export enum EKeyValueTableRowType {
  Text = 'text',
  File = 'file',
}

export interface IKeyValueTable<T= EKeyValueTableRowType> {
  id?: TId;
  key: string;
  value?: string;
  description?: string;
  disable?: boolean;
  type?: T;
}
