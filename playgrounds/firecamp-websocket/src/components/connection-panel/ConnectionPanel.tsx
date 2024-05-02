import { useState, useEffect, memo, useMemo } from 'react';
import classnames from 'classnames';
import { shallow } from 'zustand/shallow';
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

const ConnectionPanel = () => {
  const {
    tabId,
    connection,
    cPanelUi,
    playgroundHasChanges,
    updateConnection,
  } = useStore(
    (s: IStore) => ({
      tabId: s.runtime.tabId,
      connection: s.request.connection,
      updateConnection: s.updateConnection,
      cPanelUi: s.ui.connectionPanel,
      playgroundHasChanges: s.playground.playgroundHasChanges,
    }),
    shallow
  );
  const [activeBodyTab, onSelectBodyTab] = useState('playground');

  const bodyTabs = useMemo(() => {
    return [
      {
        id: 'playground',
        name: 'Playground',
        dotIndicator: playgroundHasChanges,
      },
      {
        id: 'params',
        name: 'Params',
        count: cPanelUi.params,
      },
      {
        id: 'headers',
        name: 'Headers',
        count: cPanelUi.headers,
      },
      // {
      //   id: 'config',
      //   name: 'Config',
      // },
    ];
  }, [cPanelUi.params, playgroundHasChanges]);

  useEffect(() => {
    //TODO: fix this logic later
    if (_misc.firecampAgent() === EFirecampAgent.Desktop) {
      // bodyTabs.push({ id: 'headers', name: 'Headers' });
    }
  }, []);

  const _onChangeConfig = (key, value) => {
    updateConnection('config', { [key]: value });
  };

  const _renderBody = () => {
    switch (activeBodyTab) {
      case 'playground':
        return <PlaygroundTab key={tabId} />;

      case 'config':
        return (
          <Config
            key={tabId}
            config={{
              ping: connection.ping,
              pingInterval: connection.pingInterval,
            }}
            onUpdate={_onChangeConfig}
          />
        );

      case 'headers':
        return <HeadersTab />;

      case 'params':
        return <ParamsTab />;

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
