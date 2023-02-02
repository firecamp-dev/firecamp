import { IRest, IRestResponse, TRuntimeVariable } from '@firecamp/types';

export type TResponse = Partial<
  Omit<IRestResponse, 'error'> & {
    error?: { message?: string; code?: string | number; e?: any };
  }
>;

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
      collection: TRuntimeVariable[];
    }
  ): Promise<TResponse>;

  /**  cancel the request */
  cancel(): void;
}
