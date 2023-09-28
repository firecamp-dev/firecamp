import { FC, useState } from 'react';
import { _misc } from '@firecamp/utils';
import { IRestResponse, TId } from '@firecamp/types';
import { CustomMessage, Container, Tabs as TabsUI } from '@firecamp/ui';
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
  response: IRestResponse;
  testResult: any;
  scriptErrors?: any[];
  error?: any;
  activeBodyTab: string;
  isRequestRunning: boolean;
  onChangeActiveBodyTab: (tab: string) => void;
}

const Tabs: FC<IResTabs> = ({
  id,
  response,
  testResult = {},
  scriptErrors = [],
  error,
  activeBodyTab = EResponseTabs.Body,
  isRequestRunning,
  onChangeActiveBodyTab = (tab: string) => {},
}) => {
  const {
    body,
    responseTime,
    responseSize,
    code,
    status,
    headers = [],
    cookies,
    // error,
    timeline,
  } = response;

  const { total, passed, failed } = testResult || {};

  const [tabs] = useState([
    { name: EResponseTabs.Body, id: EResponseTabs.Body, count: 0 },
    {
      name: EResponseTabs.Headers,
      id: EResponseTabs.Headers,
      count: Object.keys(headers).length || 0,
    },
    // {
    //   name: EResponseTabs.Cookie,
    //   id: EResponseTabs.Cookie,
    //   count: cookies?.length || 0,
    // },
    { name: EResponseTabs.Timeline, id: EResponseTabs.Timeline, count: 0 },
    {
      name:
        total > 0
          ? `${EResponseTabs.TestResult} (${passed}/${total})`
          : EResponseTabs.TestResult,
      id: EResponseTabs.TestResult,
    },
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
          className='bg-tab-background'
        />
      </Container.Header>
      <Container.Body className="flex flex-col">
        {_renderTab(activeTab)}
        <ScriptErrors errors={scriptErrors} />
      </Container.Body>
      {/* <Container.Footer>
        <CustomMessage message={'This is the error component'} />
      </Container.Footer> */}
    </Container>
  );
};

export default Tabs;

const ScriptErrors = ({ errors = [] }) => {
  console.log(errors, 'errors..... errors');
  return (
    <div className=' w-full bg-app-background'>
      {errors.map((e, i) => (
        <ScriptErrorTable error={e} key={i} />
      ))}
    </div>
  );
};
const ScriptErrorTable: FC<any> = ({ error }) => {
  const {
    type,
    error: { name, message },
  } = error;
  return (
    <div>
      <div className="bg-focus4 p-1 text-base font-semibold">{type} script error</div>
      <div className="table w-full  border-collapse ">
        <div className="table-row  bg-app-background-secondary">
          <div className="table-cell border border-app-border p-1 text-sm font-semibold">
            type
          </div>
          <div className="table-cell border border-app-border  p-1 text-sm text-app-foreground-inactive">
            {name}
          </div>
        </div>
        <div className="table-row bg-app-background-secondary">
          <div className="table-cell border border-app-border p-1 text-sm font-semibold">
            message
          </div>
          <div className="table-cell border border-app-border  p-1 text-sm text-app-foreground-inactive">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};
