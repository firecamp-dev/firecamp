import {
  FC,
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import { TId } from '@firecamp/types';

import Tab from './Tab';
import { ITabs } from './Tabs.interface';
import { EActiveBorderPosition, ITab } from './Tab.interface';

const Tabs: FC<ITabs> = forwardRef(
  (
    {
      id,
      className,
      list,
      orders,
      preComp,
      postComp,
      suffixComp,
      withDivider,
      activeTab,
      equalWidth,
      canReorder,
      height,
      tabsVersion,
      tabIndex,
      focus,
      closeTabIconMeta,
      addTabIconMeta,
      tabBorderMeta,

      onSelect = () => {},
      // onReorder: prop_onReorder = () => {},
    },
    ref
  ) => {
    const [tabs, setTabs] = useState(list);

    // const onReorder = async (dragIndex, hoverIndex) => {
    //   // console.log({ dragIndex, hoverIndex });

    //   let reorderedList = [...sortedList];

    //   let dragTab = reorderedList[dragIndex];
    //   if (dragIndex === undefined || hoverIndex === undefined || !dragTab)
    //     return s;
    //   // console.log({ reorderedList });

    //   //Get sorted Tabs
    //   reorderedList.splice(dragIndex, 1);
    //   reorderedList.splice(hoverIndex, 0, dragTab);
    //   setSortedList(reorderedList);
    //   prop_onReorder(reorderedList);
    // };

    useImperativeHandle(ref, () => {
      return {
        changeName: (tabId: TId, name: string) => {
          setTabs((tabs) => {
            tabs[tabId].name = name;
            return tabs;
          });
        },
        reorder: () => {},
        add: (tab: ITab) => {
          setTabs((tabs) => {
            return { ...tabs, [tab.id]: tab };
          });
        },
        remove: () => {},
      };
    });

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
      >
        <PreComponent preComp={preComp} tabsVersion={tabsVersion} />
        <div className={cx('custom-scrollbar', { 'flex-1': !suffixComp })}>
          <div className="border-b border-tabBorder" style={{ height: height }}>
            <div
              className="flex border-b border-tabBorder items-start"
              style={{ height: height }}
            >
              {orders.map((tabId, i) => {
                const tab = tabs[tabId];
                console.log(tabs, tabId, 555);
                if (!tab) return <Fragment key={tabId}/>;
                return (
                  <Tab
                    key={tabId}
                    index={i}
                    id={tabId}
                    // canReorder={canReorder}
                    tabsVersion={tabsVersion}
                    focus={focus}
                    className={cx(
                      'border-r border-l border-r-transparent border-l-transparent border-tabBorder border-b-tabBorder border-b relative cursor-pointer first:border-l-0',
                      {
                        "active text-tabForeground before:block before:content-[''] before:absolute before:bg-primaryColor before:h-0.5 before:-top-px before:-inset-x-px after:block after:content-[''] after:absolute after:bg-statusBarBackground2 after:h-px after:-bottom-px after:inset-x-0 border-r-tabBorder border-l-tabBorder":
                          tabId == activeTab,
                      },
                      {
                        " after:block text-tabForegroundInactive after:content-[''] after:absolute after:h-px after:w-0.5 after:-left-0.5 after:-bottom-px after:border-t after:border-tabBorder":
                          tabId != activeTab,
                      },
                      {
                        'border-r-tabBorder !border-l-transparent': withDivider,
                      },
                      {
                        ' after:!bg-statusBarBackground2':
                          // i == 0 &&
                          tabId == activeTab,
                      },
                      {
                        'flex-1 text-center': equalWidth,
                      },
                      {
                        'after:!bg-tabActiveBackground':
                          tabsVersion == 1 && tabId == activeTab,
                      },
                      {
                        'after:!bg-statusBarBackground2':
                          tabsVersion == 2 && tabId == activeTab,
                      },
                      { 'bg-transparent text-base': tabsVersion == 1 },
                      { 'bg-tabBackground2 text-sm': tabsVersion == 2 }
                    )}
                    // onReorder={onReorder}
                    name={tab.name}
                    closeTabIconMeta={closeTabIconMeta}
                    borderMeta={tabBorderMeta}
                    isActive={tabId == activeTab}
                    onSelect={onSelect}
                    height={height}
                    {...tab}
                  />
                );
              })}

              {addTabIconMeta?.show && (
                <div
                  id={addTabIconMeta.id || ''}
                  className="px-2 cursor-pointer h-3"
                  onClick={(e) => {
                    if (!addTabIconMeta?.disabled) {
                      addTabIconMeta?.onClick?.(e);
                    }
                  }}
                >
                  <VscAdd className="flex" size={16} />
                </div>
              )}
            </div>
          </div>
        </div>
        <SuffixComponent suffixComp={suffixComp} tabsVersion={tabsVersion} />
        <PostComponent postComp={postComp} />
      </div>
    );
  }
);

const PreComponent: FC<Partial<ITabs>> = ({ preComp, tabsVersion }) => {
  if (!preComp) return <></>;
  return (
    <div
      className={cx(
        'flex items-center pr-2 border-b border-tabBorder',
        { 'bg-tabBackground': tabsVersion == 1 },
        { 'bg-tabBackground2': tabsVersion == 2 }
      )}
    >
      {preComp}
    </div>
  );
};

const SuffixComponent: FC<Partial<ITabs>> = ({ suffixComp, tabsVersion }) => {
  if (!suffixComp) return <></>;
  return (
    <div
      className={cx(
        'flex-1 flex pl-1 items-center pr-2 border-b border-tabBorder',
        { 'bg-transparent': tabsVersion == 1 }
        // { 'bg-tabBackground2': tabsVersion == 2 }
      )}
    >
      {suffixComp}
    </div>
  );
};

const PostComponent: FC<Partial<ITabs>> = ({ postComp, tabsVersion }) => {
  if (!postComp) return <></>;
  return (
    <div
      className={cx(
        'flex items-center pr-2 border-b border-tabBorder ',
        { 'bg-transparent': tabsVersion == 1 }
        // { 'bg-tabBackground2': tabsVersion == 2 }
      )}
    >
      {postComp}
    </div>
  );
};

Tabs.defaultProps = {
  list: {},
  orders: [],
  withDivider: false,
  equalWidth: false,
  canReorder: false,
  height: 32,
  tabsVersion: 1,
  tabIndex: 1,
  focus: true,

  closeTabIconMeta: {
    show: false,
    onClick: () => {},
    disabled: false,
  },
  addTabIconMeta: {
    id: '',
    show: false,
    onClick: () => {},
    disabled: false,
  },
  tabBorderMeta: {
    placementForActive: EActiveBorderPosition.Top,
    right: true,
  },
};

export default Tabs;
