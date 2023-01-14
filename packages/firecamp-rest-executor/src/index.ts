import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import HTTPS from 'https';
import QueryString from 'qs';
import { isNode } from 'browser-or-node';
import { IRest, IRestResponse } from '@firecamp/types';
import { _env, _array, _object, _table } from '@firecamp/utils';
import _url from '@firecamp/url';

import parseBody from './helpers/body';
import { IRestExecutor, TResponse } from './types';
import * as scriptRunner from './script-runner';
import { TEnvVariable } from './script-runner';

export default class RestExecutor implements IRestExecutor {
  private _controller: AbortController;

  constructor() {
    this._controller = new AbortController();
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
  }

  private _timeline(
    request: AxiosRequestConfig,
    response: AxiosResponse
  ): string {
    const tl: string[] = [];

    /** return the key:value string */
    const objectToText = (object = {}, prefix: string) =>
      Object.keys(object).reduce(
        (prev, key) => `${prev + prefix + ' ' + key}:${object[key]}\n`,
        ''
      );

    const { status, statusText, config, headers } = response;

    tl.push('\n-----------   GENERAL  -----------\n');
    tl.push(`# Request URL:  ${config.url}`);
    tl.push(`# Request Method: ${config.method}`);
    tl.push(`# Status Code: ${status} ${statusText}`);

    if (!_object.isEmpty(request.headers || {})) {
      tl.push('\n-----------   REQUEST HEADERS   -----------\n');
      tl.push(objectToText(request.headers, '>'));
    }

    if (typeof config.data === 'string') {
      tl.push('\n-----------Request Data-----------\n');
      tl.push(`> ${config.data}`);
    }

    tl.push(`\n-----------   RESPONSE HEADERS   -----------\n`);
    tl.push(objectToText(headers, '<'));

    if (typeof response.data === 'string') {
      tl.push('\n-----------   RESPONSE DATA   -----------\n');
      tl.push(`> ${response.data}`);
    }
    return tl.join('\n');
  }

  private _normalizeResponse(axiosResponse: AxiosResponse): IRestResponse {
    return {
      statusCode: axiosResponse.status,
      statusMessage: axiosResponse.statusText,
      data: axiosResponse.data,
      headers: axiosResponse.headers || {},
      //@ts-ignore
      duration: axiosResponse?.config?.metadata?.duration || 0,
      size: Number(axiosResponse?.headers?.['content-length']) || 0,
    };
  }

  /**
   * return axios request config generated from Firecamp REST request
   * @param request: IRest
   */
  private async _prepare(request: IRest): Promise<AxiosRequestConfig> {
    const { body, config, headers, url } = request;

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
    if (body?.value) {
      axiosRequest.data = await parseBody(body);
    }
    return axiosRequest;
  }

  async send(
    fcRequest: IRest,
    variables: TEnvVariable = {}
  ): Promise<TResponse> {
    console.log(fcRequest, variables, 2000000);
    if (_object.isEmpty(fcRequest)) {
      const message: string = 'invalid request payload';
      return Promise.resolve({
        statusCode: 0,
        error: {
          message,
          code: 'INVALID REQUEST',
          e: new Error(message),
        },
      });
    }

    /** run pre script */
    // TODO: Inherit script
    return scriptRunner
      .preScript(fcRequest, variables)
      .then((res) => {
        const { request: reqInstance, environment } = res as any;
        if (environment) {
          // updatedVariables = await normalizeVariables(
          //   {
          //     workspace: variables['workspace'],
          //     collection: variables['collection'],
          //   },
          //   preScriptResponse.environment
          // );
        }
        if (reqInstance) {
          // Merge script updated request with fc request
          // note: reqInstance will have other methods too like addHeaders, but desctucting it will add only it's private properties like body, headers, url
          // TODO:  we can improve this later
          fcRequest = { ...fcRequest, ...reqInstance };
        }
        console.log(res, fcRequest, '_____789458');
        return { fcRequest };
      })
      .then(({ fcRequest }) => {
        // apply variables to request
        console.log(variables, 77777);
        const request = _env.applyVariables(fcRequest, variables) as IRest;
        return request;
      })
      .then(async (request) => {
        const axiosRequest: AxiosRequestConfig = await this._prepare(request);
        try {
          // execute request
          const axiosResponse = await axios(axiosRequest);
          // normalize response according to Firecamp REST request's response
          const response = this._normalizeResponse(axiosResponse);
          // prepare timeline of request execution
          response.timeline = this._timeline(axiosRequest, axiosResponse);
          return Promise.resolve({ ...response });
        } catch (e) {
          console.error(e);
          if (!_object.isEmpty(e.response)) {
            const response = this._normalizeResponse(e.response);
            if (!e.response?.config && e.config) e.response.config = e.config;
            // prepare timeline of request execution
            response.timeline = this._timeline(axiosRequest, e.response);
            return Promise.resolve({
              ...response,
              error: {
                message: e.message,
                code: e.code,
                e,
              },
            });
          }
          return Promise.resolve({
            statutsCode: 0,
            error: {
              message: e.message,
              code: e.code,
              e,
            },
          });
        }
      })
      .then(async (response) => {
        /** run post-script */
        // TODO: add inherit support
        let postScriptRes = await scriptRunner.postScript(
          fcRequest.scripts?.post as string,
          response,
          {}
        );
        // merge post script response with actual response
        if (postScriptRes?.response) {
          response = { ...response, ...postScriptRes.response };

          // console.log({ postScriptResponse });
          // if (postScriptResponse.environment) {
          //   updatedVariables = await normalizeVariables(
          //     updatedVariables,
          //     postScriptResponse.environment
          //   );
          // }
        }
        return response;
      });
    // .then(() => {
    //   try {
    //     /** run test-script */
    //     // TODO: add inherit support
    //     testScriptResponse = await scriptRunner.testScript(request, response, vars)
    //     );
    //     if (testScriptResponse) {
    //       response['testScriptResult'] = testScriptResponse;
    //     }
    //   } catch (error) {}
    // });
  }

  cancel() {
    this._controller.abort();
  }
}
