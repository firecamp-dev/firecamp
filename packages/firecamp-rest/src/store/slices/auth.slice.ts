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
import {
  getAuthHeaders,
  getInheritedAuthFromParent,
} from '../../services/request.service';
import { TStoreSlice } from '../store.type';

interface IAuthSlice {
  changeAuthType: (authType: EAuthTypes) => void;
  changeAuth: (type: EAuthTypes, updates: { key: string; value: any }) => void;
  resetAuthHeaders: (authType: EAuthTypes) => void;
}
type TAuth = IAuthBasic | IAuthBearer | IAuthDigest | IOAuth1 | IOAuth2UiState;

const createAuthSlice: TStoreSlice<IAuthSlice> = (set, get) => ({
  changeAuthType: (type: EAuthTypes) => {
    const state = get();
    const auth: IAuth = { value: state.runtime.auths[type], type };
    set((s) => {
      return {
        request: {
          ...s.request,
          auth,
        },
        ui: {
          ...s.ui,
          requestPanel: {
            ...s.ui.requestPanel,
            hasAuth: type != EAuthTypes.None,
          },
        },
      };
    });
    state.resetAuthHeaders(type);
    state.equalityChecker({ auth });
  },
  changeAuth: (type: EAuthTypes, changes: { key: string; value: any }) => {
    const state = get();
    const { key, value } = changes;
    const auth: IAuth = {
      type,
      value: '',
    };

    // for auth type oauth2 whole auth payload will be there in updates instead update key value pair
    if (type === EAuthTypes.OAuth2) {
      //@ts-ignore
      auth.value = { ...changes };
    } else {
      auth.value = {
        ...state.request.auth.value,
        [key]: value,
      } as IAuth['value'];
    }

    set((s) => ({
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
  resetAuthHeaders: async (type: EAuthTypes) => {
    const state = get();
    try {
      const parentAuth =
        type == EAuthTypes.Inherit
          ? getInheritedAuthFromParent(state.runtime.parentArtifacts)
          : null;
      const authHeaders = await getAuthHeaders(
        state.request,
        type,
        parentAuth?.auth // value can be null
      );
      if (type === EAuthTypes.OAuth2 && authHeaders['Authorization']) {
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
