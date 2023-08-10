import { shallow } from 'zustand/shallow';
import { Container, Column, Resizable } from '@firecamp/ui';
import CollectionTab from './panes/collection-tree/CollectionPane';
import { useStore, IStore } from '../../store';
import ListenerPane from './panes/listeners/ListenerPane';
import CollectionPane from './panes/collection-tree/CollectionPane';

export enum ESidebarTabs {
  Collection = 'Collection',
  Config = 'Config',
}

const SidebarPanel = () => {
  const { activeTab } = useStore(
    (s: IStore) => ({
      activeTab: ESidebarTabs.Collection, //s.ui.sidebarActiveTab,
      // headers: s.ui.headers,
      // playgrounds: s.ui.playgrounds,
      // changeUiActiveTab: s.changeUiActiveTab,
    }),
    shallow
  );

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
          <Container.Body>
            <div
              id={activeTab}
              className="invisible-scrollbar tab-content h-full"
            >
              <div className="w-full h-full flex flex-row explorer-wrapper">
                <Container>
                  <ListenerPane />
                  <CollectionPane />
                </Container>
              </div>
            </div>
          </Container.Body>
        </Container>
      </Column>
    </Resizable>
  );
};

export default SidebarPanel;
