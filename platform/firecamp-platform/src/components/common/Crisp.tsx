import { useEffect, useState } from 'react';

// Hold the app environment
const env = process.env.NODE_ENV;

export default () => {
  let [isCrispLoaded, setCrispLoadedFlag] = useState<boolean>(false);

  useEffect(() => {
    if (env === 'production') {
      if (!isCrispLoaded) {
        window.$crisp = [];
        // window.CRISP_TOKEN_ID = clientId;
        window.CRISP_WEBSITE_ID = process.env.CRISP_FIRECAMP_DEV;
        (() => {
          const d = document;
          const s: any = d.createElement('script');
          s.src = 'https://client.crisp.chat/l.js';
          s.async = 1;
          d.getElementsByTagName('head')[0].appendChild(s);
        })();

        window.$crisp.push([
          'on',
          'session:loaded',
          () => {
            console.log('crisp session loaded');
            window.$crisp.push(['do', 'chat:close']);
            window.$crisp.push(['do', 'chat:hide']);
          },
        ]);

        window.$crisp.push([
          'on',
          'chat:closed',
          () => {
            window.$crisp.push(['do', 'chat:close']);
            window.$crisp.push(['do', 'chat:hide']);
          },
        ]);

        setCrispLoadedFlag(true);
      }
      window.$crisp.push(['safe', true]);
    }
  }, []);
  return <></>;
};
