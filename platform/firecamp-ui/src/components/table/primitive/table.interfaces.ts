import { EEditorLanguage } from '@firecamp/types';
import { FocusEventHandler, MouseEventHandler, ReactNode } from 'react';

/** Table options */
export interface ITableOptions {
  /** disabled column's keys. One cannot edit within the column included in disabledColumns */
  disabledColumns?: Array<string>;

  /** a boolean value whether allow to remove row or not */
  allowRowRemove?: boolean;

  /** a boolean value whether allow to add new row or not */
  allowRowAdd?: boolean;

  /** a boolean value whether allow to add new row or not */
  hideRowAdd?: boolean;

  /** a boolean value whether allow to sort rows or not */
  allowSort?: boolean;

  /** columns added in this array will not be shown/rendered but remain hidden */
  hiddenColumns?: string[];

  /** column editor language  */
  languages?: { [columnKey: string]: EEditorLanguage };
}

export interface ITable<R> {
  rows?: R[];
  columns: IColumn[];
  renderColumn: (column: IColumn) => string | JSX.Element;
  renderCell: TRenderCell<R>;
  defaultRow?: R;
  showDefaultEmptyRows?: boolean;
  options?: ITableOptions;
  classes?: ITableClasses;
  onChange: (rows: R[]) => void;
  onFocusRow?: (row: R) => void;
  //@deprecated
  onMount?: (tableApi: TTableApi) => void;
}

export interface ITableClasses {
  container?: string;
  table?: string;
  thead?: string;
  theadTr?: string;
  tbody?: string;
  th?: string;
  tr?: string;
  td?: string;
}

export interface IRow<R> {
  classes?: { tr?: string; td?: string };
  index: number;
  columns: IColumn[];
  row: R;
  tableApi?: TTableApi;
  options?: ITableOptions;
  renderCell: TRenderCell<R>;
  handleDrag: (row: R, index?: number) => void;
  handleDrop: (row: R) => any;
  onChangeCell: TOnChangeCell;
  onClick?: (rowDom: HTMLTableRowElement) => void;
  onFocus?: (rowDom: HTMLTableRowElement) => void;
}
export interface IColumn {
  id: string;
  name: string;
  key: string;
  width?: string;
  fixedWidth?: boolean;
  resizeWithContainer?: boolean;
}

export type TTHead = {
  children: ReactNode;
  className?: string;
  style?: TPlainObject;
};
export type TTBody = {
  children: ReactNode;
  className?: string;
  style?: TPlainObject;
};
export type TTr = {
  children: ReactNode;
  className?: string;
  style?: TPlainObject;
  onClick?: MouseEventHandler;
  onFocus?: FocusEventHandler;
};
export type TTh = {
  children: ReactNode;
  className?: string;
  style?: TPlainObject;
  additionalProp?: TPlainObject;
};
export type TTd<R> = {
  row: R;
  handleDrop: (row: R) => void;
  children: ReactNode;
  className?: string;
  style?: TPlainObject;
  options?: ITableOptions;
};

export type TPlainObject = { [K: string]: any };
export type TsORn = string | number;

export type TRenderCell<R> = (
  column: IColumn,
  cellValue: any,
  index: number,
  row: R,
  tableApi: TTableApi,
  onChange: (ck: string, cv: any, e?: any) => void,
  handleDrag: (row: R) => void,
  options?: ITableOptions
) => ReactNode;
export type TOnChangeCell = (
  cellKey: string,
  cellValue: any,
  rowId: string,
  e: any
) => void;
export type TTableApi<R = any> = {
  initialize: Function; //(rows: R[]) => void;
  getRows: () => R[];
  addRow: () => void;
  setRow: (row: R) => void;
  removeRow: (rowId: TsORn) => void;
};

type ITableRowValue = {
  key: string;
  value: string;
  description: string;
  disable?: boolean;
};
export type ITableRows = Array<ITableRowValue>;
