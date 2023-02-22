import { IRest, IRestResponse, TRuntimeVariable } from '@firecamp/types';

export type TVariableGroup = {
  globals: TRuntimeVariable[];
  environment: TRuntimeVariable[];
  collectionVariables: TRuntimeVariable[];
};

export type TRestExecutionResponse = {
  response: IRestResponse;
  variables: TVariableGroup;
  testResult?: any;
  scriptErrors?: any[];
};

export interface IRestExecutor {
  /**
   * send the request to the server and return the response
   * received from the server
   * @param request REST request want to send to the server
   */
  send(
    request: IRest,
    variables: TVariableGroup
  ): Promise<TRestExecutionResponse>;

  /**  cancel the request */
  cancel(): void;
}
