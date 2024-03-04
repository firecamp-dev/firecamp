import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import HTTPS from 'https';
// import QueryString from 'qs';
import { isNode } from 'browser-or-node';
import * as scriptRunner from '@firecamp/scripts';
import {
  EKeyValueTableRowType,
  ERestBodyTypes,
  IRest,
  IRestResponse,
  IVariableGroup,
} from '@firecamp/types';
import { _env, _array, _object, _table } from '@firecamp/utils';
import __url from '@firecamp/url';
import parseBody from './helpers/body';
import { IRestExecutor, TRestExecutionResponse } from './types';
import axiosTauriApiAdapter from './tauri-adapter';

//@ts-ignore //TODO: research in depth about url esm module, it's import value in console is { default: {...}, __esModule: true }
const _url = __url.default || __url;

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
        get responseTime() {
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

  private _normalizeResponse(res: AxiosResponse): IRestResponse {
    let dataType = typeof res.data;
    let body = '';
    if (dataType == 'string') body = res.data;
    else if (dataType == 'object') body = JSON.stringify(res.data, null, 4);
    else body = res.data;
    return {
      code: res.status,
      status: res.statusText,
      body,
      headers: _table.objectToTable(res.headers || {}),
      // @ts-ignore
      responseTime: res?.config?.metadata?.responseTime || 0,
      responseSize: Number(res?.headers?.['content-length']) || 0,
    };
  }

  /**
   * return axios request config generated from Firecamp REST request
   * @param request: IRest
   */
  private async _prepare(request: IRest): Promise<AxiosRequestConfig> {
    const { body, config, headers, url } = request;
    const nUrl = _url.normalize(url?.raw || '', ['http', 'https']);
    // console.log(nUrl, 777);
    const axiosRequest: AxiosRequestConfig = {
      url: nUrl,
      /**
       * Must be a plain object or a URLSearchParams object
       * NOTE: params that are null or undefined are not rendered in the URL.
       * @note: params will be always there in the raw url, so no need to pass it explicitly here. It's adding duplicate params again which can be cause an error from API servers
       */
      // params: _table.toObject(url?.queryParams || []),
      method: request.method,
      headers: _table.toObject(headers || []),
      // TODO: Supported in browser
      httpsAgent: new HTTPS.Agent({ rejectUnauthorized: false }),
      signal: this._controller.signal,
      timeout: config?.requestTimeout,
      maxRedirects: config?.maxRedirects,
      // transformResponse: (response) => response,
      withCredentials: false,
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
    // console.log(body, 555);
    if (body?.value) {
      // console.log(body, 7777);
      axiosRequest.data = await parseBody(body);
    }
    return axiosRequest;
  }

  async send(
    fcRequest: IRest,
    variables: IVariableGroup
  ): Promise<TRestExecutionResponse> {
    // console.log(fcRequest, variables, 2000000);
    if (_object.isEmpty(fcRequest)) {
      const message: string = 'invalid request payload';
      return Promise.resolve({
        response: {
          body: '',
          code: 0,
          error: {
            message,
            code: 'INVALID REQUEST',
            e: new Error(message),
          },
        },
        variables,
      });
    }

    return scriptRunner
      .preScript(fcRequest, variables)
      .then(({ fc, error }) => {
        // console.log(error.name, error.message);
        const {
          request: _request,
          globals,
          environment,
          collectionVariables,
        } = fc as any;
        // console.log(_request, '..._request');
        if (_request) {
          // merge script updated request with fc request
          // TODO:  we can improve this later
          fcRequest = { ...fcRequest, ..._request };
        }
        // console.log(fc, fcRequest, '__fc pre-request script response');
        const errors: any[] = [];
        if (error) {
          errors.push({
            type: 'pre-request',
            error,
          });
        }
        return {
          fcRequest,
          variables: { globals, environment, collectionVariables },
          errors,
        };
      })
      .then(({ fcRequest, variables, errors }) => {
        // apply variables to request
        // const { globals, environment, collectionVariables } = variables;
        const plainVars = _env.preparePlainVarsFromVariableGroup(variables);
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
            v = _env.applyVariablesInSource(plainVars, row);
            if (v.type == EKeyValueTableRowType.File) {
              v.file = file;
            }
            return v;
          });
          const request = _env.applyVariablesInSource<any>(
            plainVars,
            restRequest
          ) as IRest;
          return {
            request: { ...request, body },
            variables: variables,
            errors,
          };
        } else {
          const request = _env.applyVariablesInSource<any>(
            plainVars,
            fcRequest
          ) as IRest;
          return { request, variables, errors };
        }
      })
      .then(async ({ request, variables, errors }) => {
        const axiosRequest: AxiosRequestConfig = await this._prepare(request);
        try {
          // execute request
          const axiosResponse = await axios({
            /** @ts-ignore */
            // adapter: window?.__TAURI__ ? axiosTauriApiAdapter : null,
            ...axiosRequest,
          });
          // normalize response according to Firecamp REST request's response
          const response = this._normalizeResponse(axiosResponse);

          // prepare timeline of request execution
          response.timeline = this._timeline(axiosRequest, axiosResponse);
          return Promise.resolve({
            response: { ...response },
            variables,
            errors,
          });
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
                  e: isNode ? null : e, //@note: electron can not clone the error object to send over ipc
                },
              },
              variables,
              errors,
            });
          }
          return Promise.resolve({
            response: {
              body: '',
              code: 0,
              error: {
                message: e.message,
                code: e.code,
                e: isNode ? null : e, //@note: electron can not clone the error object to send over ipc
              },
            },
            variables,
            errors,
          });
        }
      })
      .then(async ({ response, variables, errors }) => {
        /** run post-script */
        const { fc, error } = await scriptRunner.testScript(
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
        }
        if (error) {
          errors.push({
            type: 'test',
            error,
          });
        }
        // console.log(errors, 'scriptErrors...');
        return {
          response,
          variables: { globals, environment, collectionVariables },
          testResult,
          scriptErrors: errors,
        };
      });
  }

  cancel() {
    this._controller.abort();
  }
}
