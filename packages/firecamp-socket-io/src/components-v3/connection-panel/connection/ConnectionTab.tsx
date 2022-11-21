import { useState, useEffect, memo } from 'react';
import {
  Container,
  Column,
  Resizable,
  Tabs,
  Row,
  TabHeader,
} from '@firecamp/ui-kit';
import classnames from 'classnames';
import shallow from 'zustand/shallow';
import ConfigTab from './request/connections/ConfigTab';
import HeadersTab from './request/connections/HeadersTab';
import ParamsTab from './request/connections/ParamsTab';
import AuthTab from './request/connections/AuthTab';
import EmitterPlayground from './request/connections/playground/EmitterPlayground';
import Response from './response/Response';
import ConnectionButton from '../../common/connection/ConnectButton';
import { PANEL } from '../../../constants';
import { useSocketStore } from '../../../store';

let bodyTabs = [
  {
    id: 'playground',
    name: 'Playground',
  },
  {
    id: 'config',
    name: 'Config',
  },
  {
    id: 'headers',
    name: 'Headers',
  },
  {
    id: 'params',
    name: 'Params',
  },
  {
    id: 'auth',
    name: 'Auth',
  },
];

const ConnectionTab = ({ tabData = {}, visiblePanel = '' }) => {
  let { activePlayground, connection, updateConnection } = useSocketStore(
    (s) => ({
      activePlayground: s.runtime.activePlayground,
      connection: s.request.connections.find(
        (c) => c.id === s.runtime.activePlayground
      ),
      updateConnection: s.updateConnection,
    }),
    shallow
  );
  let [activeBodyTab, onSelectBodyTab] = useState('config');

  let _onChangeConfig = (key, value) => {
    updateConnection(activePlayground, key, value);
  };

  let _onChangeHeaders = (headers = []) => {
    updateConnection(activePlayground, 'headers', headers);
  };

  let _onChangeParams = (query_params = []) => {
    updateConnection(activePlayground, 'query_params', query_params);
  };

  let _onChangeAuth = (auth = []) => {
    updateConnection(activePlayground, 'auth', auth);
  };

  let _renderBody = () => {
    switch (activeBodyTab) {
      case 'playground':
        return <Playground key={activePlayground} />;

      case 'config':
        return (
          <ConfigTab
            key={activePlayground}
            connection={connection || {}}
            onUpdate={_onChangeConfig}
          />
        );

      case 'headers':
        return (
          <HeadersTab
            key={activePlayground}
            headers={connection?.headers || []}
            activeconnectionId={activePlayground}
            onUpdate={_onChangeHeaders}
          />
        );

      case 'params':
        return (
          <ParamsTab
            params={connection?.query_params || []}
            activeconnectionId={activePlayground}
            onUpdate={_onChangeParams}
          />
        );

      case 'auth':
        return (
          <AuthTab
            auth={connection?.auth || []}
            activeconnectionId={activePlayground}
            onUpdate={_onChangeAuth}
          />
        );

      default:
        return <Playground />;
    }
  };

  let Playground = () => {
    return (
      <Row flex={1} overflow="auto" className=" with-divider h-full">
        <Column className="h-full">
          <EmitterPlayground tabData={{ id: '123' }} />
        </Column>
      </Row>
    );
  };

  return (
    <Container>
      <Container.Body>
        <Row flex={1} overflow="auto" className=" with-divider h-full">
          <Column className="h-full flex flex-col z-20">
            <div className="z-20 relative">
            <Tabs
              key="tabs"
              list={bodyTabs || []}
              activeTab={activeBodyTab || ''}
              onSelect={onSelectBodyTab}
              postComp={() => <ConnectionButton />}
              // tabsClassName="tabs-with-bottom-border-left-section"
            />
            </div>
            {_renderBody()}
          </Column>
          <Resizable
            width={'100%'}
            height="100%"
            maxWidth="60%"
            minWidth="20%"
            left={true}
            className={classnames(
              { 'fc-collapsed': visiblePanel === PANEL.RESPONSE },
              'fc-collapsable'
            )}
          >
            <Column className="h-full">
              <Response key={activePlayground} />
            </Column>
          </Resizable>
        </Row>{' '}
      </Container.Body>
    </Container>
  );
};
export default memo(ConnectionTab);
