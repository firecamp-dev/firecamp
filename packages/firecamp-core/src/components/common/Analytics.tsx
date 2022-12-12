import { useEffect } from 'react';
import { EFirecampAgent } from '@firecamp/types';
import { _misc } from '@firecamp/utils';

// Hold the app environment
const env = process.env.NODE_ENV;

const clientId = 1234; //TODO set the clientId here

export default () => {
  useEffect(() => {
    try {
      if (env !== 'production') return;

      const trackingId =
        _misc.firecampAgent() === EFirecampAgent.Desktop
          ? process.env.GOOGLE_ANALYTICS_ELECTRON_ID
          : process.env.GOOGLE_ANALYTICS_CHROME_ID;

      // setTimeout(() => {
      //   if (!clientId) return;
      //   F?.reactGA?.initialize?.(trackingId, {
      //     debug: false,
      //     titleCase: false,
      //     useExistingGa: true,
      //   });
      //   F?.reactGA?.ga('create', trackingId, 'auto', {
      //     cookieFlags: 'SameSite=None; Secure',
      //     storage: 'none',
      //     clientId,
      //   });
      //   F?.reactGA?.ga?.('set', 'checkProtocolTask', null);
      //   F?.reactGA?.event?.({
      //     category: 'app',
      //     action: 'open',
      //   });
      // });
    } catch (e) {
      console.error({ e });
    }
  }, [clientId]);

  return <></>;
};
