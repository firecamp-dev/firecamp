import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import {
  EAuthTypes,
  IAuth,
  IAuthBasic,
  IAuthBearer,
  IAuthDigest,
  IOAuth1,
  IOAuth2UiState,
} from '@firecamp/types';
import { _object, _table } from '@firecamp/utils';
import { IRestStore } from './rest.store';
import { getAuthHeaders } from '../services/request.service';

interface IAuthSlice {
  changeAuthType: (authType: EAuthTypes) => void;
  changeAuth: (type: EAuthTypes, updates: { key: string; value: any }) => void;
  resetAuthHeaders: (authType: EAuthTypes) => void;
}

type TAuth = IAuthBasic | IAuthBearer | IAuthDigest | IOAuth1 | IOAuth2UiState;

const createAuthSlice = (set, get) => ({
  changeAuthType: (type: EAuthTypes) => {
    const state = get();
    let { request, runtime } = state;
    let auth: Partial<IAuth> | undefined = { type };
    if (!type) {
      // if type is NoBody ('') then  remove the auth from request
      delete request.auth;
      auth = undefined;
    } else {
      auth = {
        type,
        value: runtime.auths[type],
      };
      request = { ...request, auth };
    }
    set({ request });
    state.resetAuthHeaders(type);
    state.equalityChecker({ auth });
  },
  changeAuth: (type: EAuthTypes, changes: { key: string; value: any }) => {
    const state = get();
    const { key, value } = changes;
    let auth: Partial<IAuth> = {
      type,
      // value: {},
    };

    // for auth type oauth2 whole auth payload will be there in updates instead update key value pair
    if (type === EAuthTypes.OAuth2) {
      //@ts-ignore
      auth.value = { ...changes };
    } else {
      auth.value = { ...state.request.auth.value, [key]: value };
    }

    set((s: IRestStore) => ({
      request: {
        ...s.request,
        auth,
      },
      runtime: {
        ...s.runtime,
        auths: {
          ...s.runtime.auths,
          [auth.type]: auth.value,
        },
      },
    }));
    state.resetAuthHeaders(auth.type);
    state.equalityChecker({ auth });
  },
  resetAuthHeaders: async (authType: EAuthTypes) => {
    const state = get();
    try {
      if (authType == EAuthTypes.Inherit) {
        state.changeAuthHeaders([]);
        return;
      }
      const authHeaders = await getAuthHeaders(state.request, authType);
      if (authType === EAuthTypes.OAuth2 && authHeaders['Authorization']) {
        authHeaders['Authorization'] = `Bearer ${authHeaders['Authorization']}`;
        state.setOAuth2LastFetchedToken(authHeaders['Authorization']);
      }

      // prepare auth headers array
      const headersAry = _table.objectToTable(authHeaders) || [];
      // console.log({ headersAry });

      state.changeAuthHeaders(headersAry);
    } catch (error) {
      console.log({ api: 'rest.getAuthHeaders', error });
    }
  },
});

export { IAuthSlice, TAuth, createAuthSlice };
