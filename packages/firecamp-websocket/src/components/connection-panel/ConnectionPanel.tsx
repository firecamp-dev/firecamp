import { useState, useEffect, memo } from 'react';
import classnames from 'classnames';
import shallow from 'zustand/shallow';
import {
  Container,
  Column,
  Resizable,
  Row,
  TabHeader,
  Tabs,
} from '@firecamp/ui';
import { _misc } from '@firecamp/utils';
import { EFirecampAgent } from '@firecamp/types';

import Config from './connection/ConfigTab';
import HeadersTab from './connection/HeadersTab';
import ParamsTab from './connection/ParamsTab';

import PlaygroundTab from './connection/PlaygroundTab';
import Logs from './logs/Logs';
import { IStore, useStore } from '../../store';

const bodyTabs = [
  {
    id: 'playground',
    name: 'Playground',
  },
  {
    id: 'params',
    name: 'Params',
  },
  // {
  //   id: 'config',
  //   name: 'Config',
  // },
];

const ConnectionPanel = () => {
  const { tabId, connection, updateConnection, changeConQueryParams } =
    useStore(
      (s: IStore) => ({
        tabId: s.runtime.tabId,
        connection: s.request.connection,
        updateConnection: s.updateConnection,
        changeConQueryParams: s.changeConQueryParams,
      }),
      shallow
    );
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
    updateConnection('config', { [key]: value });
  };

  const _onChangeHeaders = (headers = []) => {
    updateConnection('headers', headers);
  };

  const _renderBody = () => {
    switch (activeBodyTab) {
      case 'playground':
        return <PlaygroundTab key={tabId} />;

      case 'config':
        return (
          <Config
            key={tabId}
            config={connection?.config || {}}
            onUpdate={_onChangeConfig}
          />
        );

      case 'headers':
        return (
          <HeadersTab
            key={tabId}
            headers={connection?.headers || []}
            id={tabId}
            onUpdate={_onChangeHeaders}
          />
        );

      case 'params':
        return (
          <ParamsTab
            params={connection?.queryParams || []}
            id={tabId}
            onUpdate={(qps) => changeConQueryParams(qps)}
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
          'fc-collapsed': false,
        })}
      >
        <Logs key={tabId} />
      </Resizable>
    </Row>
  );
};
export default memo(ConnectionPanel);
