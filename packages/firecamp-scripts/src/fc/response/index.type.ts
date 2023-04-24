/**
 * response.to.be.* assertions
 */
export interface ToBeAssertions {
  /**
   * status code must be 202
   */
  accepted: number;

  /**
   * status code must be 400
   */
  badRequest: number;

  /**
   * checks stats code between 400 and 500
   */
  clientError: number;

  /**
   * status code should be 403
   */
  forbidden: number;

  /**
   * checks status code between 100 and 200
   */
  info: number;

  /**
   * status code should be 404
   */
  notFound: number;

  /**
   * status code should be 200
   */
  ok: number;

  /**
   * status code should be 429
   */
  rateLimited: number;

  /**
   * status code should between 299 and 400
   */
  redirection: number;

  /**
   * status code should between 499 and 600
   */
  serverError: number;

  /**
   * status code should between 199 and 300
   */
  success: number;

  /**
   * status code should be 401
   */
  unauthorized: number;
}

/**
 * response.to.have.* assertions
 */
export interface ToHaveAssertions {
  /**
   * response should have body
   */
  body: () => boolean;

  /**
   * response should have header
   */
  header: (headerKey: string) => boolean;

  /**
   * response should have json body
   */
  jsonBody: () => boolean;

  /**
   * response should match json schema
   */
  jsonSchema: (schema: any) => boolean;

  /**
   * response should have status code
   */
  code: (code: number) => boolean;
}

/**
 * Response assertions
 */
export interface IResponseAssertions {
  to: {
    be: ToBeAssertions;
    have: ToHaveAssertions;
  };
}
