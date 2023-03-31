import { useState } from 'react';
import shallow from 'zustand/shallow';
import {
  Checkbox,
  Input,
  Container,
  TabHeader,
  Button,
  Column,
} from '@firecamp/ui';
import { IStore, useStore } from '../../../../store';

const PaneBody = () => {
  let { listeners, activePlayground, updatePlaygroundListenersValue } =
    useStore(
      (s: IStore) => ({
        updatePlaygroundListenersValue: s.updatePlayground,
        listeners: s.playgrounds[s.runtime.activePlayground]?.listeners,
        activePlayground: s.runtime.activePlayground,
        deletePlaygroundListener: s.deletePlaygroundListener,
      }),
      shallow
    );

  listeners = {
    message: true,
    event: true,
    'request:updated': true,
    message1: true,
    eventq: true,
    'requestw:updated': true,
    messagew: true,
    evente: true,
    'requeest:updated': true,
    messagee: true,
    eventr: true,
    'requestr:updated': true,
    'reqdueest:updated': true,
    messsagee: true,
    evenftr: true,
    'reqsuestr:updated': true,
  };

  return (
    <Column>
      <Container>
        <Container.Header>
          <AddListener activePlayground={activePlayground} />
        </Container.Header>
        <Container.Body>
          {Object.keys(listeners).map((listener, index) => {
            return (
              <Listener
                id={'' + index}
                key={index}
                activePlayground={activePlayground}
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
                  updatePlaygroundListenersValue(activePlayground, false);
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
                  updatePlaygroundListenersValue(activePlayground, true);
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

const Listener = ({
  id = '',
  activePlayground = '',
  name = 'Listener',
  value = false,
}) => {
  const { updatePlaygroundListener, deletePlaygroundListener } = useStore(
    (s) => ({
      updatePlaygroundListener: s.updatePlaygroundListener,
      deletePlaygroundListener: s.deletePlaygroundListener,
    })
  );

  const uniqueId = `${activePlayground}-${id}-listen`;

  const _onToggleListen = (event) => {
    updatePlaygroundListener(
      activePlayground,
      name,
      event?.target?.checked || false
    );
  };

  const _onRemove = (event) => {
    if (event) event.preventDefault();
    deletePlaygroundListener(activePlayground, name);
  };

  return (
    <div className="fc-listeners-list-item flex justify-center items-center relative px-2 py-0.5">
      <div
        className="flex-1 overflow-hidden overflow-ellipsis text-base"
        data-tip={name}
        id={`${uniqueId}-name`}
      >
        {name}
      </div>
      <div className="small">
        <Checkbox
          id={uniqueId}
          isChecked={value}
          onToggleCheck={_onToggleListen}
        />
      </div>
    </div>
  );
};
