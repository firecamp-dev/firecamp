import { FC, useEffect } from 'react';
import { Row, RootContainer, Column } from '@firecamp/ui-kit';
import _cloneDeep from 'lodash/cloneDeep';
import shallow from 'zustand/shallow';
import { _object } from '@firecamp/utils';
import { ERequestTypes, TId } from '@firecamp/types';
import { _misc } from '@firecamp/utils';

import { useTabStore } from '../../store/tab';
import { useEnvStore, IEnvironmentStore } from '../../store/environment';
import { ITab, ITabFns, ITabMeta } from '../tabs/types/tab';
import TabContainerHeader from '../tabs/TabContainerHeader';
import TabContainerBody from '../tabs/TabContainerBody';
import { platformEmitter as emitter } from '../../services/platform-emitter'
import { EPlatformTabs } from '../../services/platform-emitter/events'

const TabsContainer: FC<any> = () => {
  let { tabs, orders, activeTab, tabFns } = useTabStore(
    (s: any) => ({
      tabs: s.list,
      orders: s.orders,
      activeTab: s.activeTab,

      tabFns: {
        reorder: s.reorder,
        open: s.open,
        close: s.close,
        update: s.update,
      },
    }),
    shallow
  );

  let { toggleEnvSidebar } = useEnvStore(
    (s: IEnvironmentStore) => ({
      toggleEnvSidebar: s.toggleEnvSidebar,
      setWorkspaceActiveEnv: s.setWorkspaceActiveEnv,
      setCollectionActiveEnv: s.setCollectionActiveEnv,
    }),
    shallow
  );

  /**
   * Close environment side bar if no tab is open
   */
  useEffect(() => {
    if (!tabs.length) {
      const { isEnvSidebarOpen } = useEnvStore.getState();

      // check if open env side bar
      if (isEnvSidebarOpen) {
        toggleEnvSidebar();
      }
    }
  }, [tabs]);

  const _tabFns: ITabFns = {
    setActive: (tabId) => {
      tabFns.update.activeTab(tabId);
    },

    open: (tabType: string) => {
      if (!tabType) {
        if (orders.length === 0) tabType = ERequestTypes.Rest;
        else {
          let tab;
          if (activeTab === 'home') {
            tab = tabs[orders[orders.length - 1]];
          } else {
            tab = tabs[activeTab];
          }
          tabType = tab?.type;
        }
      }
      emitter.emit(EPlatformTabs.openNew, tabType);
    },

    close: (e: any, tabId: string, doSave: boolean) => {
      if (e) e.stopPropagation();
      // console.log(tabId, doSave)
      if (doSave) {
        //Todo: this is hack for now, we should close it by action or calling func
        document.getElementById(`save-request-${tabId}`).click(); //click on Save button programmatically
      }

      tabFns.close.active(tabId);
    },
    reorder: (dragIndex: number, hoverIndex: number) => {
      tabFns.reorder(dragIndex, hoverIndex);
    },

    closeAll: (e) => {
      if (e) e?.preventDefault();
      tabFns.close.all();
    },
    closeAllSaved: (e) => {
      if (e) e?.preventDefault();

      tabFns.close.allSaved();
    },
    closeAllFresh: (e) => {
      if (e) e?.preventDefault();
      tabFns.close.allFresh();
    },
    closeAllExceptActive: (e) => {
      if (e) e?.preventDefault();
      tabFns.close.allExceptActive();
    },
    save: () => {
      document.getElementById(`save-request-${activeTab}`).click();
    },
    updateMeta: (tabId: TId, meta: ITabMeta) => {
      // console.log({ tabId, meta });
      tabFns.update.meta(tabId, meta);
    },
    updateRootKeys: (tabId: TId, updatedTab: Partial<ITab>) => {
      tabFns.update.rootKeys(tabId, updatedTab);
    },
  };

  return (
    <Column flex="1" overflow="auto">
      <RootContainer className="fc-tabs">
        <Row className="flex-col fc-h-screen" overflow="auto">
          <TabContainerHeader
            tabFns={_tabFns}
          />
          <TabContainerBody
            tabFns={_tabFns}
          />
        </Row>
      </RootContainer>
    </Column>
  );
};

export default TabsContainer;
