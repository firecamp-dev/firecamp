import { FC } from 'react';
import cx from 'classnames';
import { _array, _misc, _object } from '@firecamp/utils';
import { IRow, IColumn, TTd, TTh, TTr } from './table.interfaces';

const TableRow: FC<IRow<any>> = ({
  index,
  columns,
  row,
  tableApi,
  renderCell,
  onChangeCell,
  handleDrag,
  handleDrop,
  options,
}) => {
  const onChange = (ck: string, cv: any, e: any) => {
    onChangeCell(ck, cv, row.id, e);
  };

  return (
    <Tr className="">
      {columns.map((c: IColumn, i: number) => {
        return (
          <Td
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

const Tr: FC<TTr> = ({ className = '', children, style = {} }) => {
  return (
    <tr className={className} style={style}>
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
      style={{ ...style, height: '27px' }}
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

export { Th, Tr, Td, TableRow };
