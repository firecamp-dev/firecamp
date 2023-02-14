import { FC } from 'react';
import { Response as ResponsePanel } from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';
import { IStore, useStore } from '../../store';

const Response: FC<any> = () => {
  const { requestId, response, testResult, isRequestRunning } = useStore(
    (s: IStore) => ({
      requestId: s.request.__ref?.id,
      response: s.response,
      testResult: s.testResult,
      isRequestRunning: s.runtime.isRequestRunning,
    }),
    shallow
  );

  return (
    <ResponsePanel
      id={requestId}
      response={response}
      testResult={testResult}
      isRequestRunning={isRequestRunning}
      docLink={'https://doc.firecamp.io/http/a/sending-your-first-request/'}
      client={'Rest'}
    />
  );
};

export default Response;
