import { IHeader, IAuth, TId, IScript } from '@firecamp/types';
import { _auth } from '@firecamp/utils';
import { RuntimeBodies } from '../../constants';
import { TStoreSlice } from '../store.type';

type TParentArtifacts = {
  collection: {
    auth?: IAuth;
    preScripts?: IScript[];
    postScripts?: IScript[];
  };
  folder: {
    auth?: IAuth;
    preScripts?: IScript[];
    postScripts?: IScript[];
  };
};

interface IRuntime {
  bodies: typeof RuntimeBodies;
  auths: typeof _auth.defaultAuthState;
  authHeaders?: IHeader[];
  parentArtifacts: TParentArtifacts;
  isRequestRunning?: boolean;
  isRequestSaved?: boolean;
  oauth2LastFetchedToken: string;
  tabId: TId;
}

interface IRuntimeSlice {
  runtime?: IRuntime;
  changeAuthHeaders?: (authHeaders: Array<IHeader>) => void;
  setParentArtifacts: (artifacts: TParentArtifacts) => void;
  setRequestRunningFlag: (flag: boolean) => void;
  setRequestSavedFlag: (flag: boolean) => void;
  setOAuth2LastFetchedToken: (token: string) => void;
}

const createRuntimeSlice: TStoreSlice<IRuntimeSlice> = (
  set,
  get,
  initialRuntimeState: IRuntime
) => ({
  runtime: {
    authHeaders: [],
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

  setParentArtifacts: (artifacts) => {
    set((s) => ({
      runtime: {
        ...s.runtime,
        parentArtifacts: artifacts,
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
