/// <reference path="../node_modules/@types/chrome/index.d.ts"/>

import { IRest, IRestResponse, TId } from '@firecamp/types';
import { _misc } from '@firecamp/utils';
import RestExecutor from '@firecamp/rest-executor';

// Holds the rest executors instance to handle
const restExecutors: { [key: TId]: RestExecutor } = {};

// Request operations to handle
enum EReqEvent {
  Send = 'send',
  Cancel = 'cancel',
}

type ExtResponse = {
  error: any;
  response: IRestResponse;
  variables: any;
  testResult: any;
  scriptErrors: any[];
};

/**
 * Send the REST request to execute to the extension via
 * message passing API
 *
 * #reference https://developer.chrome.com/docs/extensions/mv3/messaging/#external-webpage
 * @returns returns the Rest request execution response
 */
export const send = (
  request: IRest,
  variables: any
): Promise<{
  response: IRestResponse;
  variables: any;
  testResult: any;
  scriptErrors: any[];
}> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      process.env.FIRECAMP_EXTENSION_AGENT_ID,
      {
        requestOperation: EReqEvent.Send,
        request,
        requestId: request.__ref.id,
      },
      (result: ExtResponse) => {
        if (result?.response)
          return resolve({
            response: result.response,
            variables: result.variables,
            scriptErrors: result.scriptErrors,
            testResult: result.testResult,
          });
        if (result?.error) return reject(result.error);

        // reject if found any error in message passing
        // console.log(chrome.runtime.lastError) // { message: ""}
        if (chrome.runtime.lastError)
          return reject(chrome.runtime.lastError.message);
        return;
      }
    );
  });
};

export const ping = (ping: string = 'ping'): Promise<string> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      process.env.FIRECAMP_EXTENSION_AGENT_ID,
      ping,
      (pong: string) => {
        if (pong === 'pong') return resolve(pong);
        // reject if found any error in message passing
        if (chrome.runtime.lastError)
          return reject(chrome.runtime.lastError.message);
        return reject('pong not received');
      }
    );
  });
};

/**
 * Stop running Rest request
 *
 * @param requestId
 * @returns request running status
 */
export const cancel = async (requestId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      process.env.FIRECAMP_EXTENSION_AGENT_ID,
      {
        requestOperation: EReqEvent.Cancel,
        requestId,
      },
      (result) => {
        // Reject if found any error in message passing
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError.message);
        delete restExecutors[requestId];
        resolve(result);
      }
    );
  });
};
