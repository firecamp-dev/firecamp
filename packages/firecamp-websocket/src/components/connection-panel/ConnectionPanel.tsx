import { useState, memo } from 'react';
import {
  Container,
  Checkbox,
  Input,
  Button,
  Tabs,
  Popover,
} from '@firecamp/ui-kit';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import shallow from 'zustand/shallow';
import Connection from './connection/Connection';
import { IWebsocketStore, useWebsocketStore } from '../../store';

const ConnectionPanel = () => {
  const { activePlayground, playgroundTabs, setActivePlayground } =
    useWebsocketStore(
      (s: IWebsocketStore) => ({
        config: s.request.config,
        activePlayground: s.runtime.activePlayground,
        playgroundTabs: s.runtime.playgroundTabs,

        setActivePlayground: s.setActivePlayground,
      }),
      shallow
    );

  const [isAddConnPopoverOpen, toggleConnPopover] = useState(false);

  const _onAddNewConnection = async (name = '') => {
    if (!name) return;
    try {
      // await addConnection(name);
      toggleConnPopover(false);
    } catch (error) {
      console.log({ error });
    }
  };

  const _toggleDeleteConnection = (index, id) => {
    // dom onClick event for close-icon-${id} where id is connection id
  };

  const _onSelectConnectionTab = (id) => {
    setActivePlayground(id);
  };

  return (
    <Container>
      <Container.Header className="z-30">
        <Tabs
          className="hidden"
          list={playgroundTabs}
          activeTab={activePlayground}
          onSelect={_onSelectConnectionTab}
          closeTabIconMeta={{ show: true, onClick: _toggleDeleteConnection }}
          preComp={() => (
            <Button className="ml-2" text={'Connections'} secondary xs />
          )}
          postComp={() => (
            <AddNewConnectionPopover
              isOpen={isAddConnPopoverOpen}
              toggleOpen={() => toggleConnPopover(!isAddConnPopoverOpen)}
              popoverId={`add-new-connection-${activePlayground}`}
              existingConnectionNames={playgroundTabs.map((c) => c.name)}
              onAddNewConnection={_onAddNewConnection}
            />
          )}
        />
      </Container.Header>
      <Container.Body>
        <Connection />
      </Container.Body>
    </Container>
  );
};
export default memo(ConnectionPanel);

const AddNewConnectionPopover = ({
  isOpen = false,
  toggleOpen = () => {},
  popoverId = '',
  existingConnectionNames = [],
  onAddNewConnection = (name = '') => {},
}) => {
  const [newConnectionData, setNewConnectionData] = useState({
    isOpen: false,
    name: '',
    errorMsg: '',
    hasValidValue: true,
    hasChange: false,
    connectOnCreate: true,
  });

  const _onAddConn = (e) => {
    if (e) e.preventDefault();

    newConnectionData.name = (newConnectionData.name || '').trim();

    if (!newConnectionData.name || newConnectionData.name.length < 1) {
      setNewConnectionData(
        Object.assign({}, newConnectionData, {
          errorMsg: 'Name can not be empty',
          hasValidValue: false,
          hasChange: true,
          isOpen: true,
        })
      );
      return;
    }

    if (
      newConnectionData.name &&
      existingConnectionNames.includes(newConnectionData.name)
    ) {
      setNewConnectionData(
        Object.assign({}, newConnectionData, {
          errorMsg: 'Connection name is already exist',
          hasValidValue: false,
          hasChange: true,
          isOpen: true,
        })
      );
      return;
    }

    // console.log(`newConnectionData`, newConnectionData)
    onAddNewConnection(newConnectionData.name);

    setNewConnectionData(
      Object.assign(
        {},
        {
          isOpen: false,
          name: '',
          errorMsg: '',
          hasValidValue: true,
          hasChange: false,
          connectOnCreate: true,
        }
      )
    );
  };

  const _onUpdateAddNewConnData = (key, value) => {
    if (!key) return;

    setNewConnectionData(
      Object.assign({}, newConnectionData, {
        [key]: value,
        errorMsg: '',
        hasValidValue: true,
        hasChange: true,
      })
    );
  };

  const _onKeyDown = (e) => {
    if (e.key === 'Enter') {
      _onAddConn(e);
    }
  };

  const _handleInputChange = (e) => {
    if (e) e.preventDefault();

    const { value } = e.target;
    _onUpdateAddNewConnData('name', value);
  };

  // console.log(`newConnectionData`, newConnectionData)

  return (
    <Popover
      key="addNewConnection"
      id={popoverId}
      detach={false}
      isOpen={isOpen}
      onToggleOpen={toggleOpen}
      content={
        <div className="p-2">
          <div className="text-sm font-bold mb-1 text-appForegroundActive opacity-70">
            {'Add new connection'}
          </div>
          <Input
            autoFocus={true}
            type="text"
            className="mb-1"
            placeholder="New connection name"
            value={newConnectionData.name}
            error={newConnectionData.errorMsg || ''}
            onChange={(e) => _handleInputChange(e)}
            onKeyDown={(e) => _onKeyDown(e)}
          />
          <Checkbox
            label="Connect on create"
            isChecked={newConnectionData.connectOnCreate}
            onToggleCheck={async () =>
              _onUpdateAddNewConnData(
                'connectOnCreate',
                !newConnectionData.connectOnCreate
              )
            }
            className="mb-1"
          />
          <div className="text-xs text-appForeground ">{`> hit enter to ${
            'Add new connection' || ''
          }`}</div>
        </div>
      }
    >
      <Popover.Handler>
        <div
          id={popoverId || ''}
          className="items-center h-full px-1 "
          data-tip={'Add new connection'}
          onClick={toggleOpen}
        >
          <VscAdd size={16} />
        </div>
      </Popover.Handler>
    </Popover>
  );
};
