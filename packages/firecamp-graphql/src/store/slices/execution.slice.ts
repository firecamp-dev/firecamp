import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import {
  ERequestTypes,
  ERestBodyTypes,
  IRest,
  IRestResponse,
} from '@firecamp/types';
import { _clipboard } from '@firecamp/utils';
import { _object } from '@firecamp/utils';
import { TStoreSlice } from '../store.type';

interface IExecutionSlice {
  /**
   * return final request for execution,
   *
   * the request will be generated based on the configuration with parent artifacts,
   * here the auth, preScripts & postScripts might get manipulated by the parent artifacts at the time of execution
   */
  prepareRequestForExecution: (query?: string, variables?: string) => IRest;
  execute(opsName: string, query?: string, variables?: string): void;
}

const createExecutionSlice: TStoreSlice<IExecutionSlice> = (set, get) => ({
  prepareRequestForExecution: (query, variables) => {
    const { request } = get();
    let gVars = {};
    try {
      gVars = JSON.parse(variables);
    } catch (e) {
      gVars = {};
    }

    //@ts-ignore
    const _request: IRest = Object.assign(
      {},
      {
        ...request,
        body: {
          value: { query, variables: gVars },
          type: ERestBodyTypes.GraphQL,
        },
        __meta: {
          ...request.__meta,
          type: ERequestTypes.Rest,
        },
      }
    );
    return _request;
  },
  execute: async (opsName, query, variables) => {
    const state = get();
    const {
      request,
      runtime: { activePlayground },
    } = state;
    if (!request.url?.raw) return;
    const finalRequest = state.prepareRequestForExecution(query, variables);
    // let response: IRestResponse = { code: 0 };
    state.setRequestRunningFlag(activePlayground, true);
    state.context.request
      .execute(finalRequest)
      .then(({ response, variables, testResult, scriptErrors }) => {
        if (response) state.setPlaygroundResponse(response);
        if (response?.error) {
          const error = response.error;
          console.log(error.message, error.code, error.e.response, error.e);
        }
        return { response, variables, testResult, scriptErrors };
      })
      .catch((e: IRestResponse) => {
        // executor will never throw an error
      })
      .finally(() => {
        state.setRequestRunningFlag(activePlayground, false);
      });
  },
});

export { createExecutionSlice, IExecutionSlice };
