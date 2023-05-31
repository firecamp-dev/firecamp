import { FC, useEffect, useState } from 'react';
import cx from 'classnames';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import { ScrollBar } from '@firecamp/ui';
import Tab from './Tab';
import { ITabs } from './interfaces/Tabs.interfaces';

const Tabs: FC<ITabs> = ({
  id = '',
  className = '',
  list = [],
  preComp,
  postComp,
  suffixComp,
  withDivider = false,
  activeTab = '',
  equalWidth = false,
  canReorder = false,
  height = 32,
  tabsVersion = 1,
  tabIndex = 1,

  closeTabIconMeta = {
    show: false,
    onClick: () => {},
    disabled: false,
  },

  addTabIconMeta = {
    id: '',
    show: false,
    onClick: () => {},
    disabled: false,
  },

  tabBorderMeta = {
    placementForActive: 'top',
    right: true,
  },

  onSelect = () => {},
  onReorder: propOnReorder,
}) => {
  let [sortedList, setSortedList] = useState(list);

  useEffect(() => {
    if (sortedList !== list) {
      setSortedList(list);
    }
  }, [list]);

  const onReorder = (dragIndex: number, hoverIndex: number) => {
    // console.log({ dragIndex, hoverIndex });

    const reorderedList = [...sortedList];

    const dragTab = reorderedList[dragIndex];
    if (dragIndex === undefined || hoverIndex === undefined || !dragTab) return;
    // console.log({ reorderedList });

    //Get sorted Tabs
    reorderedList.splice(dragIndex, 1);
    reorderedList.splice(hoverIndex, 0, dragTab);
    setSortedList(reorderedList);
    if (typeof propOnReorder == 'function') propOnReorder(reorderedList);
  };

  return (
    <div
      className={cx(
        className,
        'flex',
        'text-base',
        '!border-tabBorder',
        '!border-t-transparent'
        // {'focus-outer-tab' : focus == true }
      )}
      id={id}
      tabIndex={tabIndex}
      data-testid={'tabs-container'}
    >
      {preComp && (
        <div
          className={cx(
            'flex items-center pr-2 border-b border-tabBorder border-r ',
            { 'bg-tabBackground': tabsVersion == 1 },
            { 'bg-tabBackground2': tabsVersion == 2 }
          )}
        >
          {preComp()}
        </div>
      )}

      <ScrollBar
        className={cx({ 'flex-1 ': !suffixComp })}
        transparent
        noWrap
      >
        <div className="border-b border-tabBorder" style={{ height: height }}>
          <div
            className="flex border-b border-tabBorder items-start"
            style={{ height: height }}
          >
            {sortedList.map((tab, i) => {
              return (
                <Tab
                  key={tab.id}
                  index={i}
                  id={tab?.id || ''}
                  canReorder={canReorder}
                  tabVersion={tabsVersion}
                  hasStatusbar={true}
                  className={cx(
                    'border-r border-l border-tabBorder border-b-tabBorder border-b relative cursor-pointer first:border-l-0',
                    {
                      'border-r-transparent border-l-transparent ':
                        tab?.id != activeTab,
                    },
                    {
                      "active text-tabForeground before:block before:content-[''] before:absolute before:bg-primaryColor before:h-0.5 before:-top-px before:-inset-x-px after:block after:content-[''] after:absolute after:bg-statusBarBackground2 after:h-px after:-bottom-px after:inset-x-0 border-r-tabBorder border-l-tabBorder":
                        tab?.id == activeTab,
                    },
                    {
                      " after:block text-tabForegroundInactive after:content-[''] after:absolute after:h-px after:w-0.5 after:-left-0.5 after:-bottom-px after:border-t after:border-tabBorder":
                        tab?.id != activeTab,
                    },
                    {
                      'border-r-tabBorder !border-l-transparent': withDivider,
                    },
                    {
                      ' after:!bg-statusBarBackground2':
                        // i == 0 &&
                        tab?.id == activeTab,
                    },
                    {
                      'flex-1 text-center': equalWidth,
                    },

                    { 'bg-transparent text-base': tabsVersion == 1 },
                    { 'bg-tabBackground2 text-sm': tabsVersion == 2 }
                  )}
                  onReorder={onReorder}
                  name={tab?.name || ''}
                  closeTabIconMeta={closeTabIconMeta}
                  borderMeta={tabBorderMeta}
                  isActive={tab?.id == activeTab}
                  onSelect={onSelect}
                  height={height}
                  {...tab}
                />
              );
            })}
            {addTabIconMeta?.show && (
              <div
                id={addTabIconMeta.id || ''}
                className="px-2 cursor-pointer h-8 flex items-center justify-center"
                onClick={(e) => {
                  if (!addTabIconMeta?.disabled) {
                    addTabIconMeta?.onClick(e);
                  }
                }}
              />
            )}
            {addTabIconMeta?.show && (
              <div
                id={addTabIconMeta.id || ''}
                className="px-2 cursor-pointer h-8 flex items-center justify-center"
                onClick={(e) => {
                  if (!addTabIconMeta?.disabled) {
                    addTabIconMeta?.onClick?.(e);
                  }
                }}
              >
                <VscAdd className="flex" size={16} title="IconAdd" />
              </div>
            )}
          </div>
          {/* </SimpleBar> */}
        </div>
      </ScrollBar>

      {suffixComp && (
        <div
          className={cx(
            'flex-1 flex pl-1 items-center pr-2 border-b border-tabBorder',
            { 'bg-transparent': tabsVersion == 1 }
            // { 'bg-tabBackground2': tabsVersion == 2 }
          )}
        >
          {suffixComp()}
        </div>
      )}
      {postComp && (
        <div
          className={cx(
            'flex items-center pr-2 border-b border-tabBorder ',
            { 'bg-transparent': tabsVersion == 1 }
            // { 'bg-tabBackground2': tabsVersion == 2 }
          )}
        >
          {postComp()}
        </div>
      )}
    </div>
  );
};

export default Tabs;
