import { IWebSocket, TId } from '@firecamp/types';
import { TStoreSlice } from '../store.type';
import {
  IUrlSlice,
  createUrlSlice,
  IConnectionsSlice,
  createConnectionSlice,
} from './';

interface IRequestSlice extends IUrlSlice, IConnectionsSlice {
  request: IWebSocket;
  changeMeta: (key: string, value: any) => void;
  changeConfig: (key: string, value: any) => void;
  save: (tabId: TId) => void;
}

const requestSliceKeys: string[] = [
  'url',
  'connections',
  'config',
  '__meta',
  '__ref',
];

const createRequestSlice: TStoreSlice<IRequestSlice> = (
  set,
  get,
  initialRequest: IWebSocket
) => ({
  request: initialRequest,

  // url
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
      state.context.request.save(_request, tabId, true).then(() => {
        //reset the rcs state
        state.disposeRCS();
      });
      // TODO: // state.context.request.subscribeChanges(_request.__ref.id, handlePull);
    } else {
      const _request = state.preparePayloadForUpdateRequest();
      if (!_request) {
        state.context.app.notify.info(
          "The request doesn't have any changes to be saved."
        );
        return null;
      }
      state.context.request.save(_request, tabId).then(() => {
        //reset the rcs state
        state.disposeRCS();
      });
    }
  },
});

export { IWebSocket, IRequestSlice, createRequestSlice, requestSliceKeys };
