import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import HTTPS from 'https';
import QueryString from 'qs';
import { isNode } from 'browser-or-node';
import {
  EKeyValueTableRowType,
  ERestBodyTypes,
  IRest,
  IRestResponse,
  TRuntimeVariable,
} from '@firecamp/types';
import { _env, _array, _object, _table } from '@firecamp/utils';
import _url from '@firecamp/url';
import parseBody from './helpers/body';
import { IRestExecutor, TResponse } from './types';
import * as scriptRunner from './script-runner';

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
      tl.push('\n-----------   REQUEST DATA   -----------\n');
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
    variables: {
      globals: TRuntimeVariable[];
      environment: TRuntimeVariable[];
      collectionVariables: TRuntimeVariable[];
    }
  ): Promise<TResponse | any> {
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
      .then(({ fc }) => {
        const {
          request: _request,
          globals,
          environment,
          collectionVariables,
        } = fc as any;
        if (environment) {
          // updatedVariables = await normalizeVariables(
          //   {
          //     workspace: variables['workspace'],
          //     collection: variables['collection'],
          //   },
          //   preScriptResponse.environment
          // );
        }

        console.log(_request, '..._request');
        if (_request) {
          // merge script updated request with fc request
          // note: _request will have other methods too like addHeaders, but destructing it will add only it's private properties like body, headers, url
          // TODO:  we can improve this later
          fcRequest = { ...fcRequest, ..._request };
        }
        console.log(fc, fcRequest, '__fc pre-request script response');
        return {
          fcRequest,
          variables: { globals, environment, collectionVariables },
        };
      })
      .then(({ fcRequest, variables }) => {
        // apply variables to request
        const { globals, environment, collectionVariables } = variables;
        const gVars = _env.preparePlainVarsFromRuntimeVariables(globals);
        const eVars = _env.preparePlainVarsFromRuntimeVariables(environment);
        const cVars =
          _env.preparePlainVarsFromRuntimeVariables(collectionVariables);
        const plainVars = { ...gVars, ...eVars, ...cVars };
        // console.log(variables, plainVars, 77777);

        /** if request body is multipart then
         *  1. don't apply vars in whole request, it'll remove file object attached in form
         *  2. instead apply vars in request except thee body
         *  3. and then apply vars in body separately by taking care for file object in form (apply vars in each row)
         */
        if (fcRequest.body?.type == ERestBodyTypes.FormData) {
          const { body, ...restRequest } = fcRequest;
          //@ts-ignore ///TODO: check here to remove the type error
          body.value = body.value.map((v) => {
            const { file, ...row } = v;
            v = _env.applyVariables(row, plainVars);
            if (v.type == EKeyValueTableRowType.File) {
              v.file = file;
            }
            return v;
          });
          const request = _env.applyVariables(restRequest, plainVars) as IRest;
          return { request: { ...request, body }, variables: variables };
        } else {
          const request = _env.applyVariables(fcRequest, plainVars) as IRest;
          return { request, variables };
        }
      })
      .then(async ({ request, variables }) => {
        const axiosRequest: AxiosRequestConfig = await this._prepare(request);
        try {
          // execute request
          const axiosResponse = await axios(axiosRequest);
          // normalize response according to Firecamp REST request's response
          const response = this._normalizeResponse(axiosResponse);
          // prepare timeline of request execution
          response.timeline = this._timeline(axiosRequest, axiosResponse);
          return Promise.resolve({ response: { ...response }, variables });
        } catch (e) {
          console.error(e);
          if (!_object.isEmpty(e.response)) {
            const response = this._normalizeResponse(e.response);
            if (!e.response?.config && e.config) e.response.config = e.config;
            // prepare timeline of request execution
            response.timeline = this._timeline(axiosRequest, e.response);
            return Promise.resolve({
              response: {
                ...response,
                error: {
                  message: e.message,
                  code: e.code,
                  e,
                },
              },
              variables,
            });
          }
          return Promise.resolve({
            response: {
              statusCode: 0,
              error: {
                message: e.message,
                code: e.code,
                e,
              },
            },
            variables,
          });
        }
      })
      .then(async ({ response, variables }) => {
        /** run post-script */
        // TODO: add inherit support
        const { fc } = await scriptRunner.testScript(
          fcRequest,
          response,
          variables
        );
        const {
          response: _response = {},
          globals,
          environment,
          collectionVariables,
          testResult,
        } = fc as any;
        // merge post script response with actual response
        if (fc?.response) {
          response = { ...response, ..._response };

          // console.log({ postScriptResponse });
          // if (postScriptResponse.environment) {
          //   updatedVariables = await normalizeVariables(
          //     updatedVariables,
          //     postScriptResponse.environment
          //   );
          // }
        }
        return {
          response,
          variables: { globals, environment, collectionVariables },
          testResult,
        };
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
