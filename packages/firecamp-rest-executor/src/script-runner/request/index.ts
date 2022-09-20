import { EHttpMethod, IHeader, IRest, IRestBody, IUrl } from '@firecamp/types';
import { _array } from '@firecamp/utils';
import { IScriptRequest } from '../types';

/**
 * request script
 */
export class Request implements IScriptRequest {
  url: IUrl = { raw: '', path_params: [], query_params: [] };
  headers: IHeader[] = [];
  method: EHttpMethod | string;
  body: IRestBody;

  constructor(request: IRest) {
    this.url = { ...this.url, ...request.url };
    this.headers = request.headers || [];
    this.method = request.method || EHttpMethod.GET;
    this.body = request.body || {};
  }

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
    return this.headers.find((header) => header.key === headerName)?.[0]?.value;
  }
  getHeaders(): { [key: string]: string } {
    return this.headers.reduce((headers, item) => {
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
    if (!Array.isArray(this.url.query_params)) return;

    this.url.query_params.push({
      key: queryName,
      value: queryValue,
    });
  }
  updateQueryParam(queryName: string, queryValue: string): void {
    if (!Array.isArray(this.url.query_params)) return;

    const index = this.url.query_params.findIndex(
      (query) => query.key === queryName
    );

    if (index !== -1) {
      this.headers[index] = { key: queryName, value: queryValue };
    }
  }
  getQueryParam(queryName: string): string | undefined {
    if (!Array.isArray(this.url.query_params)) return undefined;

    return this.url.query_params.find((query) => query.key === queryName)?.[0]
      ?.value;
  }
  removeQueryParam(...queryNames: string[]): void {
    this.url.query_params = this.headers.filter(
      (query) => !queryNames.includes(query.key)
    );
  }
  getQueries(): { [key: string]: string } {
    if (!Array.isArray(this.url.query_params)) return {};

    return this.url.query_params.reduce((queryParams, item) => {
      queryParams[item.key] = item.value;
      return queryParams;
    }, {});
  }
}
