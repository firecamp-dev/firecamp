import { useState } from 'react';
import shallow from 'zustand/shallow';
import {
  Checkbox,
  Input,
  Container,
  TabHeader,
  Button,
  Column,
  SwitchButtonV2,
} from '@firecamp/ui';
import { IStore, useStore, useStoreApi } from '../../../../store';

const PaneBody = () => {
  const { listeners, activePlayground, toggleAllListeners } = useStore(
    (s: IStore) => ({
      toggleAllListeners: s.toggleAllListeners,
      listeners: s.playgrounds[s.runtime.activePlayground]?.listeners,
      activePlayground: s.runtime.activePlayground,
    }),
    shallow
  );

  return (
    <Column>
      <Container>
        <Container.Header>
          <AddListener />
        </Container.Header>
        <Container.Body>
          {Object.keys(listeners).map((listener, index) => {
            return (
              <Listener
                id={'' + index}
                key={index}
                name={listener || ''}
                value={listeners[listener] || false}
              />
            );
          })}
        </Container.Body>
        <Container.Footer>
          <TabHeader>
            <TabHeader.Right>
              <Button
                key={`listener-off-all-${activePlayground}`}
                text="Listen off all"
                onClick={() => {
                  toggleAllListeners(false);
                }}
                transparent
                secondary
                ghost
                xs
              />
              <Button
                key={`listener-on-all-${activePlayground}`}
                text="Listen all"
                onClick={() => {
                  toggleAllListeners(true);
                }}
                transparent
                secondary
                ghost
                xs
              />
            </TabHeader.Right>
          </TabHeader>
          <div className="flex p-2"></div>
        </Container.Footer>
      </Container>
    </Column>
  );
};
export default PaneBody;

const AddListener = () => {
  const { toggleListener } = useStoreApi().getState() as IStore;
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
    toggleListener(false, listener);
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

const Listener = ({ id = '', name = 'Listener', value = false }) => {
  const { toggleListener, deleteListener, getActiveConnectionId } =
    useStoreApi().getState() as IStore;

  const uniqueId = `${getActiveConnectionId()}-${id}-listen`;

  const _onToggleListen = (e) => {
    toggleListener(e?.target?.checked || false, name);
  };

  const _onRemove = (event) => {
    if (event) event.preventDefault();
    deleteListener(name);
  };

  return (
    <div className="flex justify-center items-center relative px-2 py-0.5">
      <div
        className="flex-1 overflow-hidden text-ellipsis text-base"
        data-tip={name}
        id={`${uniqueId}-name`}
      >
        {name}
      </div>
      <div className="small">
        {/* <SwitchButtonV2/> */}
        <Checkbox
          id={uniqueId}
          isChecked={value}
          onToggleCheck={_onToggleListen}
        />
      </div>
    </div>
  );
};
