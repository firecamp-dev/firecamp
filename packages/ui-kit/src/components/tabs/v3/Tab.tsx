import { FC } from 'react';
import cx from 'classnames';
import { VscClose } from '@react-icons/all-files/vsc/VscClose';
import { VscCircleFilled } from '@react-icons/all-files/vsc/VscCircleFilled';

import { EActiveBorderPosition, ITab } from './Tab.interface';
import Count from '../Count';
import '../Tabs.scss';

const TopBorderPlacement = ({ show = false }) =>
  show ? (
    <div className="bg-primaryColor h-px absolute left-0 right-0 top-0" />
  ) : (
    <></>
  );

const BottomBorderPlacement = ({ show = false }) =>
  show && (
    <div className="bg-transparent h-px absolute left-0 right-0 -bottom-px h-1"></div>
  );

const TitlePlacement = ({
  name,
  isPreview,
}: {
  name: string;
  isPreview: boolean;
}) => <div className={cx('title flex-1', { italic: isPreview })}>{name}</div>;

const CloseIconPlacement = ({
  id = '',
  state = 'default',
  onClick = (e: any) => {},
  show = false,
}: {
  id: string;
  state: string;
  onClick: Function;
  show: boolean;
}) =>
  show && (
    <div className="fc-tab-action flex items-center pl-1 -mr-1" id={id}>
      {state == 'modified' ? (
        <div className="flex items-center h-4 w-4 cursor-pointer">
          <VscCircleFilled size={14} onClick={onClick} />
        </div>
      ) : (
        <div className="fc-tab-action-close flex items-center h-4 w-4 rounded-sm cursor-pointer hover:bg-focusColor">
          <VscClose size={14} onClick={onClick} />
        </div>
      )}
    </div>
  );

const Tab: FC<ITab> = ({
  id,
  index,
  className = '',
  name = '',
  state = 'default',
  isPreview = false,
  draggable = false,
  borderMeta = {
    placementForActive: 'top',
    right: true,
  },
  closeTabIconMeta = {
    show: true,
    onClick: () => {},
    disabled: false,
  },
  isActive = false,
  onSelect = () => {},
  preComp,
  postComp,
  count,
  height,
  dotIndicator,
  tabVersion,

  onTabDragStart,
  onTabDrop,
  ...tabProps
}) => {
  return (
    <div
      tabIndex={1}
      role="tab"
      title={name}
      aria-label={name}
      aria-labelledby={name}
      aria-selected={isActive}
      tab-index={index}
      id={id}
      key={id}
      style={{ height: height }}
      className={cx(
        { modified: state == 'modified' },
        { 'border-r': borderMeta?.right },
        'fc-tab',
        'flex',
        'items-center',
        'border-tabBorder',
        'relative',
        'w-fit',
        'whitespace-pre',
        'relative',
        { tabVersion },
        className
      )}
      onClick={(e) => onSelect(id, index, e)}
      onDragOver={(ev) => ev.preventDefault()}
      onDragStart={onTabDragStart}
      onDrop={onTabDrop}
      draggable={draggable}
    >
      <div
        className={cx(
          { 'active !bg-tabActiveBackground': isActive },
          { 'bg-tabBackground2': tabVersion == 2 },
          { 'bg-statusBarBackground2': tabVersion == 2 && isActive },
          { 'bg-tabBackground': tabVersion == 1 },
          'fc-tab',
          'hover:bg-tabHoverBackground',
          'flex',
          'items-center',
          'px-2',
          'h-full',
          'relative',
          'w-full',
          'whitespace-pre',
          'relative'
        )}
      >
        <TopBorderPlacement
          show={borderMeta?.placementForActive === 'top' && isActive}
        />
        <div className="fc-tab-content flex flex-1 items-center">
          {preComp ? (
            <div className="flex items-center pr-1.5">{preComp}</div>
          ) : (
            <></>
          )}
          <TitlePlacement name={name} isPreview={isPreview} />
          <Count number={count || ''} />
          {dotIndicator === true ? (
            <div className="pl-1 flex items-center text-primaryColor">
              <VscCircleFilled size={10} />
            </div>
          ) : (
            <></>
          )}
          {postComp ? (
            <div className="flex items-center pr-1 pl-1">{postComp}</div>
          ) : (
            <></>
          )}
        </div>
        <CloseIconPlacement
          id={`close-icon-${id}`}
          state={state}
          onClick={(e: any) => {
            //to stop firing the onSelect event
            //when user click on the close icon the tab should not call onSelect fn
            e.preventDefault();
            e.stopPropagation();
            closeTabIconMeta?.onClick(id, index);
          }}
          show={closeTabIconMeta?.show}
        />
        <BottomBorderPlacement
          show={borderMeta?.placementForActive === 'bottom' && isActive}
        />
      </div>
    </div>
  );
};

export default Tab;

Tab.defaultProps = {
  id: '',
  name: '',
  state: 'default',
  isPreview: false,
  draggable: false,
  borderMeta: {
    placementForActive: EActiveBorderPosition.Top,
    right: true,
  },
  closeTabIconMeta: {
    show: true,
    onClick: () => {},
    disabled: false,
  },
  isActive: false,
  onSelect: () => {},
};
