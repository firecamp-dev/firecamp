import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import equal from 'react-fast-compare';
import { _array, _object } from '@firecamp/utils';
import { IWebSocket } from '@firecamp/types';
import { normalizeRequest } from '../../services/reqeust.service';
import {
  EReqChangeUrlKeys,
  EReqChangeMetaKeys,
  EReChangeRootKeys,
} from '../../types';
import { TStoreSlice } from '../store.type';

const RequestChangeState: IRequestChangeState = {
  url: [],
  __meta: [],
  __root: [],
};

interface IRequestChangeState {
  url?: EReqChangeUrlKeys[];
  __meta?: EReqChangeMetaKeys[];
  __root?: EReChangeRootKeys[];
}

interface IRequestChangeStateSlice {
  requestChangeState?: IRequestChangeState;
  equalityChecker: (request: Partial<IWebSocket>) => void;
  preparePayloadForSaveRequest: () => IWebSocket;
}

const createRequestChangeStateSlice: TStoreSlice<IRequestChangeStateSlice> = (set, get) => ({
  requestChangeState: RequestChangeState,
  equalityChecker: (request: Partial<IWebSocket>) => {
    const state = get();
    const {
      originalRequest: _request,
      requestChangeState: _rcs,
      runtime: { isRequestSaved },
    } = state;
    if (!isRequestSaved) return;

    for (let key in request) {
      switch (key) {
        case 'config':
        case 'headers':
          if (!equal(_request[key], request[key])) {
            if (!_rcs.__root.includes(key)) _rcs.__root.push(key);
          } else {
            _rcs.__root = _array.without(_rcs.__root, key);
          }
          break;
        case 'url':
        case '__meta':
          Object.keys(request[key]).forEach((k) => {
            if (!equal(_request[key][k], request[key][k])) {
              if (!_rcs[key].includes(k)) _rcs[key].push(k);
            } else {
              _rcs[key] = _array.without(_rcs[key], k);
            }
          });
          break;
      }
    }
    console.log(_rcs);
    const hasChange = !_object.isEmpty(_cleanDeep(_cloneDeep(_rcs)));
    state.context.request.onChangeRequestTab(state.runtime.tabId, {
      hasChange,
    });
  },
  preparePayloadForSaveRequest: () => {
    const state = get();
    const _sr = normalizeRequest(state.request);
    console.log(_sr);
    return _sr;
  },
});

export { createRequestChangeStateSlice, IRequestChangeStateSlice };
