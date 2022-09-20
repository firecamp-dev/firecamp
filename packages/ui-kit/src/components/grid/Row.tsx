//@ts-nocheck
import { FC } from "react";
import cx from 'classnames';
import './Grid.scss';

//import '../../scss/tailwind.scss';
import { IRow } from "./interfaces/Row.interfaces";

const Row: FC<IRow> = ({
  id = '',
  className = '',
  children = [],
  flex = '',
  overflow = '',
  width = '',
  maxWidth = '',
  minWidth = '',
  height = '',
  maxHeight = '',
  minHeight = ''
}) => {
  return (
    <div id={id} className={cx('row flex mx-0 relative', className)}  style={{
      flex,
      height,
      overflow,
      width,
      minHeight,
      maxHeight,
      minWidth,
      maxWidth
    }} >
      {children}
    </div>
  );
};

export default Row;