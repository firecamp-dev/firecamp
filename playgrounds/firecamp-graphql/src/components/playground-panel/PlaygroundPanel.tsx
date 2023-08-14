import { shallow } from 'zustand/shallow';
import { Plus } from 'lucide-react';
import { Button, Container, Tabs } from '@firecamp/ui';
import Playground from './playground/Playground';
import { useStore, IStore, useStoreApi } from '../../store';

const PlaygroundPanel = () => {
  const {
    playgroundTabs,
    activePlayground,
    setActivePlayground,
    removePlayground,
  } = useStore(
    (s: IStore) => ({
      playgroundTabs: s.runtime.playgroundTabs,
      activePlayground: s.runtime.activePlayground,
      setActivePlayground: s.setActivePlayground,
      removePlayground: s.removePlayground,
    }),
    shallow
  );

  return (
    <Container>
      <Container.Header className="z-20">
        <Tabs
          list={playgroundTabs}
          activeTab={activePlayground}
          onSelect={setActivePlayground}
          closeTabIconMeta={{
            show: true,
            onClick: (i, id) => removePlayground(id),
          }}
          suffixComp={() => {
            return <TabsSuffixComp />;
          }}
        />
      </Container.Header>
      <Container.Body>
        {activePlayground ? (
          <Playground key={activePlayground} id={activePlayground} />
        ) : (
          <></>
        )}
      </Container.Body>
    </Container>
  );
};

export default PlaygroundPanel;

const TabsSuffixComp = () => {
  const { addPlayground } = useStoreApi().getState() as IStore;
  return (
    <Button
      text="add playground"
      leftIcon={<Plus size={12} />}
      onClick={() => addPlayground()}
      transparent
      xs
    />
  );
};
