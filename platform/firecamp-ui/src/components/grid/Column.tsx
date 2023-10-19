//@ts-nocheck
import { FC } from 'react';
import cx from 'classnames';
import { IColumn } from './interfaces/Column.interfaces';
import './Grid.scss';

/**
 * Column
 */
const Column: FC<IColumn> = ({
  id = '',
  className = '',
  children = [],
  flex = '',
  overflow = 'auto',
  width = '',
  maxWidth = '',
  minWidth,
  height,
  maxHeight,
  minHeight,
  tabIndex = -1,
}) => {
  return (
    <div
      id={id}
      className={cx('col invisible-scrollbar px-0 relative', className)}
      tabIndex={tabIndex}
      style={{
        flex,
        overflow,
        width,
        maxWidth,
        minWidth,
        height,
        minHeight,
        maxHeight,
      }}
    >
      {children}
    </div>
  );
};
export default Column;
