// @ts-nocheck
import { getIntrospectionQuery } from 'graphql';

import {
  BodyParser,
  ConfigGenerator as _ConfigGenerator,
} from '@firecamp/rest/src/services';

const configGenerator = new _ConfigGenerator();
const bodyParser = new BodyParser();

export default class ConfigGenerator {
  /**
   * Prepare the introspection query
   * @param url
   * @param method
   * @param extraHeaders
   * @param variables
   * @returns {undefined|*}
   */
  fetchSchema({ url, pathParams, method, headers = [] }, variables) {
    if (!url || !method) return;

    const config = {
      url,
      pathParams,
      method,
      headers: [
        {
          key: 'Accept',
          value: 'application/json',
          description: '',
          disable: false,
          type: '',
        },
        {
          key: 'Content-Type',
          value: 'application/json',
          description: '',
          disable: false,
          type: '',
        },
        ...headers,
      ],
      body: {
        type: 'application/json',
        'application/json': {
          type: 'application/json',
          value: JSON.stringify({ query: getIntrospectionQuery() }),
        },
      },
      withCredentials: false,
      config: {
        ORIGIN: '',
        USERAGENT: '',
        TIMEOUT_MS: 0,
        REJECT_UNAUTHORIZED: false,
        FOLLOWLOCATION: true,
        MAXREDIRS: -1,
        HTTP_VERSION: 'V2Tls',
      },
    };

    const httpRequestData = configGenerator.prepareRequest(config, variables);

    // TODO: Remove in graphql v2
    // if (httpRequestData && httpRequestData.config && isElectron())
    //   httpRequestData.config.REJECT_UNAUTHORIZED = false;

    return httpRequestData;
  }

  prepareRequest(config, variables) {
    const httpRequestData = configGenerator.prepareRequest(config, variables);

    // TODO: Remove in graphql v2
    // if (httpRequestData && httpRequestData.config && isElectron())
    //   httpRequestData.config.REJECT_UNAUTHORIZED = false;

    // TODO: remove this while headers in gql set as per query
    if (httpRequestData.isFile) {
      if (httpRequestData.headers) {
        if (httpRequestData.headers['content-type']) {
          httpRequestData.headers['content-type'] = 'multipart/form-data';
        } else if (httpRequestData.headers['Content-Type']) {
          httpRequestData.headers['Content-Type'] = 'multipart/form-data';
        }
      }
    }

    return httpRequestData;
  }

  prepareResponse(response = {}) {
    response.data = bodyParser.parseResponseBody(response.data);

    return {
      data: response.data || '',
      duration: response.duration || 0,
      size: response.size || '',
      status: response.status || 0,
      headers: response.headers || {},
      cookies: response.cookies || [],
      error: response.error || '',
      timeline: response.timeline || '',
    };
  }
}
