import {
  Button,
  Container,
 
  EButtonIconPosition,
  
  Tabs,
} from '@firecamp/ui-kit';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import shallow from 'zustand/shallow';
import Playground from './playground/Playground';
import { useGraphQLStore, IGraphQLStore } from '../../store';
import { useEffect } from 'react';

const PlaygroundPanel = () => {
  let {
    playgroundTabs,
    activePlayground,
    setActivePlayground,
    addPlayground,
    removePlayground,
  } = useGraphQLStore(
    (s: IGraphQLStore) => ({
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
                onClick={() => addPlayground('Hello Tab')}
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
