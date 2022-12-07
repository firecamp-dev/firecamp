import { ISocketIO } from '@firecamp/types';

import {
  IUrlSlice,
  createUrlSlice,
  IConnectionsSlice,
  createConnectionSlice,
} from '.';

interface IRequestSlice extends IUrlSlice, IConnectionsSlice {
  request: ISocketIO;

  initialiseRequest: (request: ISocketIO) => void;
  setRequestKey: (key: string, value: any) => void;
  changeListeners: (listeners: Array<string>) => void;
  changeMeta: (key: string, value: any) => void;
  changeConfig: (key: string, value: any) => void;
}

const requestSliceKeys = ['url', 'connections', 'config', '__meta', '__ref'];

const createRequestSlice = (
  set,
  get,
  initialRequest: ISocketIO
): IRequestSlice => ({
  request: initialRequest,

  //url
  ...createUrlSlice(set, get),
  ...createConnectionSlice(set, get),

  initialiseRequest: (request: ISocketIO) => {
    set((s) => ({
      ...s,
      request,
    }));
  },

  setRequestKey: (key: string, value: any) => {
    set((s) => ({
      request: {
        ...s.request,
        [key]: value,
      },
    }));
  },
  changeListeners: (listeners: Array<string>) => {
    const state = get();
    set((s) => ({
      request: {
        ...s.request,
        listeners,
      },
    }));
    // update config
    state.changeMeta('onConnectListeners', listeners);
    // state.equalityChecker({ listeners });
  },

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
    const lastConfig = state.last?.request.config;
    const updatedConfig = {
      ...(state.request.config || {}),
      [key]: value,
    };
    set((s) => ({ request: { ...s.request, config: updatedConfig } }));
    // prepare push action for config in _root
    state.prepareRequestConfigPushAction(lastConfig, updatedConfig);
  },
});

export { IRequestSlice, createRequestSlice, requestSliceKeys };
