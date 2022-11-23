import { Container, Column, Resizable } from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';

import CollectionTab from './tabs/CollectionTab';
import { ISocketStore, useSocketStore } from '../../store';

export enum ESidebarTabs {
  Collection = 'Collection',
  Config = 'Config',
}

const SidebarPanel = () => {
  const { activeTab } = useSocketStore(
    (s: ISocketStore) => ({
      activeTab: ESidebarTabs.Collection, //s.ui.sidebarActiveTab,
      // headers: s.ui.headers,
      // playgrounds: s.ui.playgrounds,
      // changeUiActiveTab: s.changeUiActiveTab,
    }),
    shallow
  );

  // console.log(playgrounds, 'playgrounds... counts');

  // const tabs = useMemo(
  //   () => [
  //     {
  //       id: ESidebarTabs.Collection,
  //       name: ESidebarTabs.Collection,
  //       // count: playgrounds,
  //     },
  //     {
  //       id: ESidebarTabs.Config,
  //       name: ESidebarTabs.Config,
  //     },
  //   ],
  //   []
  // );

  // const _setActiveTab = (tab) => {
  //   if (tab) {
  //     // console.log(`tab`, tab);
  //     changeUiActiveTab(tab);
  //   }
  // };

  const _getRender = (tab) => {
    switch (tab) {
      case ESidebarTabs.Collection:
        return <CollectionTab />;
      case ESidebarTabs.Config:
      // return <HeadersTab />;
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
          {/* <Container.Header className="z-20">
            <Tabs
              list={tabs}
              activeTab={activeTab}
              className="w-full"
              onSelect={_setActiveTab}
              equalWidth={true}
            />
          </Container.Header> */}
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
