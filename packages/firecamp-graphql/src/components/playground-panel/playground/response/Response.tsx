import { useContext, useState } from 'react';
import shallow from 'zustand/shallow';

import ResponseMetaData from './common/ResponseMetaData';
import Tabs from './tabs/Tabs';
import {
  CustomMessage,
  Help,
  Container,
  TabHeader,
  Resizable,
  Response as ResponsePanel,
} from '@firecamp/ui-kit';
import { IGraphQLStore, useGraphQLStore } from '../../../../store';

const Response = () => {
  let { playground, activePlayground, isRequestRunning } = useGraphQLStore(
    (s: IGraphQLStore) => {
      const pId = s.runtime.activePlayground;
      return {
        playground: s.playgrounds[pId],
        activePlayground: pId,
        isRequestRunning: s.runtime.playgroundsMeta[pId].isRequestRunning,
      };
    },
    shallow
  );

  let { request, response } = playground;

  let [activeBodyTab, setActiveBodyTab] = useState('body');
  // console.log("response in response component:", response);

  // console.log("This is the GraphQL Response component");

  return (
    <ResponsePanel response={response} isRequestRunning={isRequestRunning} />
  );

  return (
    <Resizable
      width={'41%'}
      height="100%"
      left={true}
      maxWidth={900}
      className="bg-appBackground2"
      minWidth={400}
    >
      <Container className="with-divider">
        <Container.Body className="w-full">
          {!_object.isEmpty(response) || isRequestRunning === true ? (
            Object.keys(response).length === 1 &&
            Object.keys(response) === ['error'] ? (
              <CustomMessage message={response.error} />
            ) : (
              <Tabs
                activeBodyTab={activeBodyTab}
                onChangeActiveBodyTab={(tab) => {
                  setActiveBodyTab(tab);
                }}
              />
            )
          ) : (
            <Help
              docLink={
                'https://firecamp.io/docs/clients/graphql/run-your-first-graphql-query'
              }
              client={'graphql'}
            />
          )}
        </Container.Body>
      </Container>
    </Resizable>
  );
};

export default Response;

const TestResult = () => <span />;
