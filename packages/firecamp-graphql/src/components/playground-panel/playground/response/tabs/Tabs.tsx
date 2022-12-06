import { useState, useEffect } from 'react';
import equal from 'deep-equal';
import shallow from 'zustand/shallow';
import {
  CustomMessage,
  Container,
  ProgressBar,
  Tabs as TabsUI,
} from '@firecamp/ui-kit';

import BodyTab from './BodyTab';
import HeaderTab from './HeaderTab';
import CookieTab from './CookieTab';
import TimelineTab from './TimelineTab';

import { useGraphQLStore } from '../../../../../store';
import { EFirecampAgent } from '@firecamp/types';
import { _misc } from '@firecamp/utils';

const Tabs = ({ activeBodyTab = 'body', onChangeActiveBodyTab = () => {} }) => {
  let { response = {} } = useGraphQLStore(
    (s) => ({
      response: s.playgrounds?.[s.runtime.activePlayground]?.response,
    }),
    shallow
  );
  let { config, data, duration, size, status, headers, cookies, error } =
    response;

  let [tabs, setTabs] = useState([
    { name: 'Body', id: 'body', count: 0 },
    { name: 'Headers', id: 'headers', count: headers?.length || 0 },
    { name: 'Cookies', id: 'cookies', count: cookies?.length || 0 },
    { name: 'Timeline', id: 'timeline', count: 0 },
  ]);
  let [activeTab, setActiveTab] = useState(activeBodyTab || 'body');

  //update header and cookie number badge in tabs. //todo: need to improve the logic
  useEffect(() => {
    let newTabs = [
      { name: 'Body', id: 'body', count: 0 },
      { name: 'Headers', id: 'headers', count: headers?.length || 0 },
      { name: 'Cookies', id: 'cookies', count: cookies?.length || 0 },
      { name: 'Timeline', id: 'timeline', count: 0 },
    ];
    if (!equal(newTabs, tabs)) {
      setTabs(newTabs);
    }
  }, [headers, cookies]);

  if (_misc.firecampAgent() !== EFirecampAgent.Desktop) {
    let newTabs = tabs.filter((e) => e.id !== 'timeline');
    if (!equal(newTabs, tabs)) {
      setTabs(newTabs);
    }
  }

  let _renderTab = (tab) => {
    // console.log("tab", tab);
    switch (tab) {
      case 'body':
        if (!!response.error && !!response.data) {
          return (
            <Container>
              <Container.Body>
                <BodyTab />
              </Container.Body>
              <Container.Footer>
                <CustomMessage message={response.error || ''} />
              </Container.Footer>
            </Container>
          );
        } else if (!response.data && !!response.error) {
          return <CustomMessage message={response.error || ''} />;
        } else {
          return <BodyTab />;
        }
        break;
      case 'headers':
        return <HeaderTab />;
        break;
      case 'cookies':
        return <CookieTab />;
        break;
      case 'timeline':
        return <TimelineTab />;
        break;
      default:
        return <span />;
    }
  };

  let _updateActiveTab = (tab) => {
    setActiveTab(tab);
    onChangeActiveBodyTab(tab);
  };

  return (
    <Container>
      <Container.Header>
        <TabsUI
          list={tabs}
          activeTab={activeTab}
          onSelect={(tab) => _updateActiveTab(tab)}
          postComp={
            (_) => <></>
            // <ResponseMetaData />
          }
        />
        {/* <ProgressBarWrapper/> */}
      </Container.Header>
      <Container.Body>
        <div className="h-full tab-content">
          <div className="tab-pane active h-full" id={activeTab}>
            {_renderTab(activeTab)}
          </div>
        </div>
      </Container.Body>
    </Container>
  );
};

export default Tabs;

// using wrapper to avoid whole Tab component re-render
const ProgressBarWrapper = () => {
  let { playgroundTab = {} } = useGraphQLStore(
    (s) => ({
      playgroundTab: s.runtime.playgroundTabs.find(
        (t) => t.id == s.runtime.activePlayground
      ),
    }),
    shallow
  );

  return <ProgressBar active={playgroundTab?.meta?.isRequestRunning} />;
};
