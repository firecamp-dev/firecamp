import { IHeader, IAuth, TId, EAuthTypes } from '@firecamp/types';
import { _auth } from '@firecamp/utils';
import { RuntimeBodies } from '../../constants';
import { TStoreSlice } from '../store.type';

interface IRuntime {
  bodies: typeof RuntimeBodies;
  auths: typeof _auth.defaultAuthState;
  authHeaders?: IHeader[];
  inherit?: {
    auth: {
      active: string;
      payload: IAuth;
      oauth2LastFetchedToken: string;
    };
    script?: any; //TODO: will be used when we'll introduce the inherit script
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
    inherit: {
      auth: {
        active: '',
        payload: { value: '', type: EAuthTypes.None },
        oauth2LastFetchedToken: '',
      },
      script: {
        pre: '',
        post: '',
        test: '',
      },
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
