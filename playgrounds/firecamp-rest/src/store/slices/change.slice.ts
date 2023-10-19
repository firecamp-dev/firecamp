import _cleanDeep from 'clean-deep';
import _cloneDeep from 'lodash/cloneDeep';
import equal from 'react-fast-compare';
import { _array, _object } from '@firecamp/utils';
import { ERequestTypes, IRest } from '@firecamp/types';
import { normalizeRequest } from '../../services/request.service';
import {
  EReqChangeRootKeys,
  EReqChangeMetaKeys,
  EReqChangeUrlKeys,
} from '../../types';
import { TStoreSlice } from '../store.type';

interface IRequestChangeState {
  url?: EReqChangeUrlKeys[];
  __meta?: EReqChangeMetaKeys[];
  __root?: EReqChangeRootKeys[];
}

interface IRequestChangeStateSlice {
  requestHasChanges?: boolean;
  requestChangeState?: IRequestChangeState;
  equalityChecker: (request: Partial<IRest>) => void;
  preparePayloadForSaveRequest: () => IRest;
  preparePayloadForUpdateRequest: () => Partial<IRest | null>;
  /**
   * dispose request change state
   * 1. set originalRequest to the current state.request
   * 2. initialise the rcs state
   */
  disposeRCS: () => void;
}
//@note; always use _cloneDeep at its usage otherwise its value will be manipulate at global scope
const initialSliceState = {
  requestChangeState: {
    url: [],
    scripts: [],
    __meta: [],
    __root: [],
  },
};

const createRequestChangeStateSlice: TStoreSlice<IRequestChangeStateSlice> = (
  set,
  get
) => ({
  requestChangeState: _cloneDeep(initialSliceState.requestChangeState),
  equalityChecker: (request: Partial<IRest>) => {
    const state = get();
    const {
      originalRequest: _request,
      requestChangeState,
      runtime: { isRequestSaved },
      requestHasChanges,
    } = state;
    if (!isRequestSaved) return;

    const _rcs = _cloneDeep(requestChangeState);
    for (let key in request) {
      switch (key) {
        case EReqChangeRootKeys.method:
        case EReqChangeRootKeys.config:
        case EReqChangeRootKeys.headers:
        case EReqChangeRootKeys.body:
        case EReqChangeRootKeys.auth:
        case EReqChangeRootKeys.preScripts:
        case EReqChangeRootKeys.postScripts:
          console.log(_request[key], request[key], key);
          if (!equal(_request[key], request[key])) {
            if (!_rcs.__root.includes(key)) _rcs.__root.push(key);
          } else {
            _rcs.__root = _array.without(
              _rcs.__root,
              key
            ) as EReqChangeRootKeys[];
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
    console.log('_rcs', _rcs);
    const hasChange = !_object.isEmpty(_cleanDeep(_cloneDeep(_rcs)));
    console.log(state.context.tab, state.runtime.tabId, hasChange);
    state.context.tab.changeMeta(state.runtime.tabId, {
      hasChange,
    });
    set((s) => ({
      requestChangeState: _rcs,
      requestHasChanges: hasChange,
    }));
  },
  preparePayloadForSaveRequest: () => {
    const state = get();
    const _sr = normalizeRequest(state.request);
    console.log(_sr);
    return _sr;
  },
  preparePayloadForUpdateRequest: () => {
    const state = get();
    const { request, requestChangeState: _rcs } = state;
    const _request = normalizeRequest(request);
    let _ur: Partial<IRest> = {};

    for (let key in _rcs) {
      /**
       * @note: if _rcs key is empty then continue the next loop
       * because _object.pick will return the empty {} in below case if we allow to loop with _rcs[key] = []
       */
      if (!_rcs[key].length) continue;
      switch (key) {
        case '__root':
          _ur = { ..._ur, ..._object.pick(_request, _rcs[key]) };
          break;
        case 'url':
          //@ts-ignore url will have only updated key
          _ur.url = _object.pick(_request[key], _rcs[key]);
          break;
        case '__meta':
          //@ts-ignore TODO: manage types here
          _ur.__meta = _object.pick(_request[key], _rcs[key]);
          break;
      }
    }
    if (_object.isEmpty(_ur)) return null; //if request has no change then return null as update payload
    //@ts-ignore
    _ur.__meta = {
      type: ERequestTypes.Rest,
    };
    _ur.__ref = {
      id: _request.__ref.id,
      collectionId: _request.__ref.collectionId,
    };
    //@ts-ignore
    _ur.__changes = { ..._rcs };
    console.log(_ur);
    return _ur;
  },
  disposeRCS: () => {
    set((s) => ({
      originalRequest: _cloneDeep(s.request),
      requestChangeState: _cloneDeep(initialSliceState.requestChangeState),
      requestHasChanges: false,
    }));
  },
});

export { createRequestChangeStateSlice, IRequestChangeStateSlice };
