import { Body, ResponseType as TauriResponseType } from '@tauri-apps/api/http';
import {
  AxiosBasicCredentials,
  ResponseType as AxiosResponseType,
} from 'axios';
import { buildUrl, IQueryParams } from 'build-url-ts';
import URLParse from 'url-parse';
import { IAuthorization, ITauriAxiosRequestConfig } from './type';

export const base64Decode = (str: string): string =>
  Buffer.from(str, 'base64').toString('binary');
export const base64Encode = (str: string): string =>
  Buffer.from(str, 'binary').toString('base64');

export function buildBasicAuthorization(
  basicCredentials: AxiosBasicCredentials
): IAuthorization {
  const username = basicCredentials.username || '';
  const password = basicCredentials.password
    ? encodeURIComponent(basicCredentials.password)
    : '';
  return {
    Authorization: `Basic ${base64Encode(`${username}:${password}`)}`,
  };
}

export function buildJWTAuthorization(jwt: string): IAuthorization {
  return {
    Authorization: `Bearer ${jwt}`,
  };
}

export function getTauriResponseType(
  type?: AxiosResponseType
): TauriResponseType {
  let responseType = TauriResponseType.JSON;
  if (type !== undefined && type !== null) {
    switch (type.toLowerCase()) {
      case 'json': {
        responseType = TauriResponseType.JSON;
        break;
      }
      case 'text': {
        responseType = TauriResponseType.Text;
        break;
      }
      default: {
        responseType = TauriResponseType.Binary;
      }
    }
  }
  return responseType;
}

export function buildTauriRequestData(data?: any): Body | undefined {
  if (data === undefined || data === null) {
    return undefined;
  }
  if (typeof data === 'string') {
    return Body.text(data);
  } else if (typeof data === 'object') {
    return Body.json(data);
  } else if (data instanceof FormData) {
    // @ts-ignore
    return Body.form(data);
  }
  return Body.bytes(data);
}

export const buildRequestUrl = (
  config: Omit<ITauriAxiosRequestConfig, 'headers'>
): string => {
  if (
    (config.baseURL === undefined ||
      config.baseURL === null ||
      config.baseURL.trim() === '') &&
    (config.url === undefined ||
      config.url === null ||
      config.url.trim() === '')
  ) {
    throw new Error('config.baseURL or config.url must be specified');
  }
  if (config.baseURL) {
    return buildUrl(config.baseURL, {
      path: config.url,
      queryParams: config.params,
    });
  }
  const url = config.url ? config.url : '';
  let urlObj = URLParse(url, true);
  const path = urlObj.pathname === '/' ? undefined : urlObj.pathname;
  const params = urlObj.query;
  urlObj.set('pathname', '');
  urlObj.set('query', '');
  return buildUrl(urlObj.toString(), {
    path: path,
    queryParams: mergeQueryParams(params, config.params),
  });
};

export function mergeQueryParams(
  ...queryParams: IQueryParams[]
): IQueryParams | undefined {
  let params: IQueryParams = {};
  queryParams.forEach((qp) => Object.assign(params, qp));
  return Object.keys(params).length === 0 ? undefined : params;
}
