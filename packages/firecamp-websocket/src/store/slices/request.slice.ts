import { IWebSocket, TId } from '@firecamp/types';
import { normalizeRequest } from '../../services/reqeust.service';
import {
  IUrlSlice,
  createUrlSlice,
  IConnectionsSlice,
  createConnectionSlice,
} from '../index';

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

const createRequestSlice = (
  set,
  get,
  initialRequest: IWebSocket
): IRequestSlice => ({
  request: initialRequest,

  // url
  ...createUrlSlice(set, get),
  ...createConnectionSlice(set, get),

  changeMeta: (key: string, value: any) => {
    const state = get();
    const __meta = {
      ...(state.request.__meta || {}),
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
    const {
      request,
      runtime: { isRequestSaved },
    } = state;
    if (!isRequestSaved) {
      const _request = normalizeRequest(request);
      state.context.request.save(_request, tabId);
    }
  },
});

export { IWebSocket, IRequestSlice, createRequestSlice, requestSliceKeys };
