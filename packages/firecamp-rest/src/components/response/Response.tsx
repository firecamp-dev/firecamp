import { FC } from 'react';
import { Response as ResponsePanel } from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';

import { useRestStore } from '../../store';

const Response: FC<any> = () => {
  let { response, isRequestRunning } = useRestStore(
    (s: any) => ({
      response: s.response,
      isRequestRunning: s.runtime.isRequestRunning,
    }),
    shallow
  );

  return (
    <ResponsePanel
      response={response}
      isRequestRunning={isRequestRunning}
      docLink={'https://doc.firecamp.io/http/a/sending-your-first-request/'}
      client={'Rest'}
    />
  );
};

export default Response;
