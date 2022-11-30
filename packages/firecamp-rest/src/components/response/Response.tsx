import { FC } from 'react';
import { Response as ResponsePanel } from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';

import { useRestStore, IRestStore } from '../../store';

const Response: FC<any> = () => {
  let { requestId, response, isRequestRunning } = useRestStore(
    (s: IRestStore) => ({
      requestId: s.request.__ref?.id,
      response: s.response,
      isRequestRunning: s.runtime.isRequestRunning,
    }),
    shallow
  );

  return (
    <ResponsePanel
      id={requestId}
      response={response}
      isRequestRunning={isRequestRunning}
      docLink={'https://doc.firecamp.io/http/a/sending-your-first-request/'}
      client={'Rest'}
    />
  );
};

export default Response;
