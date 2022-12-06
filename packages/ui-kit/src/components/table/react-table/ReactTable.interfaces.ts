import { ColumnInterface, Row } from 'react-table';

export interface IReactTable {
  /**
   * List/ table height
   */
  virtualListHeight: number;

  /**
   * Table columns
   */
  columns: Array<ColumnInterface>;

  /**
   * On load, pass helper functions
   */
  onLoad: (functions: object) => any;

  /**
   * On select/ click row get row data
   */
  onRowClick: (row: Row) => void;

  /**
   * Table style classname
   */
  className?: string;
}

export interface IHeadLessTable {
  /**
   * Table columns
   */
  columns: Array<ColumnInterface>;

  /**
   * Table data/ rows
   */
  data: Array<Row>;

  /**
   * List/ table height
   */
  virtualListHeight: number;

  /**
   * On select/ click row get row data
   */
  onRowClick: (row: Row) => void;

  /**
   * Table style classname
   */
  className: string;
}
