import { useState, memo, useMemo } from 'react';
import cx from 'classnames';
import shallow from 'zustand/shallow';
import { Column, Resizable, Tabs, Row } from '@firecamp/ui';
import ConfigTab from './connection/ConfigTab';
import HeadersTab from './connection/HeadersTab';
import ParamsTab from './connection/ParamsTab';
import AuthTab from './connection/AuthTab';
import PlaygroundTab from './connection/PlaygroundTab';
import Logs from './logs/Logs';
import { IStore, useStore } from '../../store';

const ConnectionPanel = () => {
  const { tabId, cPanelUi, playgroundHasChanges } = useStore(
    (s: IStore) => ({
      tabId: s.runtime.tabId,
      cPanelUi: s.ui.connectionPanel,
      playgroundHasChanges: s.playground.playgroundHasChanges,
    }),
    shallow
  );
  const [activeBodyTab, setActiveBodyTab] = useState('playground');

  const bodyTabs = useMemo(
    () => [
      {
        id: 'playground',
        name: 'Playground',
        dotIndicator: playgroundHasChanges,
      },
      {
        id: 'headers',
        name: 'Headers',
        count: cPanelUi.headers,
      },
      {
        id: 'params',
        name: 'Params',
        count: cPanelUi.params,
      },
      {
        id: 'config',
        name: 'Config',
      },
      {
        id: 'auth',
        name: 'Auth',
        count: cPanelUi.auth,
      },
    ],
    [cPanelUi, playgroundHasChanges]
  );

  const _renderBody = () => {
    switch (activeBodyTab) {
      case 'playground':
        return <PlaygroundTab key={tabId} />;
      case 'config':
        return <ConfigTab id={tabId} />;
      case 'headers':
        return <HeadersTab id={tabId} />;
      case 'params':
        return <ParamsTab id={tabId} />;
      case 'auth':
        return <AuthTab id={tabId} />;
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
        className={cx({ 'fc-collapsed': false }, 'fc-collapsable')}
      >
        <Logs key={tabId} />
      </Resizable>
    </Row>
  );
};
export default memo(ConnectionPanel);
