import { useState, useEffect, memo } from 'react';
import {
  Container,
  Column,
  Resizable,
  Row,
  SecondaryTab,
  TabHeader,
} from '@firecamp/ui-kit';
import classnames from 'classnames';
import shallow from 'zustand/shallow';
import { _misc } from '@firecamp/utils';
import { EFirecampAgent } from '@firecamp/types';

import Config from './request/tabs/connections/ConfigTab';
import HeadersTab from './request/tabs/connections/HeadersTab';
import ParamsTab from './request/tabs/connections/ParamsTab';

import Message from './request/tabs/message/Message';
import Response from './response/Response';
import ConnectButton from '../../common/connection/ConnectButton';
import { EPanel } from '../../../types';
import { IWebsocketStore, useWebsocketStore } from '../../../store';

const bodyTabs = [
  // {
  //   id: 'config',
  //   name: 'Config',
  // },
  {
    id: 'params',
    name: 'Params',
  },
  {
    id: 'playground',
    name: 'Playground',
  },
];

const ConnectionTab = ({ tabData = {}, visiblePanel = '' }) => {
  const { activePlayground, connection, updateConnection } = useWebsocketStore(
    (s: IWebsocketStore) => ({
      activePlayground: s.runtime.activePlayground,
      connection: s.request.connections.find(
        (c) => c.id === s.runtime.activePlayground
      ),
      updateConnection: s.updateConnection,
    }),
    shallow
  );
  const [activeBodyTab, onSelectBodyTab] = useState('playground');

  useEffect(() => {
    if (_misc.firecampAgent() === EFirecampAgent.desktop) {
      bodyTabs.push({
        id: 'headers',
        name: 'Headers',
      });
    }
  }, []);

  const _onChangeConfig = (key, value) => {
    updateConnection(activePlayground, 'config', { [key]: value });
  };

  const _onChangeHeaders = (headers = []) => {
    updateConnection(activePlayground, 'headers', headers);
  };

  const _onChangeParams = (queryParams = []) => {
    updateConnection(activePlayground, 'queryParams', queryParams);
  };

  const _renderBody = () => {
    switch (activeBodyTab) {
      case 'playground':
        return <Playground key={activePlayground} />;

      case 'config':
        return (
          <Config
            key={activePlayground}
            config={connection?.config || {}}
            onUpdate={_onChangeConfig}
          />
        );

      case 'headers':
        return (
          <HeadersTab
            key={activePlayground}
            headers={connection?.headers || []}
            activeConnectionId={activePlayground}
            onUpdate={_onChangeHeaders}
          />
        );

      case 'params':
        return (
          <ParamsTab
            params={connection?.queryParams || []}
            activeConnectionId={activePlayground}
            onUpdate={_onChangeParams}
          />
        );

      default:
        return <Playground />;
    }
  };

  const Playground = () => {
    return (
      <Row flex={1} overflow="auto" className=" with-divider h-full">
        <Column className="h-full">
          <Message tabData={{ id: '123' }} />
        </Column>
      </Row>
    );
  };

  return (
    <Row flex={1} overflow="auto" className=" with-divider h-full">
      <Column className="h-full">
        <Container className="with-divider">
          <Container.Header>
            <TabHeader className="height-small !px-0 z-20 relative w-full">
              <SecondaryTab
                className="flex items-center"
                key="tabs"
                list={bodyTabs || []}
                activeTab={activeBodyTab || ''}
                onSelect={onSelectBodyTab}
                additionalComponent={<ConnectButton />}
              />
            </TabHeader>
          </Container.Header>
          <Container.Body>{_renderBody()}</Container.Body>
        </Container>
      </Column>
      <Resizable
        width={'100%'}
        height="100%"
        maxWidth="60%"
        minWidth="20%"
        left={true}
        className={classnames({
          'fc-collapsed': visiblePanel === EPanel.Response,
        })}
      >
        <Response key={activePlayground} />
      </Resizable>
    </Row>
  );
};
export default memo(ConnectionTab);
