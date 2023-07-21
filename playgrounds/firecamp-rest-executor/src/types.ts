import { IRest, IRestResponse, IVariableGroup } from '@firecamp/types';

export type TRestExecutionResponse = {
  response: IRestResponse;
  variables: IVariableGroup;
  testResult?: any;
  scriptErrors?: any[];
};

export interface IRestExecutor {
  /**
   * run the request to fetch the server response
   */
  send(
    request: IRest,
    variables: IVariableGroup
  ): Promise<TRestExecutionResponse>;

  /**  cancel the request */
  cancel(): void;
}
