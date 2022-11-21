//@ts-nocheck

import { useContext, useState } from 'react';
import {
  Input,
  Container,
  TabHeader,
  Button,
  EButtonColor,
  EButtonSize,
  Column,
} from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';

import { SocketContext } from '../../../../Socket.context';
import { useSocketStore } from '../../../../../store';

import List from './List';

const Body = ({ toggleCollapsed = () => {} }) => {
  let { listeners, activePlayground, updatePlaygrondListenersValue,playgrounds } =
    useSocketStore(
      (s) => ({
        updatePlaygrondListenersValue: s.updatePlaygrond,
        playgrounds:s.playgrounds,
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
              <div
                className="icon-caret cursor-pointer"
                onClick={() => {
                  toggleCollapsed(true);
                }}
              ></div>
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
              color={EButtonColor.Secondary}
              // TODO: className="ex-small font-ex-bold"
              size={EButtonSize.Small}
              onClick={() => {
                updatePlaygrondListenersValue(activePlayground, false);
              }}
            />
            <Button
              key={`listener-on-all-${activePlayground}`}
              text="Listen all"
              color={EButtonColor.Secondary}
              // TODO: className="ex-small font-ex-bold"
              size={EButtonSize.Small}
              onClick={() => {
                updatePlaygrondListenersValue(activePlayground, true);
              }}
            />
          </div>
        </Container.Footer>
      </Container>
    </Column>
  );
};

export default Body;

const AddListener = ({ activePlayground = '' }) => {
  let { updatePlaygroundListener } = useSocketStore(
    (s) => ({
      updatePlaygroundListener: s.updatePlaygroundListener,
    }),
    shallow
  );

  let [listenerName, setListenerName] = useState('');

  let _handleInputChange = (e) => {
    if (e) {
      e.preventDefault();
      let { value } = e.target;
      setListenerName(value);
    }
  };

  let _handleKeyDown = (e) => {
    if (e && e.key === 'Enter') {
      _onAddListener(e);
    }
  };

  let _onAddListener = (e) => {
    if (e) e.preventDefault();

    let listener = listenerName.trim();
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
          color={EButtonColor.Secondary}
          className="!rounded-bl-none !rounded-tl-none"
          size={EButtonSize.ExSmall}
          onClick={_onAddListener}
        />,
      ]}
    />
  );
};
