import {
  EFirecampAgent,
  ERestBodyTypes,
  IRest,
  IRestResponse,
  TId,
} from '@firecamp/types';
import RestExecutor from '@firecamp/rest-executor/dist/esm';
import axios from 'axios';
import { _object } from '@firecamp/utils';
import parseBody from '@firecamp/rest-executor/dist/esm/helpers/body';
import * as extension from './chrome';

const restExecutors: { [key: TId]: RestExecutor } = {};

/**
 *
 * @param request REST request which will be sent to the executor
 * @param firecampAgent firecamp agent use to execute API according to it
 * @returns rest request's response
 */
export const send = async (
  request: IRest,
  firecampAgent: EFirecampAgent
): Promise<IRestResponse> => {
  switch (firecampAgent) {
    case EFirecampAgent.desktop:
      return window.fc.restExecutor.send(request);

    case EFirecampAgent.extension:
      return extension.send(request);

    case EFirecampAgent.web:
      restExecutors[request._meta.id] = new RestExecutor();
      return await restExecutors[request._meta.id].send(request);

    case EFirecampAgent.proxy:
      if (!_object.isEmpty(request?.body?.[ERestBodyTypes.FormData])) {
        const data = await parseBody(
          request?.body,
          request.meta.active_body_type
        );
        const response = await axios.post(
          `${process.env.FIRECAMP_PROXY_API_HOST}/api/execute/multipart`,
          data,
          {
            headers: {
              request: JSON.stringify(request),
              'content-type': ERestBodyTypes.FormData,
            },
          }
        );
        return response.data;
      }

      const response = await axios.post(
        `${process.env.FIRECAMP_PROXY_API_HOST}/api/execute`,
        request
      );
      return response.data;
  }
};

/**
 *
 * @param requestID request ID use to tell the executor to which request's execution want to cancel
 * @param firecampAgent firecamp agent use to execute API according to it
 * @returns void
 */
export const cancel = async (
  requestID: TId,
  firecampAgent: EFirecampAgent
): Promise<void> => {
  switch (firecampAgent) {
    case EFirecampAgent.desktop:
      return window.fc.restExecutor.cancel(requestID);
    case EFirecampAgent.extension:
      return extension.cancel(requestID);
    case EFirecampAgent.web:
      restExecutors[requestID].cancel();

      delete restExecutors[requestID];

      return;
    case EFirecampAgent.proxy:
      const response = await axios.get(
        `${process.env.FIRECAMP_PROXY_API_HOST}/api/cancel/${requestID}`
      );

      return response.data;
  }
};
