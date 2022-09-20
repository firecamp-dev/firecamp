import { FC, memo, useState } from 'react';
import deepEqual from 'deep-equal';
import Tabs from './tabs/Tabs';
import { ProgressBar, Help, Container, Resizable } from '@firecamp/ui-kit';
import { _object } from '@firecamp/utils';
import { IRestResponse } from '@firecamp/types';

interface IResponsePanel {
  response: IRestResponse;
  isRequestRunning?: boolean;
  docLink?: string;
  client?: string;
}
const Response: FC<IResponsePanel> = ({
  response,
  isRequestRunning = false,
  docLink = '',
  client = '',
}) => {
  let [activeBodyTab, setActiveBodyTab] = useState('body');
  // console.log('[ui-kit]response component:', response);

  return (
    <Resizable
      width={'50%'}
      height="100%"
      left={true}
      maxWidth={900}
      className="bg-appBackground2"
      minWidth={400}
    >
      <Container>
        <Container.Header className="z-20">
          <ProgressBar active={isRequestRunning}  short/>
        </Container.Header>
        <Container.Body className="w-full">
          {response &&
          Object.keys(response).length > 1 &&
          (response.statusCode !== 0 || response.error) /* ||
          isRequestRunning === true */ ? (
            <div className="h-full">
              <Tabs
                response={response}
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
  return deepEqual(pp, np);
});
