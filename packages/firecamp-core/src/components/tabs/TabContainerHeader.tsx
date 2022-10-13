import { FC, useEffect, useMemo, useRef } from 'react';
import classnames from 'classnames';
import { Column, Row, TabsV3 as Tabs } from '@firecamp/ui-kit';
import { _misc } from '@firecamp/utils';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import { VscHome } from '@react-icons/all-files/vsc/VscHome';
import shallow from 'zustand/shallow';

import PreComp from './header/PreComp';
import { ITab, ITabFns } from './types/tab';
import Menu from './header/Menu';
import CollabButton from './header/CollabButton';
import { useTabStore } from '../../store/tab';

import { platformEmitter as emitter } from '../../services/platform-emitter';
import { EPlatformTabs } from '../../services/platform-emitter/events';


const TabHeaderContainer: FC<ITabHeaderContainer> = ({ tabFns }) => {

  const tabApi = useRef();
  const { tabs, orders, activeTab } = useTabStore(
    (s: any) => ({
      tabs: s.list,
      orders: s.orders,
      activeTab: s.activeTab,
    }),
    shallow
  );

  useEffect(() => {
    console.log(tabApi, "tabApi..")
    emitter.on(EPlatformTabs.opened, (tab) => {
      tabApi.current.add(tab)
    });
    return () => {
      emitter.off(EPlatformTabs.opened);
    };
  }, []);

  const tabList = useMemo(() => {
    orders.map((tId) => {
      const t = tabs[tId];
      tabs[tId] = {
        ...tabs[tId],
        name: t.name || t.request.meta.name,
        preComp: () => (
          <PreComp method={t?.request?.method || ''} type={t.type} />
        ),
        dotIndicator: t.meta?.hasChange === true,
      };
    });
    return tabs;
  }, [tabs, orders]);

  console.log(tabList, orders, 'tabList....');
  return (
    <Column
      overflow="visible"
      className="bg-tabBackground2 focus-outer"
      tabIndex={1}
    >
      <Row>
        <Column flex={1} overflow="auto" className="-mb-96 pb-96">
          <div className="flex z-30 relative">
            <div
              tabIndex={1}
              className={classnames(
                {
                  'active text-tabForeground bg-tabActiveBackground !border-b-transparent':
                    activeTab === 'home',
                },
                'w-10 h-9 flex items-center justify-center cursor-pointer border-b bg-tabBackground2 text-tabForegroundInactive border-r border-tabBorder flex-none'
              )}
              onClick={() => tabFns.setActive('home')}
            >
              <VscHome size={20} />
            </div>
            <Tabs
              list={tabList}
              orders={orders}
              activeTab={activeTab}
              ref={tabApi}
              onSelect={tabFns.setActive}
              withDivider={true}
              canReorder={true}
              height={36}
              tabsVersion={2}
              closeTabIconMeta={{
                show: true,
                onClick: (i, id) => tabFns.close(null, id),
              }}
              tabIndex={-1}
              focus={false}
              className="flex-1 overflow-x-auto overflow-y-visible visible-scrollbar request-tab-wrapper"
              suffixComp={
                <div className="flex -ml-1 h-full">
                  <div
                    tabIndex={1}
                    className="w-9 flex items-center justify-center cursor-pointer bg-tabBackground2 text-tabForegroundInactive border-r  border-tabBorder relative"
                    onClick={(e) => tabFns.open()}
                  >
                    <a>
                      <VscAdd size={16} />
                    </a>
                  </div>
                  <Menu tabFns={tabFns} />
                </div>
              }
            />
          </div>
        </Column>
        <CollabButton />
      </Row>
    </Column>
  );
};

export default TabHeaderContainer;

interface ITabHeaderContainer {
  tabFns: ITabFns;
}
