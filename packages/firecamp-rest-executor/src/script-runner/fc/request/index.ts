import chai from 'chai';
import { EHttpMethod, IHeader, IRest, IRestBody, IUrl, TPlainObject } from '@firecamp/types';
import { _array } from '@firecamp/utils';
import { IScriptRequest } from './index.type';

/** request script */
export class Request implements IScriptRequest {
  url: IUrl = { raw: '', pathParams: [], queryParams: [] };
  headers: IHeader[] = [];
  method: EHttpMethod | string;
  body?: IRestBody;

  constructor(request: IRest) {
    this.url = { ...this.url, ...request.url };
    this.headers = request.headers || [];
    this.method = request.method || EHttpMethod.GET;
    this.body = request?.body;
  }

  to = {
    get() {
      return chai.expect(this).to;
    },
  };

  addHeader(headerName: string, headerValue: string): void {
    this.headers.push({
      key: headerName,
      value: headerValue,
    });
  }
  updateHeader(headerName: string, headerValue: string): void {
    const index = this.headers.findIndex((header) => header.key === headerName);

    if (index !== -1) {
      this.headers[index] = { key: headerName, value: headerValue };
    }
  }
  getHeader(headerName: string): string {
    const h = this.headers.find((header) => header.key === headerName);
    return h?.value || 'Ô';
  }
  getHeaders(): TPlainObject {
    return this.headers.reduce<any>((headers, item) => {
      headers[item.key] = item.value;
      return headers;
    }, {});
  }
  removeHeader(...headerNames: string[]): void {
    this.headers = this.headers.filter(
      (header) => !headerNames.includes(header.key)
    );
  }
  addQueryParam(queryName: string, queryValue: string): void {
    if (!Array.isArray(this.url.queryParams)) return;
    this.url.queryParams.push({
      key: queryName,
      value: queryValue,
    });
  }
  updateQueryParam(queryName: string, queryValue: string): void {
    if (!Array.isArray(this.url.queryParams)) return;

    const index = this.url.queryParams.findIndex(
      (query) => query.key === queryName
    );

    if (index !== -1) {
      this.headers[index] = { key: queryName, value: queryValue };
    }
  }
  getQueryParam(queryName: string): string | undefined {
    if (!Array.isArray(this.url.queryParams)) return undefined;
    const q = this.url.queryParams.find((query) => query.key === queryName);
    return q?.value || '';
  }
  removeQueryParam(...queryNames: string[]): void {
    this.url.queryParams = this.headers.filter(
      (query) => !queryNames.includes(query.key)
    );
  }
  getQueries(): { [key: string]: string } {
    if (!Array.isArray(this.url.queryParams)) return {};

    return this.url.queryParams.reduce<any>((queryParams, item) => {
      queryParams[item?.key] = item.value;
      return queryParams;
    }, {});
  }

  toJSON() {
    return {
      url: this.url,
      headers: this.headers,
      method: this.method,
      body: this.body,
    };
  }
}

/**
 * pm compatible fc script request
 *  console.log('----- REQUEST -----')
console.log('1. body', fc.request.body)
console.log('2. certificate', fc.request.certificate)
console.log('3. clone', fc.request.clone())
console.log('4. describe', fc.request.describe())
console.log('5. disabled', fc.request.disabled)
console.log('6. findInParents', fc.request.findInParents)
console.log('7. findSubstitutions', fc.request.findSubstitutions)
console.log('8. forEachHeader', fc.request.forEachHeader)
console.log('9. forEachParent', fc.request.forEachParent)
console.log('10. getHeaders', fc.request.getHeaders())
console.log('11. headers', fc.request.headers)
console.log('12. id', fc.request.id)
console.log('13. meta', fc.request.meta())
console.log('14. method', fc.request.method)
console.log('15. name', fc.request.name)
console.log('16. parent()', fc.request.parent())
console.log('17. proxy', fc.request.proxy)
console.log('18. removeHeader()', fc.request.removeHeader)
console.log('19. removeQueryParams()', fc.request.removeQueryParams)
console.log('20. size()', fc.request.size())
console.log('21. toJSON()', fc.request.toJSON())
console.log('22. update()', fc.request.update)
console.log('23. upsertHeader()', fc.request.upsertHeader)
console.log('24. url', fc.request.url)
 */
