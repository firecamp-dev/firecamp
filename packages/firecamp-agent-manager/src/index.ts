import axios from 'axios';
import {
  TId,
  EFirecampAgent,
  ERestBodyTypes,
  IRest,
  IRestResponse,
  IVariableGroup,
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
  variables: IVariableGroup,
  firecampAgent: EFirecampAgent
): Promise<{
  response: IRestResponse;
  variables: IVariableGroup;
  testResult: any;
  scriptErrors: any[];
}> => {
  switch (firecampAgent) {
    case EFirecampAgent.Desktop:
      return window.fc.restExecutor.send(request, variables);
    case EFirecampAgent.Extension:
      return extension.send(request, variables);
    case EFirecampAgent.Web:
      restExecutors[request.__ref.id] = new RestExecutor();
      //@ts-ignore
      return await restExecutors[request.__ref.id].send(request, variables);
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
      return window.fc.restExecutor.cancel(requestId);
    case EFirecampAgent.Extension:
      return extension.cancel(requestId);
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
