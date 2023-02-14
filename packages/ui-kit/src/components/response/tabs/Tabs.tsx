import { FC, useState } from 'react';
import { _misc } from '@firecamp/utils';
import { TId } from '@firecamp/types';
import { CustomMessage, Container, Tabs as TabsUI } from '@firecamp/ui-kit';
import BodyTab from './BodyTab';
import HeaderTab from './HeaderTab';
import CookieTab from './CookieTab';
import TimelineTab from './TimelineTab';
import TestScriptResult from './TestScriptResult';
import ResponseMetaData from '../common/ResponseMetaData';

enum EResponseTabs {
  Body = 'Body',
  Headers = 'Headers',
  Cookie = 'Cookie',
  Timeline = 'Timeline',
  TestResult = 'Test Result',
}

interface IResTabs {
  id: TId;
  response: any;
  error?: any;
  activeBodyTab: string;
  isRequestRunning: boolean;
  onChangeActiveBodyTab: (tab: string) => void;
}

const Tabs: FC<IResTabs> = ({
  id,
  response,
  error,
  activeBodyTab = EResponseTabs.Body,
  isRequestRunning,
  onChangeActiveBodyTab = (tab: string) => {},
}) => {
  const {
    config,
    body,
    responseTime,
    responseSize,
    code,
    status,
    headers = [],
    cookies,
    // error,
    timeline,
    testResult,
  } = response;

  const [tabs] = useState([
    { name: EResponseTabs.Body, id: EResponseTabs.Body, count: 0 },
    {
      name: EResponseTabs.Headers,
      id: EResponseTabs.Headers,
      count: Object.keys(headers).length || 0,
    },
    {
      name: EResponseTabs.Cookie,
      id: EResponseTabs.Cookie,
      count: cookies?.length || 0,
    },
    { name: EResponseTabs.Timeline, id: EResponseTabs.Timeline, count: 0 },
    { name: EResponseTabs.TestResult, id: EResponseTabs.TestResult },
  ]);
  const [activeTab, setActiveTab] = useState<string>(
    activeBodyTab || EResponseTabs.Body
  );

  // console.log({ response, error });

  const _renderTab = (tab: string) => {
    switch (tab) {
      case EResponseTabs.Body:
        if (error?.message && !response.body) {
          return <CustomMessage message={error.message} />;
        } else {
          return <BodyTab id={id} body={body} headers={headers} />;
        }
      case EResponseTabs.Headers:
        return <HeaderTab headers={headers} />;
      case EResponseTabs.Cookie:
        return <CookieTab cookies={cookies} />;
      case EResponseTabs.Timeline:
        return <TimelineTab id={id} timeline={timeline} />;
      case EResponseTabs.TestResult:
        return <TestScriptResult result={testResult} />;
      default:
        return <></>;
    }
  };

  const _updateActiveTab = (tab: string) => {
    setActiveTab(tab);
    onChangeActiveBodyTab(tab);
  };

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
              time={responseTime}
              size={responseSize}
              code={code}
              status={status}
            />
          )}
        />
      </Container.Header>
      <Container.Body>{_renderTab(activeTab)}</Container.Body>
      {/* <Container.Footer>
        <CustomMessage message={'This is the error component'} />
      </Container.Footer> */}
    </Container>
  );
};

export default Tabs;
