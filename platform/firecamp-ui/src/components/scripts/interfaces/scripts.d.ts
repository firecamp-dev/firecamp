interface Request {
  /**
   * request URL
   */
  url: IUrl;

  /**
   * request headers
   */
  headers: IHeader[];

  /**
   * HTTP method
   */
  method: EHttpMethod | string;

  /**
   * request body
   */
  body: IRestBody;

  /**
   * add the new header or update the existing header
   */
  addHeader: (headerName: string, headerValue: string) => void;

  /**
   * update the existing header
   */
  updateHeader: (headerName: string, headerValue: string) => void;

  /**
   * return the header value
   */
  getHeader: (headerName: string) => string;

  /**
   * returns a js object, { [headerName]: headerValue,... }
   */
  getHeaders: () => { [key: string]: string };

  /**
   * remove the header
   */
  removeHeader: (...headerNames: string[]) => void;

  /**
   * set the new query or update the existing query
   */
  addQueryParam: (queryName: string, queryValue: string) => void;

  /**
   * update the existing query
   */
  updateQueryParam: (queryName: string, queryValue: string) => void;

  /**
   * return the query value
   */
  getQueryParam: (queryName: string) => string | undefined;

  /**
   * remove the query
   */
  removeQueryParam: (...queryNames: string[]) => void;

  /**
   * returns a js object, { [queryName]: queryValue,... }
   */
  getQueries: () => { [key: string]: string };
}

interface Response {
  /** response body */
  body: any;

  /** response headers */
  headers: { key: string; value: string }[];

  /** response cookies */
  cookies: any[];

  /** response status code */
  code: number;

  /** response status message */
  status: string;

  /** response time */
  responseTime: number;

  /** response size */
  responseSize: number;

  /** return response body in a text format */
  text: () => string;

  /** return response body in a JSON object */
  json: () => any;

  /** return response body in a JSON object */
  jsonp: () => any;

  /** @deprecated yet to implement, converts response to a dataURI for serialization purpose */
  dataURI: () => string;

  /** return response status reason */
  reason: () => string;

  /** @deprecated yet to implement, get response size object containing body, header and total */
  size: () => { body: number; header: number; total: number };

  to: {
    be: {
      /** status code must be 202 */
      accepted: number;

      /** status code must be 400 */
      badRequest: number;

      /** checks stats code between 400 and 500 */
      clientError: number;

      /** status code should be 403 */
      forbidden: number;

      /** checks status code between 100 and 200*/
      info: number;

      /**status code should be 404 */
      notFound: number;

      /** status code should be 200 */
      ok: number;

      /** status code should be 429 */
      rateLimited: number;

      /** status code should between 299 and 400 */
      redirection: number;

      /** status code should between 499 and 600 */
      serverError: number;

      /** status code should between 199 and 300 */
      success: number;

      /** status code should be 401 */
      unauthorized: number;
    };
    have: {
      /** response should have body */
      body: () => boolean;

      /** response should have header */
      header: (headerKey: string) => boolean;

      /** response should have json body */
      jsonBody: () => boolean;

      /** response should match json schema */
      jsonSchema: (schema: any) => boolean;

      /** response should have status code */
      status: (code: number) => boolean;
    };
  };
}

interface Variables {
  /** get variable */
  get: (key: string) => string | number | boolean;
  /** set variable */
  set: (key: string, value: string) => void;
  /** unset variable */
  unset: (key: string) => void;
  /** clear all variables */
  clear: () => void;
}

type Test = (testName: string, specFun: Function) => void;

interface Firecamp {
  request: Request;
  response: Response;
  /** @deprecated: The cookies method is not implemented yet*/
  cookies: any;
  variables: Variables;
  globals: Variables;
  environment: Variables;
  collectionVariables: Variables;

  test: Test;
  expect: any;
}

declare var fc: Firecamp;

declare var console: any;
