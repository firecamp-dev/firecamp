import { EAuthTypes, ERestBodyTypes, IRest } from '@firecamp/types';
import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import equal from 'react-fast-compare';

import { TAuth } from './index';

import {
  EReqChangeRootKeys,
  EReqChangeScriptsKeys,
  EReqChangeMetaKeys,
  EReqChangeUrlKeys,
  IRestClientRequest,
} from '../types';
import { _array, _object } from '@firecamp/utils';
import { normalizePushPayload } from '../services/request-service';

/**
 * @reference: https://github.com/firecamp-io/firecamp-collaboration-json-examples/blob/main/push/v3/requests/rest/rest.u.json
 */

const RequestChangeState: IRequestChangeState = {
  url: [],
  scripts: [],
  auth: [],
  body: [],
  __meta: [],
  __root: [],
  __removed: {
    body: [],
    auth: [],
  },
};

interface IRequestChangeState {
  url?: EReqChangeUrlKeys[];
  scripts?: EReqChangeScriptsKeys[];
  auth?: EAuthTypes[];
  body?: ERestBodyTypes[];
  __meta?: EReqChangeMetaKeys[];
  __root?: EReqChangeRootKeys[];
  __removed?: {
    body?: ERestBodyTypes[];
    auth?: EAuthTypes[];
  };
}

interface IRequestChangeStateSlice {
  requestChangeState?: IRequestChangeState;
  equalityChecker: (request: Partial<IRest>) => void;
}

const createRequestChangeStateSlice = (set, get): IRequestChangeStateSlice => ({
  requestChangeState: RequestChangeState,
  equalityChecker: (request: Partial<IRest>) => {
    const state = get();
    const {
      originalRequest: _request,
      requestChangeState: _rcs,
      runtime: { isRequestSaved },
    } = state;
    if (!isRequestSaved) return;

    for (let key in request) {
      switch (key) {
        case 'method':
        case 'config':
        case 'headers':
          if (!equal(_request[key], request[key])) {
            if (!_rcs.__root.includes(key)) _rcs.__root.push(key);
          } else {
            _rcs.__root = _array.without(_rcs.__root, key);
          }
          break;
        case 'url':
        case 'scripts':
        case '__meta':
          Object.keys(request[key]).forEach((k) => {
            if (!equal(_request[key][k], request[key][k])) {
              if (!_rcs[key].includes(k)) _rcs[key].push(k);
            } else {
              _rcs[key] = _array.without(_rcs[key], k);
            }
          });
          break;
        case 'auth':
          break;
        case 'body':
          break;
      }
    }
    console.log(_rcs);
  },
});

export { createRequestChangeStateSlice, IRequestChangeStateSlice };
