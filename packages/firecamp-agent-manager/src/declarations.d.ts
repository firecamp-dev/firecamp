import { IRest, IRestResponse } from '@firecamp/types';

declare global {
  interface Window {
    fc: {
      restExecutor: {
        send(request: IRest): Promise<IRestResponse>;
        cancel(requestId: string): void;
      };
    };
  }
  namespace NodeJS {
    interface ProcessEnv {
      FIRECAMP_EXTENSION_AGENT_ID: string;
    }
  }
}
