import { useState } from 'react';
import shallow from 'zustand/shallow';
import { VscTrash } from '@react-icons/all-files/vsc/VscTrash';
import {
  Input,
  Container,
  TabHeader,
  Button,
  Column,
  SwitchButtonV2,
  ScrollBar,
} from '@firecamp/ui';
import { IStore, useStore, useStoreApi } from '../../../../store';

const PaneBody = () => {
  const { tabId, listeners, activeListeners, toggleAllListeners } = useStore(
    (s: IStore) => ({
      tabId: s.runtime.tabId,
      listeners: s.request.listeners,
      activeListeners: s.playground.activeListeners,
      toggleAllListeners: s.toggleAllListeners,
    }),
    shallow
  );

  return (
    <Column className="h-full">
      <Container>
        <Container.Header>
          <AddListener />
        </Container.Header>
        {listeners?.length ? (
          <>
            {/* <Container.Body className="visible-scrollbar thin">
              <div className="px-2 hover:pr-1">
                {listeners.map((listener, index) => {
                  return (
                    <Listener
                      key={index}
                      listener={listener}
                      isActive={activeListeners.includes(listener.id)}
                    />
                  );
                })}
              </div>
            </Container.Body> */}

            {/* with radix scrollbar */}
            <Container.Body>
              <ScrollBar fullHeight>
                <>
                  {listeners.map((listener, index) => {
                    return (
                      <Listener
                        key={index}
                        listener={listener}
                        isActive={activeListeners.includes(listener.id)}
                      />
                    );
                  })}
                </>
              </ScrollBar>
            </Container.Body>

            {listeners?.length > 1 ? (
              <Container.Footer>
                <TabHeader>
                  <TabHeader.Right>
                    <Button
                      key={`listener-off-all-${tabId}`}
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
                      key={`listener-on-all-${tabId}`}
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
                {/* <div className="flex p-2"></div> */}
              </Container.Footer>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
      </Container>
    </Column>
  );
};
export default PaneBody;

const AddListener = () => {
  const { addListener } = useStoreApi().getState() as IStore;
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
    const name = listenerName.trim();
    if (!name) return;
    addListener({ id: '', name });
    setListenerName('');
  };

  return (
    <Input
      autoFocus={true}
      type="text"
      name="status"
      id="status"
      placeholder="Listener name"
      className="!rounded-br-none !rounded-tr-none !p-1"
      value={listenerName}
      onChange={_handleInputChange}
      onKeyDown={_handleKeyDown}
      wrapperClassName="!mb-0 p-2"
      postComponents={[
        <Button
          key={'listener-add-button'}
          text="Add"
          className="!rounded-bl-none !rounded-tl-none"
          onClick={_onAddListener}
          secondary
          xs
        />,
      ]}
    />
  );
};

const Listener = ({ listener, isActive }) => {
  const {
    toggleListener,
    deleteListener,
    runtime: { tabId },
  } = useStoreApi().getState() as IStore;
  const { id, name } = listener;
  const uniqueId = `${tabId}-${id}-listen`;
  return (
    <div className="flex justify-center items-center relative px-2 py-0.5 group hover:bg-focus2">
      <div
        className="flex-1 overflow-hidden text-ellipsis text-base"
        data-tip={name}
        id={`${uniqueId}-listener`}
      >
        {name}
      </div>

      <VscTrash
        className="h-0 ml-1 group-hover:h-auto cursor-pointer"
        onClick={() => {
          deleteListener(listener);
        }}
      />
      <SwitchButtonV2
        xs
        checked={isActive}
        onChange={(v) => toggleListener(v, listener)}
        className="ml-1"
      />
    </div>
  );
};
