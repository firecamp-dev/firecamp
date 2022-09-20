import { FC, useState } from 'react';

import equal from 'deep-equal';
import { CustomMessage, Container, Tabs as TabsUI } from '@firecamp/ui-kit';

import BodyTab from './BodyTab';
import HeaderTab from './HeaderTab';
import CookieTab from './CookieTab';
import TimelineTab from './TimelineTab';
import TestScriptResult from './TestScriptResult';
import ResponseMetaData from '../common/ResponseMetaData';
import { _misc } from '@firecamp/utils';
import { EFirecampAgent } from '@firecamp/types';

interface IResTabs {
  response: any;
  activeBodyTab: string;
  isRequestRunning: boolean;
  onChangeActiveBodyTab: (tab: string) => void;
}

const Tabs: FC<IResTabs> = ({
  response,
  activeBodyTab = 'body',
  isRequestRunning,
  onChangeActiveBodyTab = (tab: string) => {},
}) => {
  let {
    config,
    data,
    duration,
    size,
    statusCode,
    statusMessage,
    headers,
    cookies,
    error,
    timeline,
    testScriptResult,
  } = response;

  let [tabs, setTabs] = useState([
    { name: 'Body', id: 'body', count: 0 },
    { name: 'Headers', id: 'headers', count: headers?.length || 0 },
    { name: 'Cookies', id: 'cookies', count: cookies?.length || 0 },
    { name: 'Timeline', id: 'timeline', count: 0 },
    { name: 'Test result', id: 'test_result' },
  ]);
  let [activeTab, setActiveTab] = useState<string>(activeBodyTab || 'body');

  //update header and cookie number badge in tabs. //todo: need to improve the logic
  // useEffect(() => {
  //   let newTabs = [
  //     { name: 'Body', id: 'body', count: 0 },
  //     { name: 'Headers', id: 'headers', count: headers?.length || 0 },
  //     { name: 'Cookies', id: 'cookies', count: cookies?.length || 0 },
  //     { name: 'Timeline', id: 'timeline', count: 0 }
  //   ];
  //   if (!equal(newTabs, tabs)) {
  //     setTabs(newTabs);
  //   }
  // }, [headers, cookies]);

  /* if (_misc.firecampAgent() !== EFirecampAgent.desktop) {
    let newTabs = tabs.filter((e) => e.id !== 'timeline');
    if (!equal(newTabs, tabs)) {
      setTabs(newTabs);
    }
  } */

  // console.log({ response });

  let _renderTab = (tab: string) => {
    // console.log("tab", tab);
    switch (tab) {
      case 'body':
        if (!!response.error && !!response.data) {
          return (
            <Container>
              <Container.Body>
                <BodyTab data={data} headers={headers} />
              </Container.Body>
              <Container.Footer>
                <CustomMessage message={response.error || ''} />
              </Container.Footer>
            </Container>
          );
        } else if (!response.data && !!response.error) {
          return <CustomMessage message={response.error || ''} />;
        } else {
          return <BodyTab data={data} headers={headers} />;
        }
        break;
      case 'headers':
        return <HeaderTab headers={headers} />;
        break;
      case 'cookies':
        return <CookieTab cookies={cookies} />;
        break;
      case 'timeline':
        return <TimelineTab timeline={timeline} />;
        break;
      case 'test_result':
        return <TestScriptResult result={testScriptResult} />;
      default:
        return <span />;
    }
  };

  let _updateActiveTab = (tab: string) => {
    setActiveTab(tab);
    onChangeActiveBodyTab(tab);
  };
  // console.log({ response });

  return (
    <Container>
      <Container.Header className="z-20">
        <TabsUI
          list={tabs}
          activeTab={activeTab}
          onSelect={(tab: string) => _updateActiveTab(tab)}
          postComp={() => (
            <ResponseMetaData
              isRequestRunning={isRequestRunning}
              duration={duration}
              size={size}
              statusCode={statusCode}
              statusMessage={statusMessage}
            />
          )}
        />
      </Container.Header>
      <Container.Body>
        <div
          className="tab-content h-full"
          // activeTab={activeTab}
        >
          <div
            className="tab-pane active h-full"
            // tabId={activeTab}
          >
            {isRequestRunning === true &&
            response.error &&
            response.error.message ? (
              <CustomMessage message={response.error?.message || ''} />
            ) : (
              _renderTab(activeTab)
            )}
          </div>
        </div>
      </Container.Body>
    </Container>
  );
};

export default Tabs;
