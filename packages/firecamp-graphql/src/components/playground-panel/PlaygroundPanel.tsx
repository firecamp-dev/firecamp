import { useEffect } from 'react';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import shallow from 'zustand/shallow';
import { Button, Container, Tabs } from '@firecamp/ui-kit';
import Playground from './playground/Playground';
import { useGraphQLStore, IStore } from '../../store';

const PlaygroundPanel = () => {
  const {
    playgroundTabs,
    activePlayground,
    setActivePlayground,
    addPlayground,
    removePlayground,
  } = useGraphQLStore(
    (s: IStore) => ({
      playgroundTabs: s.runtime.playgroundTabs,
      activePlayground: s.runtime.activePlayground,
      setActivePlayground: s.setActivePlayground,
      addPlayground: s.addPlayground,
      removePlayground: s.removePlayground,
    }),
    shallow
  );

  /** if no playgrounds then add new playground on first render */
  useEffect(() => {
    if (!playgroundTabs?.length) addPlayground();
  }, []);

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
            return (
              <Button
                text="add playground"
                icon={<VscAdd className="mr-2" size={12} />}
                secondary
                iconLeft
                sm
                transparent={true}
                onClick={() => addPlayground()}
                ghost={true}
              />
            );
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
