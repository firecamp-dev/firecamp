import { ISocketIO, TId } from '@firecamp/types';
import { TStoreSlice } from '../store.type';
import {
  IUrlSlice,
  createUrlSlice,
  IConnectionsSlice,
  createConnectionSlice,
} from '.';

interface IRequestSlice extends IUrlSlice, IConnectionsSlice {
  request: ISocketIO;
  changeMeta: (key: string, value: any) => void;
  changeConfig: (key: string, value: any) => void;
  save: (tabId: TId) => void;
}

const requestSliceKeys = ['url', 'connection', 'config', '__meta', '__ref'];

const createRequestSlice: TStoreSlice<IRequestSlice> = (
  set,
  get,
  initialRequest: ISocketIO
) => ({
  request: initialRequest,

  //url
  ...createUrlSlice(set, get),
  ...createConnectionSlice(set, get),

  changeMeta: (key: string, value: any) => {
    const state = get();
    const __meta = {
      ...state.request.__meta,
      [key]: value,
    };
    set((s) => ({
      request: { ...s.request, __meta },
    }));
    state.equalityChecker({ __meta });
  },
  changeConfig: (key: string, value: any) => {
    const state = get();
    const config = {
      ...(state.request.config || {}),
      [key]: value,
    };
    set((s) => ({ request: { ...s.request, config } }));
    state.equalityChecker({ config });
  },
  save: (tabId) => {
    const state = get();
    if (!state.runtime.isRequestSaved) {
      const _request = state.preparePayloadForSaveRequest();
      state.context.request.save(_request, tabId, true);
      // TODO: // state.context.request.subscribeChanges(_request.__ref.id, handlePull);
    } else {
      const _request = state.preparePayloadForUpdateRequest();
      state.context.request.save(_request, tabId).then(() => {
        //reset the rcs state
        state.disposeRCS();
      });
    }
  },
});

export { IRequestSlice, createRequestSlice, requestSliceKeys };
