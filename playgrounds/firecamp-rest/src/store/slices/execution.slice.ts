import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import {
  EAuthTypes,
  EScriptLanguages,
  EScriptTypes,
  IAuth,
  IRest,
  IScript,
} from '@firecamp/types';
import { _clipboard } from '@firecamp/utils';
import { _object } from '@firecamp/utils';
import { TStoreSlice } from '../store.type';

interface IExecutionSlice {
  /**
   * prepare auth for execution
   * return the IAuth from request or from parent artifacts
   * 1. if request has auth set then return request auth
   * 2. if type is inherit then return parent auth
   *  2.1 if folder has auth then return folder auth
   *  2.2 else return collection auth
   */
  prepareAuthForExecution: () => IAuth;
  /**
   * prepare preScripts & postScripts for execution
   *
   * return the merged/combined pre/post scripts of request and parent (folder/collection)
   * then merging sequence will be for
   * 1. preScripts
   *    sequence collection + folder + request
   * 2. postScripts
   *    sequence collection + folder + request
   */
  prepareScriptsForExecution: () => {
    preScripts: IScript[];
    postScripts: IScript[];
  };
  /**
   * return final request for execution,
   *
   * the request will be generated based on the configuration with parent artifacts,
   * here the auth, preScripts & postScripts might get manipulated by the parent artifacts at the time of execution
   */
  prepareRequestForExecution: () => IRest;
  execute(): void;
}

const findScriptValue = (
  scripts: IScript[],
  type: EScriptTypes
): IScript['value'] => {
  const s = scripts.find((s) => s.type == type);
  return s?.value || [];
};

const createExecutionSlice: TStoreSlice<IExecutionSlice> = (set, get) => ({
  prepareAuthForExecution: () => {
    const {
      runtime: { parentArtifacts },
      request: { auth },
    } = get();
    if (auth?.type != EAuthTypes.Inherit) return auth;
    if (!parentArtifacts) return { type: EAuthTypes.None, value: '' };
    const { collection, folder } = parentArtifacts;
    if (folder?.auth?.type) return folder.auth;
    else if (collection?.auth?.type) return collection.auth;
    else return { type: EAuthTypes.None, value: '' };
  },
  prepareScriptsForExecution: () => {
    const {
      runtime: { parentArtifacts },
      request,
    } = get();
    const { collection, folder } = parentArtifacts;
    const scripts = {
      request: { pre: [], post: [] },
      collection: { pre: [], post: [] },
      folder: { pre: [], post: [] },
    };

    if (request?.preScripts?.length) {
      scripts.request.pre = findScriptValue(
        request.preScripts,
        EScriptTypes.PreRequest
      );
    }
    if (request?.postScripts?.length) {
      scripts.request.post = findScriptValue(
        request.postScripts,
        EScriptTypes.Test
      );
    }

    if (collection?.preScripts?.length) {
      scripts.collection.pre = findScriptValue(
        collection.preScripts,
        EScriptTypes.PreRequest
      );
    }
    if (collection?.postScripts?.length) {
      scripts.collection.post = findScriptValue(
        collection.postScripts,
        EScriptTypes.Test
      );
    }

    if (folder?.preScripts?.length) {
      scripts.folder.pre = findScriptValue(
        folder.preScripts,
        EScriptTypes.PreRequest
      );
    }
    if (folder?.postScripts?.length) {
      scripts.folder.post = findScriptValue(
        folder.postScripts,
        EScriptTypes.Test
      );
    }

    return {
      preScripts: [
        {
          id: 'pre-script',
          value: [
            ...scripts.collection.pre,
            ...scripts.folder.pre,
            ...scripts.request.pre,
          ],
          type: EScriptTypes.PreRequest,
          language: EScriptLanguages.JavaScript,
        },
      ],
      postScripts: [
        {
          id: 'tests',
          value: [
            ...scripts.collection.post,
            ...scripts.folder.post,
            ...scripts.request.post,
          ],
          type: EScriptTypes.Test,
          language: EScriptLanguages.JavaScript,
        },
      ],
    };
  },

  prepareRequestForExecution: () => {
    const {
      request,
      runtime: { authHeaders = [] },
      prepareAuthForExecution,
      prepareScriptsForExecution,
    } = get();
    const auth = prepareAuthForExecution();
    const { preScripts, postScripts } = prepareScriptsForExecution();
    return {
      ...{ ...request, headers: [...request.headers, ...authHeaders] }, // merge auth headers to main headers
      auth,
      preScripts,
      postScripts,
    };
  },
  execute: async () => {
    const state = get();
    // set response empty
    set({ response: { code: 0 } });

    // Check if request is running or not. stop running request if already true
    if (state.runtime.isRequestRunning === true) {
      await state.context.request.cancelExecution(state.request.__ref.id);
      // set request running state as false
      state.setRequestRunningFlag(false);
      return;
    }
    state.setRequestRunningFlag(true);

    const finalRequest = state.prepareRequestForExecution();
    // console.log(finalRequest, '...finalRequest');
    // execute request
    await state.context.request
      .execute(finalRequest)
      .then(({ response, variables, testResult, scriptErrors }) => {
        console.log({ response, variables, testResult });
        if (response?.error) {
          const error = response.error;
          console.log(error.message, error.code, error.e?.response, error.e);
        }
        if (response) {
          set((s) => ({ response, testResult, scriptErrors })); // TODO: check what to set/ response or testScriptResponse
        }
      })
      .catch((e) => {
        console.log(e.message, e.stack, e.response, e, 9090);
      })
      .finally(() => {
        state.setRequestRunningFlag(false);
      });
  },
});

export { createExecutionSlice, IExecutionSlice };
