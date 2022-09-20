import { useMemo } from 'react';
import { Container, Column, Resizable, Tabs } from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';

import ExplorerTab from './tabs/ExplorerTab';
import CollectionTab from './tabs/CollectionTab';
import HeadersTab from './tabs/HeadersTab';
import { IGraphQLStore, useGraphQLStore } from '../../store';
import { ESidebarTabs } from '../../types';

const SidebarPanel = () => {
  const { activeTab, headers, playgrounds, changeUiActiveTab } =
    useGraphQLStore(
      (s: IGraphQLStore) => ({
        activeTab: s.ui.sidebarActiveTab,
        headers: s.ui.headers,
        playgrounds: s.ui.playgrounds,
        changeUiActiveTab: s.changeUiActiveTab,
      }),
      shallow
    );

  console.log(playgrounds, 'playgrounds... counts');

  const tabs = useMemo(
    () => [
      {
        id: ESidebarTabs.Collection,
        name: ESidebarTabs.Collection,
        count: playgrounds,
      },
      {
        id: ESidebarTabs.Explorer,
        name: ESidebarTabs.Explorer,
      },
      {
        id: ESidebarTabs.Headers,
        name: ESidebarTabs.Headers,
        count: headers,
      },
    ],
    [playgrounds, headers]
  );

  let _setActiveTab = (tab) => {
    if (tab) {
      // console.log(`tab`, tab);
      changeUiActiveTab(tab);
    }
  };

  let _getRender = (tab) => {
    switch (tab) {
      case ESidebarTabs.Collection:
        return <CollectionTab />;
      case ESidebarTabs.Explorer:
        return <ExplorerTab />;
      case ESidebarTabs.Headers:
        return <HeadersTab />;
      default:
        return <></>;
    }
  };

  return (
    <Resizable
      right={true}
      width="260px"
      height="100%"
      minWidth="120px"
      maxWidth="80%"
    >
      <Column>
        <Container className="w-full">
          <Container.Header className="z-20">
            <Tabs
              list={tabs}
              activeTab={activeTab}
              className="w-full"
              onSelect={_setActiveTab}
              equalWidth={true}
            />
          </Container.Header>
          <Container.Body>
            <div
              id={activeTab}
              className="invisible-scrollbar tab-content h-full"
            >
              {_getRender(activeTab)}
            </div>
          </Container.Body>
        </Container>
      </Column>
    </Resizable>
  );
};

export default SidebarPanel;
