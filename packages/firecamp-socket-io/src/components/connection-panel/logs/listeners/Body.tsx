import { useState } from 'react';
import shallow from 'zustand/shallow';
import {
  Input,
  Container,
  TabHeader,
  Button,
  Column,
} from '@firecamp/ui';
import List from './List';
import { IStore, useStore } from '../../../../store';

const Body = ({ toggleCollapsed = (bool) => {} }) => {
  let {
    listeners,
    activePlayground,
    updatePlaygroundListenersValue,
  } = useStore(
    (s: IStore) => ({
      updatePlaygroundListenersValue: s.updatePlayground,
      listeners: s.playgrounds[s.runtime.activePlayground]?.listeners,
      activePlayground: s.runtime.activePlayground,
    }),
    shallow
  );

  return (
    <Column>
      <Container className="with-divider">
        <Container.Header>
          <TabHeader className="padding-small height-small ">
            <TabHeader.Left>
              <div className="fc-tab-panel-info p-2 whitespace-pre">
                <label>Listeners</label>
              </div>
            </TabHeader.Left>
            <TabHeader.Right>
                arrow {/* // TODO: add arrow icon here  toggleCollapsed(true); */}
            </TabHeader.Right>
          </TabHeader>
        </Container.Header>
        <Container.Header className="p-2">
          <AddListener activePlayground={activePlayground} />
        </Container.Header>
        <Container.Body>
          <List listeners={listeners} activePlayground={activePlayground} />
        </Container.Body>
        <Container.Footer>
          <div className="flex p-2">
            <Button
              key={`listener-off-all-${activePlayground}`}
              text="Listen off all"
              onClick={() => {
                updatePlaygroundListenersValue(activePlayground, false);
              }}
              secondary
              sm
            />
            <Button
              key={`listener-on-all-${activePlayground}`}
              text="Listen all"
              onClick={() => {
                updatePlaygroundListenersValue(activePlayground, true);
              }}
              secondary
              sm
            />
          </div>
        </Container.Footer>
      </Container>
    </Column>
  );
};

export default Body;

const AddListener = ({ activePlayground = '' }) => {
  const { updatePlaygroundListener } = useStore(
    (s: IStore) => ({
      updatePlaygroundListener: s.updatePlaygroundListener,
    }),
    shallow
  );

  const [listenerName, setListenerName] = useState('');

  const _handleInputChange = (e) => {
    if (e) {
      e.preventDefault();
      const { value } = e.target;
      setListenerName(value);
    }
  };

  const _handleKeyDown = (e) => {
    if (e && e.key === 'Enter') {
      _onAddListener(e);
    }
  };

  const _onAddListener = (e) => {
    if (e) e.preventDefault();

    const listener = listenerName.trim();
    if (!listener) return;

    updatePlaygroundListener(activePlayground, listener, false);
    setListenerName('');
  };

  return (
    <Input
      autoFocus={true}
      type="text"
      name="status"
      id="status"
      placeholder="Listener name"
      className="!rounded-br-none !rounded-tr-none"
      value={listenerName}
      onChange={_handleInputChange}
      onKeyDown={_handleKeyDown}
      wrapperClassName="!mb-0"
      postComponents={[
        <Button
          key={'listener-add-button'}
          text="Add"
          className="!rounded-bl-none !rounded-tl-none"
          onClick={_onAddListener}
          secondary
          sm
        />,
      ]}
    />
  );
};
