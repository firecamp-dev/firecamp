import { useState, memo } from 'react';
import { Column, Resizable, Tabs, Row } from '@firecamp/ui-kit';
import classnames from 'classnames';
import shallow from 'zustand/shallow';
import ConfigTab from './ConfigTab';
import HeadersTab from './HeadersTab';
import ParamsTab from './ParamsTab';
import AuthTab from './AuthTab';
import EmitterPlayground from './playground/EmitterPlayground';
import Response from '../logs/Response';
import { ISocketStore, useSocketStore } from '../../../store';
import { EPanel } from '../../../types'

const bodyTabs = [
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
  const {
    activePlayground,
    connections,
    updateConnection,
    changeConQueryParams,
  } = useSocketStore(
    (s: ISocketStore) => ({
      activePlayground: s.runtime.activePlayground,
      connections: s.request.connections,
      updateConnection: s.updateConnection,
      changeConQueryParams: s.changeConQueryParams,
    }),
    shallow
  );
  const [activeBodyTab, setActiveBodyTab] = useState('config');
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
        return <Playground />;
    }
  };

  const Playground = () => {
    return (
      <Row flex={1} overflow="auto" className=" with-divider h-full">
        <Column className="h-full">
          <EmitterPlayground tabData={{ id: '123' }} />
        </Column>
      </Row>
    );
  };

  return (
    <Row flex={1} overflow="auto" className=" with-divider h-full">
          <Column className="h-full flex flex-col z-20">
            <div className="z-20 relative">
              <Tabs
                key="tabs"
                list={bodyTabs || []}
                activeTab={activeBodyTab || ''}
                onSelect={(tabId: string)=> setActiveBodyTab(tabId)}
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
              { 'fc-collapsed': visiblePanel === EPanel.Response },
              'fc-collapsable'
            )}
          >
            <Response key={activePlayground} />
          </Resizable>
        </Row>
  );
};
export default memo(ConnectionTab);
