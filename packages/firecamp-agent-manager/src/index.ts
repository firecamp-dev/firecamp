import axios from 'axios';
import {
  TId,
  EFirecampAgent,
  ERestBodyTypes,
  IRest,
  IRestResponse,
  IVariableGroup,
} from '@firecamp/types';
import RestExecutor from '@firecamp/rest-executor';
import parseBody from '@firecamp/rest-executor/dist/helpers/body';
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
  variables: IVariableGroup,
  firecampAgent: EFirecampAgent
): Promise<{
  response: IRestResponse;
  variables: IVariableGroup;
  testResult: any;
  scriptErrors: any[];
}> => {
  const requestId = request.__ref.id;
  let res: any;
  switch (firecampAgent) {
    case EFirecampAgent.Desktop:
      //@ts-ignore
      return await window.__electron__.http.send(request, variables);
    case EFirecampAgent.Extension:
    case EFirecampAgent.Web:
      restExecutors[request.__ref.id] = new RestExecutor();
      //@ts-ignore
      res = restExecutors[request.__ref.id].send(request, variables);
      delete restExecutors[requestId];
      return res;
    case EFirecampAgent.Cloud:
      if (request.body?.type == ERestBodyTypes.FormData) {
        const body = await parseBody(request.body);
        const response = await axios.post(
          `${process.env.FIRECAMP_CLOUD_AGENT}/api/execute/multipart`,
          body,
          {
            headers: {
              request: JSON.stringify(request),
              variables: JSON.stringify(variables),
              'content-type': ERestBodyTypes.FormData,
            },
          }
        );
        return response.data;
      } else {
        const response = await axios.post(
          `${process.env.FIRECAMP_CLOUD_AGENT}/api/execute`,
          { request, variables }
        );
        return response.data;
      }
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
      /** @ts-ignore */
      return window.__electron__.http.stop(requestId);
    // case EFirecampAgent.Extension:
    //   return extension.cancel(requestId);
    case EFirecampAgent.Web:
      restExecutors[requestId].cancel();
      delete restExecutors[requestId];
      return;
    case EFirecampAgent.Cloud:
      const response = await axios.get(
        `${process.env.FIRECAMP_CLOUD_AGENT}/api/cancel/${requestId}`
      );

      return response.data;
  }
};

export const pingExtension = (): Promise<string> => {
  return extension.ping();
};
