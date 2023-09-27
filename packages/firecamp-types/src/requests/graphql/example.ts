import { IHeader, EHttpMethod, IUrl } from '../../common';
import { TId } from '../../common/general';
import { TGraphQLBody, IResponse } from '../rest';

/**
 * example which describe the possibilities of the requests
 */
export interface IGraphQLExample {
  /**
   * server
   */
  url: IUrl;
  /**
   * request method
   */
  method: EHttpMethod;
  /**
   * request queries
   */
  body?: TGraphQLBody;

  /**
   * request headers
   */
  headers?: IHeader[];
  /**
   * possible response list
   */
  response?: IResponse;
  /**
   * example reference info
   */
  __ref: {
    /**
     * example id
     */
    id: TId;
  };
}
