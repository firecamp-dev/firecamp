import { FC, memo, useState } from 'react';
import isEqual from 'react-fast-compare';
import { ProgressBar, Help, Container, Resizable, Notes } from '@firecamp/ui';
import { _object } from '@firecamp/utils';
import { IRestResponse, TId } from '@firecamp/types';
import Tabs from './tabs/Tabs';

interface IResponsePanel {
  id: TId;
  response: IRestResponse;
  testResult: any;
  scriptErrors?: any[];
  isRequestRunning?: boolean;
  docLink?: string;
  client?: string;
}
const Response: FC<IResponsePanel> = ({
  id,
  response,
  testResult,
  scriptErrors,
  isRequestRunning = false,
  docLink = '',
  client = '',
}) => {
  const [activeBodyTab, setActiveBodyTab] = useState('Body');
  console.log('response in', response);
  return (
    <Resizable
      width={'50%'}
      height="100%"
      left={true}
      maxWidth={900}
      className="bg-app-background-secondary"
      minWidth={400}
    >
      <Container>
        <Container.Header className="z-20">
          <ProgressBar active={isRequestRunning} short />
        </Container.Header>
        <Container.Body className="w-full">
          {response && Object.keys(response).length > 1 ? (
            <div className="h-full">
              <Tabs
                id={id}
                response={response}
                testResult={testResult}
                scriptErrors={scriptErrors}
                isRequestRunning={isRequestRunning}
                activeBodyTab={activeBodyTab}
                onChangeActiveBodyTab={(tab) => {
                  setActiveBodyTab(tab);
                }}
              />
            </div>
          ) : (
            <div className="z-10">
              <Help docLink={docLink} client={client} />
            </div>
          )}
        </Container.Body>
      </Container>
    </Resizable>
  );
};

export default memo(Response, (pp, np) => {
  // console.log(pp, np, deepEqual(pp, np));
  return isEqual(pp, np);
});
