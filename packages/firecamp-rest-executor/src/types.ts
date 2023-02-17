import { IRest, IRestResponse, TRuntimeVariable } from '@firecamp/types';

export interface IRestExecutor {
  /**
   * send the request to the server and return the response
   * received from the server
   * @param request REST request want to send to the server
   */
  send(
    request: IRest,
    variables: {
      globals: TRuntimeVariable[];
      environment: TRuntimeVariable[];
      collectionVariables: TRuntimeVariable[];
    }
  ): Promise<{
    response: IRestResponse;
    variables: any;
    testResult?: any;
    scriptErrors?: any[];
  }>;

  /**  cancel the request */
  cancel(): void;
}
