import { IHeader, IRestScripts, IAuth, TId } from '@firecamp/types';
import { RuntimeBodies } from '../constants';

interface IRuntime {
  bodies: typeof RuntimeBodies;
  authHeaders?: IHeader[];
  inherit?: {
    auth: {
      active: string;
      payload: IAuth;
      oauth2LastFetchedToken: string;
    };
    script: IRestScripts;
  };
  activeEnvironments?: {
    workspace: TId;
    collection: TId;
  };
  isRequestRunning?: boolean;
  isRequestSaved?: boolean;
  oauth2LastFetchedToken: string;
  tabId: TId;
}

interface IRuntimeSlice {
  runtime?: IRuntime;

  changeAuthHeaders?: (authHeaders: Array<IHeader>) => void;
  changeInherit?: (key: string, value: any) => void;
  changeActiveEnvironment?: (
    scope: 'collection' | 'workspace',
    environmentId: TId
  ) => void;
  setActiveEnvironments?: (updates: {
    workspace: TId;
    collection: TId;
  }) => void;
  setRequestRunningFlag: (flag: boolean) => void;
  setRequestSavedFlag: (flag: boolean) => void;
  setOAuth2LastFetchedToken: (token: string) => void;
}

const createRuntimeSlice = (
  set,
  get,
  initialRuntimeState: IRuntime
): IRuntimeSlice => ({
  runtime: {
    authHeaders: [],
    inherit: {
      auth: {
        active: '',
        payload: {},
        oauth2LastFetchedToken: '',
      },
      script: {
        pre: '',
        post: '',
        test: '',
      },
    },
    activeEnvironments: {
      workspace: '',
      collection: '',
    },
    isRequestRunning: false,
    oauth2LastFetchedToken: '',
    ...initialRuntimeState,
  },

  changeAuthHeaders: (authHeaders: Array<IHeader>) => {
    const headersLength = get().request.headers?.length + authHeaders.length;
    const updatedUiRequestPanel = {
      hasHeaders: headersLength ? true : false,
      headers: headersLength,
    };
    set((s) => ({
      runtime: {
        ...s.runtime,
        authHeaders,
      },
      ui: {
        ...s.ui,
        requestPanel: {
          ...s.ui.requestPanel,
          ...updatedUiRequestPanel,
        },
      },
    }));
  },
  changeInherit: (key: string, value: any) => {
    set((s) => ({
      runtime: {
        ...s.runtime,
        inherit: {
          ...s.runtime.inherit,
          [key]: value,
        },
      },
    }));
  },
  changeActiveEnvironment: (
    scope: 'collection' | 'workspace',
    environmentId: TId
  ) => {
    // console.log({ scope, environmentId });

    set((s) => ({
      runtime: {
        ...s.runtime,
        activeEnvironments: {
          ...s.runtime.activeEnvironments,
          [scope]: environmentId,
        },
      },
    }));
    get().context.environment.setVarsToProvidersAndEmitEnvsToTab();
  },
  setActiveEnvironments: (updates: { workspace: TId; collection: TId }) => {
    // console.log({updates});

    set((s) => ({
      runtime: {
        ...s.runtime,
        activeEnvironments: updates,
      },
    }));
  },
  setRequestRunningFlag: (flag: boolean) => {
    set((s) => ({
      runtime: {
        ...s.runtime,
        isRequestRunning: flag,
      },
    }));
  },
  setRequestSavedFlag: (flag: boolean) => {
    set((s) => ({
      runtime: {
        ...s.runtime,
        isRequestSaved: flag,
      },
    }));
  },
  setOAuth2LastFetchedToken: (token: string) => {
    set((s) => ({
      runtime: {
        ...s.runtime,
        oauth2LastFetchedToken: token,
      },
    }));
  },
});

export { createRuntimeSlice, IRuntime, IRuntimeSlice };
