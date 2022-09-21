import { IRest, IRestResponse } from '@firecamp/types';

export interface IRestExecutor {
  /**
   * send the request to the server and return the response
   * received from the server
   * @param request REST request want to send to the server
   */
  send(request: IRest): Promise<IRestResponse>;

  /**  cancel the request */
  cancel(): void;
}
