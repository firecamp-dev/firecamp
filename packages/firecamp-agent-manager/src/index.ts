import axios from 'axios';
import {
  EFirecampAgent,
  ERestBodyTypes,
  IRest,
  IRestResponse,
  TId,
} from '@firecamp/types';
import RestExecutor from '@firecamp/rest-executor/dist/esm';
import parseBody from '@firecamp/rest-executor/dist/esm/helpers/body';
import { _object } from '@firecamp/utils';
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
  vars: { [k: string]: any },
  firecampAgent: EFirecampAgent
): Promise<IRestResponse> => {
  switch (firecampAgent) {
    case EFirecampAgent.Desktop:
      return window.fc.restExecutor.send(request);

    case EFirecampAgent.Extension:
      return extension.send(request);

    case EFirecampAgent.Web:
      restExecutors[request.__ref.id] = new RestExecutor();
      return await restExecutors[request.__ref.id].send(request, vars);

    case EFirecampAgent.Cloud:
      if (!_object.isEmpty(request?.body?.[ERestBodyTypes.FormData])) {
        const data = await parseBody(request?.body);
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
 * @param requestId request ID use to tell the executor to which request's execution want to cancel
 * @param firecampAgent firecamp agent use to execute API according to it
 * @returns void
 */
export const cancel = async (
  requestId: TId,
  firecampAgent: EFirecampAgent
): Promise<void> => {
  switch (firecampAgent) {
    case EFirecampAgent.Desktop:
      return window.fc.restExecutor.cancel(requestId);
    case EFirecampAgent.Extension:
      return extension.cancel(requestId);
    case EFirecampAgent.Web:
      restExecutors[requestId].cancel();

      delete restExecutors[requestId];

      return;
    case EFirecampAgent.Cloud:
      const response = await axios.get(
        `${process.env.FIRECAMP_PROXY_API_HOST}/api/cancel/${requestId}`
      );

      return response.data;
  }
};

export const pingExtension = (): Promise<string> => {
  return extension.ping();
};
