import { IHeader, EHttpMethod, IUrl } from '../../common';
import { TId } from '../../common/general';
import { IRestBody } from './body';

/**
 * response body type
 */
export enum EResponseBodyTypes {
  None = 'none',
  Json = 'application/json',
  Xml = 'application/xml',
  Text = 'text',
  Html = 'application/html',
}

/**
 * possible response of request
 */
export interface IResponse {
  /**
   * response status. example: 200 OK
   */
  status?: string;
  /**
   * data receive in response
   */
  body?: {
    /**
     * body type from the list or custom content type. example: 'img/png'
     */
    type: EResponseBodyTypes | string;
    value?: string;
  };
  /**
   * response headers
   */
  headers?: IHeader[];
}

/**
 * example which describe the possibilities of the requests
 */
export interface IRestExample {
  /**
   * server
   */
  url: IUrl;
  /**
   * request method
   */
  method: EHttpMethod;
  /**
   * request bodies
   */
  body?: IRestBody;
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
