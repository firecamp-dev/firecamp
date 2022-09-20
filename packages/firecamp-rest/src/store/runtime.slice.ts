import { IHeader, IRestScripts, IAuth, TId } from '@firecamp/types';

interface IRuntime {
  auth_headers?: Array<IHeader>;
  inherit?: {
    auth: {
      active: string;
      payload: IAuth;
      oauth2_last_fetched_token: string;
    };
    script: IRestScripts;
  };
  activeEnvironments?: {
    workspace: TId;
    collection: TId;
  };
  isRequestRunning?: boolean;
  isRequestSaved?: boolean;
  oauth2_last_fetched_token: string;
}

interface IRuntimeSlice {
  runtime?: IRuntime;

  changeAuthHeaders?: (auth_headers: Array<IHeader>) => void;
  changeInherit?: (key: string, value: any) => void;
  changeActiveEnvironment?: (
    scope: 'collection' | 'workspace',
    environment_id: TId
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
    auth_headers: [],
    inherit: {
      auth: {
        active: '',
        payload: {},
        oauth2_last_fetched_token: '',
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
    oauth2_last_fetched_token: '',
    ...initialRuntimeState,
  },

  changeAuthHeaders: (auth_headers: Array<IHeader>) => {
    let headersLength = get().request.headers?.length + auth_headers.length;
    let updatedUiRequestPanel = {
      hasHeaders: headersLength ? true : false,
      headers: headersLength,
    };

    set((s) => ({
      ...s,
      runtime: {
        ...s.runtime,
        auth_headers,
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
    environment_id: TId
  ) => {
    // console.log({ scope, environment_id });

    set((s) => ({
      ...s,
      runtime: {
        ...s.runtime,
        activeEnvironments: {
          ...s.runtime.activeEnvironments,
          [scope]: environment_id,
        },
      },
    }));
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
        oauth2_last_fetched_token: token,
      },
    }));
  },
});

export { createRuntimeSlice, IRuntime, IRuntimeSlice };
