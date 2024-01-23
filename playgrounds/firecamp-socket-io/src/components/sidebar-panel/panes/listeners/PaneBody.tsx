import { useState } from 'react';
import { shallow } from 'zustand/shallow';
import { Trash2 } from 'lucide-react';
import {
  Input,
  Container,
  TabHeader,
  Button,
  Column,
  Switch,
  ScrollArea,
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

            <Container.Body>
              <ScrollArea>
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
              </ScrollArea>
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
                      size='compact-xs'
                      ghost
                    />
                    <Button
                      key={`listener-on-all-${tabId}`}
                      text="Listen all"
                      onClick={() => {
                        toggleAllListeners(true);
                      }}
                      size='compact-xs'
                      ghost
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
    <div className="flex items-center p-2">
      <Input
        autoFocus={true}
        type="text"
        name="status"
        id="status"
        placeholder="Listener name"
        value={listenerName}
        onChange={_handleInputChange}
        onKeyDown={_handleKeyDown}
        classNames={{
          root: '!mb-0 w-full !rounded-br-none !rounded-tr-none',
        }}
        size="xs"
      />

      <Button
        key={'listener-add-button'}
        text="Add"
        classNames={{ root: '!rounded-bl-none !rounded-tl-none' }}
        onClick={_onAddListener}
        animate={false}
        secondary
        xs
      />
    </div>
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

      <Trash2
        size={14}
        className="h-0 ml-1 group-hover:h-auto cursor-pointer"
        onClick={() => {
          deleteListener(listener);
        }}
      />
      <Switch
        size="xxs"
        checked={isActive}
        onToggleCheck={(v) => toggleListener(v, listener)}
        classNames={{ root: 'ml-1' }}
      />
    </div>
  );
};
