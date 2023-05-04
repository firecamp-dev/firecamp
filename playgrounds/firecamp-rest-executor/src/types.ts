import { IRest, IRestResponse, IVariableGroup } from '@firecamp/types';

export type TRestExecutionResponse = {
  response: IRestResponse;
  variables: IVariableGroup;
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
    variables: IVariableGroup
  ): Promise<TRestExecutionResponse>;

  /**  cancel the request */
  cancel(): void;
}
