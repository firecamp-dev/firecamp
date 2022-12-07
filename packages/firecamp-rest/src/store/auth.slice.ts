import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import {
  EAuthTypes,
  IAuthBasic,
  IAuthBearer,
  IAuthDigest,
  IOAuth1,
  IUiOAuth2,
  IUiAuth,
} from '@firecamp/types';
import { _object, _table } from '@firecamp/utils';
import { IRestStore } from './rest.store';
import { getAuthHeaders } from '../services/request.service';

interface IAuthSlice {
  changeAuth: (type: EAuthTypes, updates: { key: string; value: any }) => void;
  resetAuthHeaders: (authType: EAuthTypes) => void;
  updateActiveAuth: (authType: EAuthTypes) => void;
  updateAuthValue: (
    authType: EAuthTypes,
    updates: { key: string; value: any }
  ) => void;
}

type TAuth = IAuthBasic | IAuthBearer | IAuthDigest | IOAuth1 | IUiOAuth2;

const createAuthSlice = (set, get, initialAuth: IUiAuth) => ({
  changeAuth: (type: EAuthTypes, updates: { key: string; value: any }) => {
    const state = get();
    const { key, value } = updates;
    let updatedAuth = {};

    // for auth type oauth2 whole auth payload will be there in updates instead update key value pair
    if (type === EAuthTypes.OAuth2) {
      updatedAuth = updates;
    } else {
      updatedAuth = { ...state.request.auth[type], [key]: value };
    }
    console.log(updatedAuth, 'updatedAuth...');
    const updatedAuths = {
      ...state.request.auth,
      [type]: updatedAuth,
    };

    set((s: IRestStore) => ({
      ...s,
      request: {
        ...s.request,
        auth: updatedAuths,
      },
    }));
    state.equalityChecker({ auth: updatedAuths });
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
  updateActiveAuth: (authType: EAuthTypes) => {
    const state = get();
    state.changeMeta({ activeAuthType: authType });
    state.resetAuthHeaders(authType);
  },
  updateAuthValue: (
    authType: EAuthTypes,
    updates: { key: string; value: any }
  ) => {
    if (!authType) return;
    const state = get();
    // update store
    state.changeAuth(authType, updates);
    state.resetAuthHeaders(authType);
  },
});

export { IAuthSlice, TAuth, createAuthSlice };
