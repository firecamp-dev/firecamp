/// <reference path="../node_modules/@types/chrome/index.d.ts"/>

import { EFirecampAgent, IRest, IRestResponse, TId } from '@firecamp/types';
import { _misc } from '@firecamp/utils';
import RestExecutor from '@firecamp/rest-executor/dist/esm';

// Holds the rest executors instance to handle
const restExecutors: { [key: TId]: RestExecutor } = {};

// Request operations to handle
enum ERequestOperation {
  Send = 'send',
  Cancel = 'cancel',
}

/**
 * Send the REST request to execute to the extension via
 * message passing API
 *
 * #reference https://developer.chrome.com/docs/extensions/mv3/messaging/#external-webpage
 * @returns returns the Rest request execution response
 */
export const send = (request: IRest): Promise<IRestResponse> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      process.env.CHROME_APP_ID,
      {
        requestOperation: ERequestOperation.Send,
        request,
        requestID: request._meta.id,
      },
      (response) => {
        // Reject if found any error in message passing
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError.message);

        resolve(response);
      }
    );
  });
};

/**
 * Register the chrome message listener, which handles REST request send and cancel operation
 */
if (_misc.firecampAgent() === EFirecampAgent.web) {
  chrome?.runtime?.onMessageExternal?.addListener(async function (
    {
      requestOperation,
      request,
      requestID,
    }: {
      requestOperation: ERequestOperation;
      request: IRest;
      requestID: TId;
    },
    sender,
    sendResponse
  ) {
    try {
      switch (requestOperation) {
        case ERequestOperation.Send:
          restExecutors[request._meta.id] = new RestExecutor();

          const response = await restExecutors[request._meta.id].send(request);

          delete restExecutors[requestID];

          sendResponse(response);

          break;

        case ERequestOperation.Cancel:
          restExecutors[requestID].cancel();

          break;
      }
    } catch (error) {
      sendResponse(error);
    }
  });
}

/**
 * Stop running Rest request
 *
 * @param requestId
 * @returns request running status
 */
export const cancel = async (requestID: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      process.env.CHROME_APP_ID,
      {
        requestOperation: ERequestOperation.Cancel,
        requestID,
      },
      (response) => {
        // Reject if found any error in message passing
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError.message);

        delete restExecutors[requestID];

        resolve(response);
      }
    );
  });
};
