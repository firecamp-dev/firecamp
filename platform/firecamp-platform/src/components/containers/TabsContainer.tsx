import { FC, useEffect } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import { shallow } from 'zustand/shallow';
import { Row, RootContainer, Column } from '@firecamp/ui';
import { _object } from '@firecamp/utils';
import { _misc } from '@firecamp/utils';

import TabContainerHeader from '../tabs/TabContainerHeader';
import TabContainerBody from '../tabs/TabContainerBody';
import { useTabStore, ITabStore } from '../../store/tab';
import { useEnvStore, IEnvironmentStore } from '../../store/environment';

const TabsContainer: FC<any> = () => {
  const { tabs, activeTab, tabFns } = useTabStore(
    (s: ITabStore) => ({
      tabs: s.list,
      activeTab: s.activeTab,
      tabFns: {
        reorder: s.reorder,
        open: s.open,
        close: s.close,
      },
    }),
    shallow
  );

  const { toggleEnvSidebar } = useEnvStore(
    (s: IEnvironmentStore) => ({
      toggleEnvSidebar: s.toggleEnvSidebar,
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

  const _tabFns = {
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

    save: () => {
      document.getElementById(`save-request-${activeTab}`).click();
    },
  };

  return (
    <Column flex="1" overflow="auto">
      <RootContainer className="fc-tabs">
        <Row className="flex-col fc-h-screen" overflow="auto">
          <TabContainerHeader />
          <TabContainerBody />
        </Row>
      </RootContainer>
    </Column>
  );
};

export default TabsContainer;
