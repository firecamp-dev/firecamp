import { useState, useEffect, memo } from 'react';
import {
  Container,
  Column,
  Resizable,
  Row,
  // SecondaryTab,
  TabHeader,
  Tabs,
} from '@firecamp/ui-kit';
import classnames from 'classnames';
import shallow from 'zustand/shallow';
import { _misc } from '@firecamp/utils';
import { EFirecampAgent } from '@firecamp/types';

import Config from './ConfigTab';
import HeadersTab from './HeadersTab';
import ParamsTab from './ParamsTab';

import PlaygroundTab from './PlaygroundTab';
import Logs from '../logs/Logs';
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
  const {
    activePlayground,
    connections,
    updateConnection,
    changeConQueryParams,
  } = useWebsocketStore(
    (s: IWebsocketStore) => ({
      activePlayground: s.runtime.activePlayground,
      connections: s.request.connections,
      updateConnection: s.updateConnection,
      changeConQueryParams: s.changeConQueryParams,
    }),
    shallow
  );
  const connection = connections.find((c) => c.id === activePlayground);
  const [activeBodyTab, onSelectBodyTab] = useState('playground');

  useEffect(() => {
    if (_misc.firecampAgent() === EFirecampAgent.Desktop) {
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

  const _renderBody = () => {
    switch (activeBodyTab) {
      case 'playground':
        return <PlaygroundTab key={activePlayground} />;

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
            onUpdate={(qps) => changeConQueryParams(activePlayground, qps)}
          />
        );

      default:
        return <PlaygroundTab />;
    }
  };


  return (
    <Row flex={1} overflow="auto" className=" with-divider h-full">
      <Column className="h-full">
        <Container>
          <Container.Header>
            <TabHeader className="height-small !px-0 z-20 relative w-full">
              <Tabs
                className="flex items-center w-full"
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
        <Logs key={activePlayground} />
      </Resizable>
    </Row>
  );
};
export default memo(ConnectionTab);
