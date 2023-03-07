import { useState, memo } from 'react';
import cx from 'classnames';
import shallow from 'zustand/shallow';
import { Column, Resizable, Tabs, Row } from '@firecamp/ui-kit';
import ConfigTab from './ConfigTab';
import HeadersTab from './HeadersTab';
import ParamsTab from './ParamsTab';
import AuthTab from './AuthTab';
import PlaygroundTab from './PlaygroundTab';
import Logs from '../logs/Logs';
import { IStore, useStore } from '../../../store';

const bodyTabs = [
  {
    id: 'playground',
    name: 'Playground',
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
    id: 'config',
    name: 'Config',
  },
  {
    id: 'auth',
    name: 'Auth',
  },
];

const ConnectionTab = () => {
  const {
    activePlayground,
    connections,
    updateConnection,
    changeConQueryParams,
  } = useStore(
    (s: IStore) => ({
      activePlayground: s.runtime.activePlayground,
      connections: s.request.connections,
      updateConnection: s.updateConnection,
      changeConQueryParams: s.changeConQueryParams,
    }),
    shallow
  );
  const [activeBodyTab, setActiveBodyTab] = useState('playground');
  const connection = connections.find((c) => c.id === activePlayground);

  const _onChangeConfig = (key, value) => {
    updateConnection(activePlayground, key, value);
  };

  const _onChangeHeaders = (headers = []) => {
    updateConnection(activePlayground, 'headers', headers);
  };

  const _onChangeAuth = (auth = []) => {
    updateConnection(activePlayground, 'auth', auth);
  };

  const _renderBody = () => {
    switch (activeBodyTab) {
      case 'playground':
        return <PlaygroundTab key={activePlayground} />;
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
      case 'auth':
        return (
          <AuthTab
            auth={connection?.auth || []}
            activeConnectionId={activePlayground}
            onUpdate={_onChangeAuth}
          />
        );
      default:
        return <PlaygroundTab />;
    }
  };

  return (
    <Row flex={1} overflow="auto" className=" with-divider h-full">
      <Column className="h-full flex flex-col z-20">
        <div className="z-20 relative">
          <Tabs
            key="tabs"
            list={bodyTabs || []}
            activeTab={activeBodyTab || ''}
            onSelect={(tabId: string) => setActiveBodyTab(tabId)}
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
        className={cx(
          { 'fc-collapsed': false },
          'fc-collapsable'
        )}
      >
        <Logs key={activePlayground} />
      </Resizable>
    </Row>
  );
};
export default memo(ConnectionTab);
