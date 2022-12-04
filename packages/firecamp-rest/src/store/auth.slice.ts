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
import { _object } from '@firecamp/utils';
import { IRestStore } from './rest.store';

interface IAuthSlice {
  changeAuth: (type: EAuthTypes, updates: { key: string; value: any }) => any;
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
});

export { IAuthSlice, TAuth, createAuthSlice };
