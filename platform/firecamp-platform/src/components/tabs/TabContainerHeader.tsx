import { useEffect, memo, useRef } from 'react';
import classnames from 'classnames';
import shallow from 'zustand/shallow';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import { VscHome } from '@react-icons/all-files/vsc/VscHome';
import { Column, Row, TabsV3 as Tabs } from '@firecamp/ui';
import { _misc } from '@firecamp/utils';
import { TId } from '@firecamp/types';
import EnvironmentSelector from '../common/environment/selector/EnvironmentSelector';
import Menu from './header/Menu';
import { platformEmitter as emitter } from '../../services/platform-emitter';
import { EPlatformTabs } from '../../services/platform-emitter/events';
import { ITabStore, useTabStore } from '../../store/tab';
import GlobalCreateDD from '../common/GlobalCreate';
import platformContext from '../../services/platform-context';
import PreComp from './header/PreComp';
import { ETabEntityTypes } from './types';

const TabHeaderContainer = () => {
  const tabApi = useRef({});
  const { activeTab, orders } = useTabStore(
    (s: ITabStore) => ({
      activeTab: s.activeTab,
      orders: s.orders,
    }),
    shallow
  );
  const {
    list: tabs,
    // orders,
    changeActiveTab,
    changeOrders,
    getTab,
    open,
  } = useTabStore.getState() as ITabStore;
  console.log(orders, tabs, activeTab, 'orders.... ');

  useEffect(() => {
    // console.log(tabApi, 'tabApi..');
    emitter.on(EPlatformTabs.Opened, ([tab, orders, [entity, entityMeta]]) => {
      tab.preComp = <PreComp entityType={entityMeta.type} entity={entity} />;
      tabApi.current.add(tab);
    });
    emitter.on(EPlatformTabs.Closed, (tabId_s: TId | TId[]) => {
      tabApi.current.close(tabId_s);
    });
    emitter.on(
      EPlatformTabs.ChangeState,
      ([tabId, state]: [string, 'modified' | 'default']) => {
        tabApi.current.changeState(tabId, state);
      }
    );
    emitter.on(
      EPlatformTabs.ChangeState,
      ([tabId, state]: [string, 'modified' | 'default']) => {
        tabApi.current.changeState(tabId, state);
      }
    );
    return () => {
      emitter.off(EPlatformTabs.Opened);
      emitter.off(EPlatformTabs.Closed);
      emitter.off(EPlatformTabs.ChangeState);
    };
  }, []);

  const openNewTab = () => {
    open({}, { id: '', type: ETabEntityTypes.Request });
  };

  const closeTab = (tabId) => {
    const tab = getTab(tabId);
    if (!tab.__meta.hasChange) emitter.emit(EPlatformTabs.Close, tabId);
    else {
      platformContext.window.confirm({
        title:
          'Changes to this request are not saved; you may forcefully close it by ignoring the changes.',
        message: '',
        texts: {
          btnCancel: 'Cancel',
          btnConfirm: 'Ignore Changes & Close Request',
        },
        onConfirm: () => {
          emitter.emit(EPlatformTabs.Close, tabId);
        },
        onCancel: () => {},
        onClose: () => {},
      });
    }
  };

  console.log(activeTab);
  return (
    <Column
      overflow="visible"
      className="bg-tabBackground2 focus-outer"
      tabIndex={1}
    >
      <Row>
        <Column flex={1} overflow="auto" className="-mb-96 pb-96">
          <div className="flex z-30 relative">
            <HomeTabIcon
              isActive={activeTab === 'home'}
              onClick={() => changeActiveTab('home')}
            />
            <Tabs
              list={tabs}
              orders={orders}
              activeTab={activeTab}
              ref={tabApi}
              withDivider={true}
              height={36}
              tabsVersion={2}
              closeTabIconMeta={{
                show: true,
                onClick: closeTab,
              }}
              tabIndex={-1}
              focus={false}
              className="flex-1 overflow-x-auto visible-scrollbar fc-tab-main -mb-1 pb-1"
              suffixComp={
                <div className="flex -ml-1 h-full">
                  <div
                    tabIndex={1}
                    className="w-9 flex items-center justify-center cursor-pointer bg-tabBackground2 text-tabForegroundInactive border-r  border-tabBorder relative"
                    onClick={(e) => openNewTab()}
                  >
                    <a>
                      <VscAdd size={16} />
                    </a>
                  </div>
                  <Menu />
                </div>
              }
              reOrderable={true}
              onReorder={changeOrders}
              onSelect={changeActiveTab}
            />
          </div>
        </Column>
        <div className="-mb-96 pb-96 flex">
          <EnvironmentSelector />
          <GlobalCreateDD />
        </div>
      </Row>
    </Column>
  );
};

export default memo(TabHeaderContainer);

const HomeTabIcon = ({ isActive, onClick }) => {
  return (
    <div
      tabIndex={1}
      className={classnames(
        {
          'active text-tabForeground !border-b-transparent':
            isActive,
        },
        'w-10 h-9 px-2 flex items-center justify-center cursor-pointer border-b bg-tabBackground2 text-tabForegroundInactive border-r border-tabBorder flex-none'
      )}
      onClick={onClick}
    >
      <VscHome size={20} />
    </div>
  );
};
