import { IRest, IRestResponse } from '@firecamp/types';

declare global {
  interface Window {
    fc: {
      restExecutor: {
        send(request: IRest): Promise<IRestResponse>;
        cancel(requestID: string): void;
      };
    };
  }
  namespace NodeJS {
    interface ProcessEnv {
      CHROME_APP_ID: string;
    }
  }
}
