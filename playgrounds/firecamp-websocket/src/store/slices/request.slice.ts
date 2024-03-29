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

  /** prepare the request path after request save (add/update) */
  onRequestSave: (__requestRef: IWebSocket['__ref']) => void;
}

const requestSliceKeys: string[] = [
  'url',
  'connection',
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
      state.context.request
        .save(_request, tabId, true)
        .then(({ __ref }) => {
          //reset the rcs state
          state.disposeRCS();
          state.onRequestSave(__ref);
        })
        .then(() => {
          setTimeout(() => {
            const plg = state.playground;
            if (plg.message.value) {
              state.addItem(true);
            }
          });
        });
      // TODO: // state.context.request.subscribeChanges(_request.__ref.id, fn);
    } else {
      if (!state.requestHasChanges) {
        state.context.app.notify.info(
          "The request doesn't have any changes to be saved."
        );
        return null;
      }
      const _request = state.preparePayloadForUpdateRequest();
      if (!_request) {
        state.context.app.notify.info(
          "The request doesn't have any changes to be saved."
        );
        return null;
      }
      state.toggleUpdatingReqFlag(true);
      state.context.request
        .save(_request, tabId)
        .then(() => {
          //reset the rcs state
          state.disposeRCS();
          state.onRequestSave(_request.__ref);
        })
        .finally(() => {
          state.toggleUpdatingReqFlag(false);
        });
    }
  },
  onRequestSave: (__requestRef) => {
    const state = get();
    const { id } = __requestRef;
    const requestPath = id
      ? state.context?.request.getPath(id)
      : { path: '', items: [] };

    set((s) => ({
      request: {
        ...s.request,
        __ref: { ...s.request.__ref, ...__requestRef },
      },
      runtime: {
        ...s.runtime,
        isRequestSaved: true,
        requestPath,
      },
    }));
  },
});

export { IWebSocket, IRequestSlice, createRequestSlice, requestSliceKeys };
