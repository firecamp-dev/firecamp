//@ts-nocheck
import { FC } from "react";
import classnames from 'classnames';
import Row from '../grid/Row';

import { ITabHeader, ILeft, ICenter, IRight, ITitle } from "./interfaces/TabHeader.interfaces"
import './TabHeader.scss';

const TabHeader: FC<ITabHeader>
  & {
    Left: FC<ILeft>,
    Center: FC<ICenter>,
    Right: FC<IRight>,
    Title: FC<ITitle>
  } = ({
    id = '',
    children = '',
    className = '',
    onClick = _ => { },
    tooltip = ''
  }) => {
    return (
      <div
        id={id}
        className={classnames(`fc-tab-panel-header flex-nowrap`, className)}
        onClick={onClick}
        data-tip={tooltip}
      >
        {children}
      </div>
    );
  };
const Left: FC<ILeft> = ({ children = [], className = '' }) => {
  return (
    <Row className={classnames(`fc-tab-panel-header-left flex-nowrap `, className)}>
      {children}
    </Row>
  );
};

const Center: FC<ICenter> = ({ children = [], className = '' }) => {
  return (
    <Row
      className={classnames(
        `fc-tab-panel-header-center invisible-scrollbar flex-nowrap `,
        className
      )}
      flex={1}
    >
      {children}
    </Row>
  );
};

const Right: FC<IRight> = ({ children = [], className = '' }) => {
  return (
    <Row className={classnames(`fc-tab-panel-header-right flex-nowrap `, className)}>
      {children}
    </Row>
  );
};

const Title: FC<ITitle> = ({ children = [], className = '' }) => {
  return (
    <div className={classnames(`fc-tab-panel-header-title`, className)}>
      {children}
    </div>
  );
};

export default TabHeader;


TabHeader.Left = Left
TabHeader.Center = Center
TabHeader.Right = Right
TabHeader.Title = Title