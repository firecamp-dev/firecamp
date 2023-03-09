import { FC } from 'react';
import { Response as ResponsePanel } from '@firecamp/ui';
import shallow from 'zustand/shallow';
import { IStore, useStore } from '../../store';

const Response: FC<any> = () => {
  const { requestId, response, scriptErrors, testResult, isRequestRunning } =
    useStore(
      (s: IStore) => ({
        requestId: s.request.__ref?.id,
        response: s.response,
        scriptErrors: s.scriptErrors,
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
      scriptErrors={scriptErrors}
      isRequestRunning={isRequestRunning}
      docLink={'https://doc.firecamp.io/http/a/sending-your-first-request/'}
      client={'Rest'}
    />
  );
};

export default Response;
