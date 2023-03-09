//@ts-nocheck
import { FC } from "react";
import cx from 'classnames';
import { IColumn } from "./interfaces/Empty.interfaces"

/**
 * Column
 * @param id: <type: String>// copy button id
 * @param className: <type: String>,
 * @param children: <type: String>//
 * @returns {*}
 * @constructor
 */
const Column: FC<IColumn> = ({
  id = '',
  className = '',
  icon = [],
  title = '',
  message = ''
}) => {
  return (
    <div id={id} className={cx('h-full w-full flex justify-center items-center py-6 text-center', className)} tabIndex={-1}>
      <div className="flex items-center justify-center flex-col max-w-xs">
      <div className="flex items-center justify-center mb-4 opacity-30">{icon}</div>
      <span className="text-base font-semibold mb-1 px-6 text-appForeground opacity-70">{title}</span>
      <span className="text-sm font-normal px-8 text-appForegroundInActive ">{message}</span>
      </div>
    </div>
  );
};
export default Column;