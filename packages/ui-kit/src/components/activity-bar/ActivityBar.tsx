import { FC } from "react";
import cx from 'classnames';
import ActionItems from './ActionItems';
import MenuBar from "./MenuBar"
import './ActivityBar.scss';

import { IActivityBar, ICompositeBar, IActionBar } from "./interfaces/ActivityBar.interfaces"
import { IMenuBar } from "./interfaces/MenuBar.interfaces"

const ActivityBar: FC<IActivityBar>
  & {
    CompositeBar: FC<ICompositeBar>,
    ActionBar: FC<IActionBar>,
    MenuBar: FC<IMenuBar>
  } = ({
    id = '',
    className = '',
    style = {},
    children
  }) => {
    return (
      <div tabIndex={1} id={id} className={cx('activitybar focus-outer2 w-12 bg-activityBarBackground text-activityBarForeground flex flex-col  border-r border-activityBarBorder', className)} style={style}>
        {children || ''}
      </div>
    );
  };


const CompositeBar: FC<ICompositeBar> = ({
  items = [],
  activeItem = '',
  onClickItem = () => { } }) => {
  return (
    <div className="composite-bar">
      <ActionItems items={items} activeItem={activeItem}
        onClickItem={onClickItem} />
    </div>
  )
};

const ActionBar: FC<IActionBar> = ({ items = [], onClickItem = () => { } }) => {
  return (
    <div className="action-bar mt-auto">
      <ActionItems items={items} onClickItem={onClickItem} />
    </div>
  )
};


ActivityBar.MenuBar = MenuBar;
ActivityBar.CompositeBar = CompositeBar;
ActivityBar.ActionBar = ActionBar;

export default ActivityBar;

ActivityBar.defaultProps = {
  id: '',
  className: '',
  children: []
};