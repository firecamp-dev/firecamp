import { IRest, IRestResponse } from '@firecamp/types';

declare global {
  interface Window {
    fc: {
      restExecutor: {
        send(
          request: IRest,
          variables: any
        ): Promise<{
          response: IRestResponse;
          variables: any;
          testResult: any;
          scriptErrors: any[];
        }>;
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
