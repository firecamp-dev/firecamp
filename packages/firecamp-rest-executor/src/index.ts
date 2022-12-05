import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import HTTPS from 'https';
import QueryString from 'qs';
import { isNode } from 'browser-or-node';
import { ERestBodyTypes, IRest, IRestResponse } from '@firecamp/types';
import { _array, _object, _table } from '@firecamp/utils';
import _url from '@firecamp/url';

import parseBody from './helpers/body';
import { IRestExecutor } from './types';
export * from './script-runner';

export default class RestExecutor implements IRestExecutor {
  private _controller: AbortController;

  constructor() {
    this._controller = new AbortController();
  }

  private _timeline(
    request: AxiosRequestConfig,
    response: AxiosResponse
  ): string {
    const tl: string[] = [];

    /**
     * Return the key:value string
     * @param object
     * @param prefix
     * @returns
     */
    const objectToText = (object = {}, prefix: string) =>
      Object.keys(object).reduce(
        (prev, key) => `${prev + prefix + ' ' + key}:${object[key]}\n`,
        ''
      );

    const { status, statusText, config, headers } = response;

    tl.push('\n----------------General----------------\n');
    tl.push(`# Request URL:  ${config.url}`);
    tl.push(`# Request Method: ${config.method}`);
    tl.push(`# Status Code: ${status} ${statusText}`);

    if (!_object.isEmpty(request.headers || {})) {
      tl.push('\n-----------Request Headers-----------\n');
      tl.push(objectToText(request.headers, '>'));
    }

    if (typeof config.data === 'string') {
      tl.push('\n-----------Request Data-----------\n');
      tl.push(`> ${config.data}`);
    }

    tl.push(`\n-----------Response Headers-----------\n`);
    tl.push(objectToText(headers, '<'));

    if (typeof response.data === 'string') {
      tl.push('\n-----------Response Data-----------\n');
      tl.push(`> ${response.data}`);
    }

    return tl.join('\n');
  }

  private _normalizeResponse(axiosResponse: AxiosResponse): IRestResponse {
    return {
      statusCode: axiosResponse.status,
      statusMessage: axiosResponse.statusText,
      data: axiosResponse.data,
      headers: axiosResponse.headers,
      //@ts-ignore
      duration: axiosResponse?.config?.metadata?.duration || 0,
      size: Number(axiosResponse?.headers?.['content-length']) || 0,
    };
  }

  /**
   * Return axios request config generated from Firecamp REST request
   * @param request: IRest
   */
  private async _prepare(request: IRest): Promise<AxiosRequestConfig> {
    const { __meta, body, config, headers, url } = request;

    const axiosRequest: AxiosRequestConfig = {
      url: _url.normalize(url?.raw || '', ['http', 'https']),
      params: QueryString.stringify(_table.toObject(url?.queryParams || [])),
      method: request.method,
      headers: _table.toObject(headers || []),
      // TODO: Supported in browser
      httpsAgent: new HTTPS.Agent({ rejectUnauthorized: false }),
      signal: this._controller.signal,
      timeout: config?.requestTimeout,
      maxRedirects: config?.maxRedirects,
      transformResponse: (response) => response,
    };

    // disable SSL validation default
    if (isNode) {
      axiosRequest.httpsAgent = new HTTPS.Agent({
        rejectUnauthorized: config?.rejectUnauthorized,
      });
    }

    // parse path params
    if (!_array.isEmpty(url?.pathParams as any))
      axiosRequest.url = _url.replacePathParams(
        url?.raw || '',
        url?.pathParams || []
      );

    // TODO: Check sending file without serialize in desktop environment
    // parse body payload
    axiosRequest.data = await parseBody(
      body || {},
      __meta.activeBodyType || ERestBodyTypes.NoBody
    );

    return axiosRequest;
  }

  async send(request: IRest): Promise<IRestResponse> {
    let axiosRequest: AxiosRequestConfig = {};

    try {
      if (_object.isEmpty(request))
        return Promise.reject(new Error('Invalid request payload'));

      axiosRequest = await this._prepare(request);

      // note the request start time
      axios.interceptors.request.use((request) => {
        request['metadata'] = {
          startTime: new Date(),
        };
        return request;
      });

      // note the request finished time
      axios.interceptors.response.use((res) => {
        res.config['metadata']['endTime'] = new Date();
        res.config['metadata'] = {
          ...res.config['metadata'],
          get duration() {
            return this.endTime - this.startTime;
          },
        };
        return res;
      });

      // execute request
      const axiosResponse = await axios(axiosRequest);

      // normalize response according to Firecamp REST request's response
      const response = this._normalizeResponse(axiosResponse);

      // prepare timeline of request execution
      response['timeline'] = this._timeline(axiosRequest, axiosResponse);

      return Promise.resolve(response);
    } catch (error) {
      console.error(error);
      if (!_object.isEmpty(error.response)) {
        const response = this._normalizeResponse(error.response);

        if (!error?.response?.config && error?.config) {
          error.response.config = error.config;
        }

        // prepare timeline of request execution
        response['timeline'] = this._timeline(axiosRequest, error.response);

        return Promise.reject(response);
      }
      return Promise.reject(error.message);
    }
  }

  cancel() {
    this._controller.abort();
  }
}
