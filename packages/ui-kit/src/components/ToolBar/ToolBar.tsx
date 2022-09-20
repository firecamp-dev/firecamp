import { FC } from "react";
import { IToolBar } from "./interfaces/ToolBar.interfaces";
import cx from 'classnames';

import './ToolBar.scss';

// progress illustration to show the action is progressing 
const ToolBar: FC<IToolBar>  = ({  children = [],
    className = '', }) => {
  return (<div className={cx("toolbar",className)} tabIndex={1}>
      {children}
  </div>);
};

export default ToolBar;