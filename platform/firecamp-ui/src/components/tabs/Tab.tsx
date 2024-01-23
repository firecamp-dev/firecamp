import { FC } from 'react';
import cx from 'classnames';
import { X } from 'lucide-react';
import { VscCircleFilled } from '@react-icons/all-files/vsc/VscCircleFilled';
// import { useDrag, useDrop } from 'react-dnd';

// import '../../scss/tailwind.scss';
import './Tabs.scss';
import { ITab } from './interfaces/Tab.interface';
import Count from './Count';

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
}) => <div className={cx('title', { italic: isPreview })}>{name}</div>;

const CloseIconPlacement = ({
  id = '',
  state = 'default',
  onClick = () => {},
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
          <VscCircleFilled size={14} onClick={(e) => onClick(e)} />
        </div>
      ) : (
        <div className="fc-tab-action-close flex items-center h-4 w-4 rounded-sm cursor-pointer hover:bg-focusColor">
          <X size={14} onClick={(e) => onClick(e)} data-testid="close-icon"/>
        </div>
      )}
    </div>
  );

// const ReorderType = 'tab';

const Tab: FC<ITab> = ({
  id = '',
  index = '',
  className = '',
  name = '',
  state = 'default',
  isPreview = false,
  canReorder = false,
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
  onReorder = (draggedItem, index) => {},
  count,
  height,
  dotIndicator,
  tabVersion,
  hasStatusbar = false,
  ...tabProps
}) => {
  // const [tabDragProps, tabDrag] = canReorder
  //   ? []
  //   : // useDrag({
  //     //     item: {
  //     //       id: id,
  //     //       index: index,
  //     //       name: name,
  //     //     },
  //     //     type: ReorderType,
  //     //     collect: (monitor: any) => monitor,
  //     //   })
  //     [];

  // const [tabDropProps, tabDrop] = canReorder
  //   ? []
  //   : // useDrop({
  //     //     accept: ReorderType,
  //     //     drop: (draggedItem: { id: number; index: number; name: string }) =>
  //     //       onReorder(draggedItem.index, index),
  //     //     collect: (monitor: { isOver: () => any; canDrop: () => any }) => ({
  //     //       monitor,
  //     //       isOver: monitor.isOver(),
  //     //       canDrop: monitor.canDrop(),
  //     //     }),
  //     //   })
  //     [];

  const setTabRef = (ref: any) => {
    // console.log({ ref });

    if (canReorder) {
      // tabDrag && tabDrag(ref);
      // tabDrop && tabDrop(ref);
    }
  };

  return (
    <div
      tabIndex={1}
      draggable="true"
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
        {'after:!bg-statusBar-background-active': hasStatusbar && isActive } ,
        {'after:!bg-tab-background-active': !hasStatusbar && isActive },
        'fc-tab',
        'flex',
        'items-center',
        'border-tab-border',
        'relative',
        'w-fit',
        'whitespace-pre',
        'relative',
        { tabVersion },
        className
      )}
      ref={setTabRef}
      onClick={(e) => onSelect(id, index, e)}
    >
      <div
        className={cx(
          { 'active': isActive },
          { 'bg-tab-background-activeColor': tabVersion == 2 },
          { 'bg-statusBar-background-active': tabVersion == 2 && isActive },
          {'!bg-tab-background-active': !hasStatusbar && isActive },
          {'!bg-statusBar-background-active': hasStatusbar && isActive },
          'fc-tab',
          'hover:bg-tab-background-hover',
          'flex',
          'items-center',
          'px-2',
          'h-full',
          'relative',
          'w-full',
          'whitespace-pre',
          'relative',
          { 'bg-tab-background': tabVersion == 1 },
        )}
      >
        <TopBorderPlacement
          show={borderMeta?.placementForActive === 'top' && isActive}
        />
        <div className="fc-tab-content flex flex-1 items-center justify-center">
          {preComp ? (
            <div className="flex items-center pr-1.5">{preComp()}</div>
          ) : (
            ''
          )}
          <TitlePlacement name={name} isPreview={isPreview} />
          <Count number={count || ''} />
          {dotIndicator === true ? (
            <div className="pl-1 flex items-center text-primaryColor">
              <VscCircleFilled size={10} />
            </div>
          ) : (
            ''
          )}
          {postComp ? (
            <div className="flex items-center pr-1 pl-1">{postComp()}</div>
          ) : (
            ''
          )}
        </div>
        <CloseIconPlacement
          id={`close-ic-${id}`}
          state={state}
          onClick={(e: any) => {
            //to stop firing the onSelect event
            //when user click on the close icon the tab should not call onSelect fn
            e.preventDefault();
            e.stopPropagation();
            //validate the disabled value for close icon
            !closeTabIconMeta?.disabled && 
            closeTabIconMeta?.onClick(index, id, e);
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
