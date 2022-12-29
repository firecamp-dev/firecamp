import { FC, MouseEvent, FocusEvent, useRef } from 'react';
import cx from 'classnames';
import { _array, _misc, _object } from '@firecamp/utils';
import {
  IRow,
  IColumn,
  TTd,
  TTh,
  TTr,
  TTBody,
  TTHead,
} from './table.interfaces';

const TableRow: FC<IRow<any>> = ({
  classes = { tr: '', td: '' },
  index,
  columns,
  row,
  tableApi,
  renderCell,
  handleDrag,
  handleDrop,
  options,
  onChangeCell,
  onClick = (rowDom) => {},
  onFocus = (rowDom) => {},
}) => {
  const tableRowRef = useRef<HTMLTableRowElement>(null);
  const onChange = (ck: string, cv: any, e: any) => {
    onChangeCell(ck, cv, row.id, e);
  };

  const _onClick = (e: MouseEvent<HTMLElement>) => {
    onClick((e.target as HTMLElement).closest('tr'));
  };
  const _onFocus = (e: FocusEvent<HTMLElement>) => {
    onFocus((e.target as HTMLElement).closest('tr'));
  };

  return (
    <Tr
      className={classes.tr}
      key={row.id}
      onClick={_onClick}
      onFocus={_onFocus}
    >
      {columns.map((c: IColumn, i: number) => {
        return (
          <Td
            className={classes.td}
            key={i}
            style={{ width: c.width }}
            row={row}
            handleDrop={handleDrop}
          >
            {renderCell(
              c,
              row[c.key],
              index,
              row,
              tableApi,
              onChange,
              handleDrag,
              options
            )}
          </Td>
        );
      })}
    </Tr>
  );
};

const THead: FC<TTHead> = ({ className = '', children, style = {} }) => {
  return (
    <thead className={className} style={style}>
      {children}
    </thead>
  );
};

const TBody: FC<TTBody> = ({ className = '', children, style = {} }) => {
  return (
    <tbody className={className} style={style}>
      {children}
    </tbody>
  );
};

const Tr: FC<TTr> = ({
  className = '',
  onClick = (rowDom) => {},
  onFocus,
  children,
  style = {},
}) => {
  return (
    <tr
      className={className}
      style={style}
      onClick={(e) => {
        // console.log(e.target.closest('tr'));
        // e.target.closest('tr').focus();
        onClick(e);
      }}
      onFocus={onFocus}
      tabIndex={0}
    >
      {children}
    </tr>
  );
};

const Th: FC<TTh> = ({
  children,
  className = '',
  style = {},
  additionalProp = {},
}) => {
  return (
    <th
      className={cx('p-1 border border-appBorder', className)}
      style={style}
      {...additionalProp}
    >
      {children}
    </th>
  );
};

const Td: FC<TTd<any>> = ({
  children,
  className = '',
  row,
  handleDrop,
  style = {},
}) => {
  return (
    <td
      className={cx(
        'relative border-b border-l first:border-l-0 border-appBorder',
        className
      )}
      style={{ ...style, height: '30px' }}
      onDrop={(e) => {
        e.preventDefault();
        handleDrop(row);
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      {children}
    </td>
  );
};

export { THead, TBody, Th, Tr, Td, TableRow };
