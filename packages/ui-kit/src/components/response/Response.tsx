import { FC, memo, useState } from 'react';
import isEqual from 'react-fast-compare';
import { ProgressBar, Help, Container, Resizable, Notes } from '@firecamp/ui-kit';
import { _object } from '@firecamp/utils';
import { IRestResponse, TId } from '@firecamp/types';
import Tabs from './tabs/Tabs';

interface IResponsePanel {
  id: TId;
  response: IRestResponse;
  isRequestRunning?: boolean;
  docLink?: string;
  client?: string;
}
const Response: FC<IResponsePanel> = ({
  id,
  response,
  isRequestRunning = false,
  docLink = '',
  client = '',
}) => {
  const [activeBodyTab, setActiveBodyTab] = useState('Body');
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
          <ProgressBar active={isRequestRunning} short />
        </Container.Header>
        <Container.Body className="w-full">
          {response && Object.keys(response).length > 1 ? (
            <div className="h-full">
              <Tabs
                id={id}
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
          <div>
            <div className="bg-focus3 p-1 text-base font-semibold">Prescript errors</div>
            <div className="table w-full  border-collapse ">
              <div className="table-row">
                <div className="table-cell border border-appBorder p-1 text-sm font-semibold">
                  type
                </div>
                <div className="table-cell border border-appBorder  p-1 text-sm text-appForegroundInActive">
                  Prescript Error
                </div>
              </div>
              <div className="table-row">
                <div className="table-cell border border-appBorder p-1 text-sm font-semibold">
                  message
                </div>
                <div className="table-cell border border-appBorder  p-1 text-sm text-appForegroundInActive">
                The syntax is not defined
                </div>
              </div>
            </div>
          </div>
        </Container.Body>
      </Container>
    </Resizable>
  );
};

export default memo(Response, (pp, np) => {
  // console.log(pp, np, deepEqual(pp, np));
  return isEqual(pp, np);
});
