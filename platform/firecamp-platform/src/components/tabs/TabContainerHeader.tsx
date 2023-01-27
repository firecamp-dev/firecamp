import { useEffect, memo, useRef } from 'react';
import classnames from 'classnames';
import shallow from 'zustand/shallow';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import { VscHome } from '@react-icons/all-files/vsc/VscHome';
import { Column, Row, TabsV3 as Tabs } from '@firecamp/ui-kit';
import { _misc } from '@firecamp/utils';
import { TId } from '@firecamp/types';
import EnvironmentSelector from '../common/environment/selector/EnvironmentSelector';
import Menu from './header/Menu';
import { platformEmitter as emitter } from '../../services/platform-emitter';
import { EPlatformTabs } from '../../services/platform-emitter/events';
import { ITabStore, useTabStore } from '../../store/tab';
import GlobalCreateDD from '../common/GlobalCreate';
import platformContext from '../../services/platform-context';

const TabHeaderContainer = () => {
  const tabApi = useRef({});
  const { activeTab, getTab } = useTabStore(
    (s: ITabStore) => ({
      activeTab: s.activeTab,
      getTab: s.getTab,
    }),
    shallow
  );
  const {
    list: tabs,
    orders,
    changeActiveTab,
    changeOrders,
  } = useTabStore.getState() as ITabStore;

  useEffect(() => {
    // console.log(tabApi, 'tabApi..');
    emitter.on(EPlatformTabs.opened, ([tab, orders]) => {
      tabApi.current.add(tab);
    });
    emitter.on(EPlatformTabs.closed, (tabId_s: TId | TId[]) => {
      tabApi.current.close(tabId_s);
    });
    emitter.on(
      EPlatformTabs.changeState,
      ([tabId, state]: [string, 'modified' | 'default']) => {
        tabApi.current.changeState(tabId, state);
      }
    );
    emitter.on(
      EPlatformTabs.changeState,
      ([tabId, state]: [string, 'modified' | 'default']) => {
        tabApi.current.changeState(tabId, state);
      }
    );
    return () => {
      emitter.off(EPlatformTabs.opened);
      emitter.off(EPlatformTabs.closed);
      emitter.off(EPlatformTabs.changeState);
    };
  }, []);

  const openNewTab = () => {
    emitter.emit(EPlatformTabs.openNew);
  };

  const closeTab = (tabId) => {
    const tab = getTab(tabId);
    if (!tab.__meta.hasChange) emitter.emit(EPlatformTabs.close, tabId);
    else {
      platformContext.window.confirm({
        title:
          'The request has changes which are not saved, You can forcefully close the request by ignorig the current changes.',
        message: '',
        texts: {
          btnCancle: 'Cancle',
          btnConfirm: 'Ignore Changes & Close Request',
        },
        onConfirm: () => {
          emitter.emit(EPlatformTabs.close, tabId);
        },
        onCancel: () => {},
        onClose: () => {},
      });
    }
  };

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
                'w-10 h-9 px-2 flex items-center justify-center cursor-pointer border-b bg-tabBackground2 text-tabForegroundInactive border-r border-tabBorder flex-none'
              )}
              onClick={() => changeActiveTab('home')}
            >
              <VscHome size={20} />
            </div>
            <Tabs
              list={tabs}
              orders={orders}
              activeTab={activeTab}
              ref={tabApi}
              onSelect={changeActiveTab}
              withDivider={true}
              height={36}
              tabsVersion={2}
              closeTabIconMeta={{
                show: true,
                onClick: closeTab,
              }}
              tabIndex={-1}
              focus={false}
              className="flex-1 overflow-x-auto overflow-y-visible visible-scrollbar fc-tab-main -mb-1 pb-1"
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
