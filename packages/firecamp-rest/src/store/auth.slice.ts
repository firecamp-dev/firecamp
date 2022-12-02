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
    let { key, value } = updates;

    let lastAuth = get()?.last?.request.auth?.[type];
    let updatedAuth = { ...(get().request.auth[type] || {}), [key]: value };

    // for auth type oauth2 whole auth payload will be there in updates instead update key value pair
    if (type === EAuthTypes.OAuth2) {
      updatedAuth = updates;
    }

    let updatedAuths = {
      ...get().request.auth,
      [type]: updatedAuth,
    };

    set((s: IRestStore) => ({
      ...s,
      request: {
        ...s.request,
        auth: updatedAuths,
      },
    }));

    // Prepare commit action for auth
    get()?.prepareAuthPushAction(lastAuth, updatedAuth, type);
  },
});

export { IAuthSlice, TAuth, createAuthSlice };
