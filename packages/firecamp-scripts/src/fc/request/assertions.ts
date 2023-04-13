import { ERestBodyTypes, EHttpMethod, IUrl } from '@firecamp/types';
import { _array, _object, _string } from '@firecamp/utils';

export default function (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) {
  const Assertion = chai.Assertion;

  utils.addMethod(
    Assertion.prototype,
    'url',
    function (this: Chai.AssertionStatic, url: IUrl) {
      this.assert(
        !_object.isEmpty(this._obj?.url) || !_string.isEmpty(this._obj.url.raw),
        `expected request URL to be ${url.raw} but found ${this._obj?.url?.raw}`,
        `expected request URL not to be ${url.raw}`,
        url?.raw,
        this._obj?.url?.raw
      );
    }
  );

  utils.addMethod(
    Assertion.prototype,
    'method',
    function (this: Chai.AssertionStatic, method: EHttpMethod) {
      this.assert(
        !_string.isEmpty(this._obj.method),
        `expected request method to be ${method} but found ${this._obj?.method}`,
        `expected request method not to be ${method}`,
        method,
        this._obj?.method
      );
    }
  );

  utils.addMethod(
    Assertion.prototype,
    'query',
    function (this: Chai.AssertionStatic, queryName: string) {
      this.assert(
        !_array.isEmpty(this._obj?.url?.queryParams) &&
          this._obj?.url?.queryParams?.find((query) => query.key === queryName),
        `expecting request should have query ${queryName} but not found`,
        `expecting request should not have query ${queryName}`,
        queryName,
        this._obj?.url?.queryParams
      );
    }
  );

  utils.addMethod(
    Assertion.prototype,
    'header',
    function (this: Chai.AssertionStatic, headerName: string) {
      this.assert(
        !_array.isEmpty(this._obj?.headers) &&
          this._obj.headers?.find((header) => header.key === headerName),
        `expecting request should have header ${headerName} but not found`,
        `expecting request should not have header ${headerName}`,
        headerName,
        this._obj?.headers
      );
    }
  );

  utils.addMethod(
    Assertion.prototype,
    'body',
    function (this: Chai.AssertionStatic, contentType: ERestBodyTypes) {
      if (_string.isEmpty(contentType)) {
        this.assert(
          this._obj?.body?.[contentType],
          `expecting request should have body ${contentType} but not found`,
          `expecting request should not have body ${contentType}`,
          contentType,
          this._obj?.body
        );
      } else
        this.assert(
          !_object.isEmpty(this._obj.body),
          `expecting request should have body but not found`,
          `expecting request should not have body`,
          this._obj?.body
        );
    }
  );
}
