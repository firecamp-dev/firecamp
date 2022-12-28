import { IRest, IRestResponse } from '@firecamp/types';

export interface IRestExecutor {
  /**
   * send the request to the server and return the response
   * received from the server
   * @param request REST request want to send to the server
   */
  send(
    request: IRest
  ): Promise<{
    response: IRestResponse | null;
    error?: { message: string; code: string | number; e: any } | null;
  }>;

  /**  cancel the request */
  cancel(): void;
}
