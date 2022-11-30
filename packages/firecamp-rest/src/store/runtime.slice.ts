import { IHeader, IRestScripts, IAuth, TId } from '@firecamp/types';

interface IRuntime {
  authHeaders?: Array<IHeader>;
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
    let headersLength = get().request.headers?.length + authHeaders.length;
    let updatedUiRequestPanel = {
      hasHeaders: headersLength ? true : false,
      headers: headersLength,
    };

    set((s) => ({
      ...s,
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
      ...s,
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
      ...s,
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
      ...s,
      runtime: {
        ...s.runtime,
        activeEnvironments: updates,
      },
    }));
  },
  setRequestRunningFlag: (flag: boolean) => {
    set((s) => ({
      ...s,
      runtime: {
        ...s.runtime,
        isRequestRunning: flag,
      },
    }));
  },
  setRequestSavedFlag: (flag: boolean) => {
    set((s) => ({
      ...s,
      runtime: {
        ...s.runtime,
        isRequestSaved: flag,
      },
    }));
  },
  setOAuth2LastFetchedToken: (token: string) => {
    set((s) => ({
      ...s,
      runtime: {
        ...s.runtime,
        oauth2LastFetchedToken: token,
      },
    }));
  },
});

export { createRuntimeSlice, IRuntime, IRuntimeSlice };
