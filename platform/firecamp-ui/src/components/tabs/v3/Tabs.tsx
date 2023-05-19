import {
  FC,
  DragEventHandler,
  forwardRef,
  Fragment,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
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
      orders: _orders,
      preComp,
      postComp,
      suffixComp,
      withDivider,
      activeTab: _activeTab,
      equalWidth,
      height,
      tabsVersion,
      tabIndex,
      closeTabIconMeta,
      addTabIconMeta,
      tabBorderMeta,
      reOrderable,
      onSelect = () => {},
      onReorder,
    },
    ref
  ) => {
    const dndIds = useRef({ dragId: null, dropId: null });
    const [state, setState] = useState({
      tabs: list,
      activeTab: _activeTab,
      orders: _orders,
    });
    useEffect(() => {
      if (state.activeTab != _activeTab) {
        setState((s) => ({ ...s, activeTab: _activeTab }));
      }
    }, [_activeTab]);

    useImperativeHandle(
      ref,
      () => {
        return {
          changeName: (tabId: TId, name: string) => {
            setState((s) => ({
              ...s,
              tabs: {
                ...s.tabs,
                [tabId]: { ...s.tabs[tabId], name },
              },
            }));
          },
          reorder: () => {},
          add: (tab: ITab) => {
            setState((s) => ({
              ...s,
              tabs: {
                ...s.tabs,
                [tab.id]: tab,
              },
              activeTab: tab.id,
              orders: [...s.orders, tab.id],
            }));
          },
          close: (tabId_s: TId | TId[]) => {
            setState((s) => {
              let orders = s.orders;
              if (typeof tabId_s == 'string') {
                delete s.tabs[tabId_s];
                orders = orders.filter((i) => i != tabId_s);
              } else {
                tabId_s.forEach((id) => {
                  delete s.tabs[id];
                });
                orders = orders.filter((i) => !tabId_s.includes(i));
              }
              const activeTab = orders.includes(s.activeTab)
                ? s.activeTab
                : orders[orders.length - 1];
              return { tabs: s.tabs, orders, activeTab };
            });
          },
          changeState: (
            tabId: TId,
            state: 'modified' | 'default' = 'default'
          ) => {
            setState((s) => ({
              ...s,
              tabs: {
                ...s.tabs,
                [tabId]: {
                  ...s.tabs[tabId],
                  state,
                },
              },
            }));
          },
        };
      },
      []
    );

    const _onSelect = (tabId: TId, index: number, e: any) => {
      setState((s) => ({
        ...s,
        activeTab: tabId,
      }));
      onSelect(tabId, index, e);
    };

    /** set dragId on drag start at Tabs */
    const onDragStart: DragEventHandler<HTMLDivElement> = (e) => {
      dndIds.current.dragId = e.currentTarget.id;
    };

    /** set dropId on drop at Tabs and reorder ids/tabs */
    const onDrop: DragEventHandler<HTMLDivElement> = (e) => {
      dndIds.current.dropId = e.currentTarget.id;
      reorder();
    };

    const reorder = async () => {
      const { dragId, dropId } = dndIds.current;
      const dragIndex = state.orders.findIndex((i) => i == dragId);
      const dropIndex = state.orders.findIndex((i) => i == dropId);

      const orders = [...state.orders];
      orders.splice(dropIndex, 0, orders.splice(dragIndex, 1)[0]);

      setState((s) => ({
        ...s,
        orders,
      }));
      dndIds.current = { dragId: null, dropId: null };
      if (typeof onReorder == 'function') onReorder(orders);
    };

    return (
      <div
        className={cx(
          className,
          'flex',
          'text-base',
          '!border-tab-border',
          '!border-t-transparent'
        )}
        id={id}
        tabIndex={tabIndex}
      >
        <PreComponent preComp={preComp} tabsVersion={tabsVersion} />
        <div className={cx('custom-scrollbar', { 'flex-1': !suffixComp })}>
          <div className="border-b border-tab-border" style={{ height: height }}>
            <div
              className="flex border-b border-tab-border items-start"
              style={{ height: height }}
            >
              {state.orders.map((tabId, i) => {
                const tab = state.tabs[tabId];
                // console.log(state.tabs, tabId, 555);
                if (!tab) return <Fragment key={tabId} />;
                return (
                  <Tab
                    index={i}
                    id={tabId}
                    key={tabId}
                    name={tab.name}
                    height={height}
                    className={cx(
                      'last-of-type:border-r-tab-border border-r border-l border-tab-border border-b-tab-border border-b relative cursor-pointer first:border-l-0',
                      {'border-r-transparent border-l-transparent': tabId !== state.activeTab},
                      {
                        "active text-tab-foreground before:block before:content-[''] before:absolute before:bg-primaryColor before:h-0.5 before:-top-px before:-inset-x-px after:block after:content-[''] after:absolute after:bg-statusBar-background-active after:h-px after:-bottom-px after:inset-x-0 border-r-tab-border border-l-tab-border":
                          tabId == state.activeTab,
                      },
                      {
                        " after:block text-tab-foreground-inactive after:content-[''] after:absolute after:h-px after:w-0.5 after:-left-0.5 after:-bottom-px after:border-t after:border-tab-border":
                          tabId != state.activeTab,
                      },
                      {
                        'border-r-tab-border border-l-tab-border': withDivider,
                      },
                      {
                        ' after:!bg-statusBar-background-active':
                          // i == 0 &&
                          tabId == state.activeTab,
                      },
                      {
                        'flex-1 text-center': equalWidth,
                      },
                      {
                        'after:!bg-tab-background-active':
                          tabsVersion == 1 && tabId == state.activeTab,
                      },
                      {
                        'after:!bg-statusBar-background-active':
                          tabsVersion == 2 && tabId == state.activeTab,
                      },
                      { 'bg-transparent text-base': tabsVersion == 1 },
                      { 'bg-tab-background-activeColor text-sm': tabsVersion == 2 }
                    )}
                    draggable={reOrderable}
                    tabVersion={tabsVersion}
                    closeTabIconMeta={closeTabIconMeta}
                    borderMeta={tabBorderMeta}
                    isActive={tabId == state.activeTab}
                    onSelect={_onSelect}
                    onTabDragStart={onDragStart}
                    onTabDrop={onDrop}
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
        'flex items-center pr-2 border-b border-tab-border',
        { 'bg-tab-background': tabsVersion == 1 },
        { 'bg-tab-background-activeColor': tabsVersion == 2 }
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
        'flex-1 flex pl-1 items-center pr-2 border-b border-tab-border',
        { 'bg-transparent': tabsVersion == 1 }
        // { 'bg-tab-background-activeColor': tabsVersion == 2 }
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
        'flex items-center pr-2 border-b border-tab-border ',
        { 'bg-transparent': tabsVersion == 1 }
        // { 'bg-tab-background-activeColor': tabsVersion == 2 }
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
  reOrderable: false,
  height: 32,
  tabsVersion: 1,
  tabIndex: 1,

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
