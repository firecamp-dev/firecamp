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
      ...s,
      request: {
        ...s.request,
        [key]: value,
      },
    }));
  },
  changeListeners: (listeners: Array<string>) => {
    let lastListeners = get()?.last?.request.listeners;

    set((s) => ({
      ...s,
      request: {
        ...s.request,
        listeners,
      },
    }));

    // update config
    get()?.changeMeta('onConnectListeners', listeners);

    // prepare _root push action
    get()?.prepareRootPushAction({ listeners: lastListeners }, { listeners });
  },

  changeMeta: (key: string, value: any) => {
    let lastMeta = get()?.last?.request.__meta;
    let updatedMeta = {
      ...(get()?.request.__meta || {}),
      [key]: value,
    };
    set((s) => ({
      ...s,
      request: { ...s.request, __meta: updatedMeta },
    }));

    // Prepare push action for __meta
    get()?.prepareMetaPushAction(lastMeta, updatedMeta);
  },
  changeConfig: (key: string, value: any) => {
    let lastConfig = get()?.last?.request.config;
    let updatedConfig = {
      ...(get()?.request.config || {}),
      [key]: value,
    };

    set((s) => ({ ...s, request: { ...s.request, config: updatedConfig } }));

    // Prepare push action for config in _root
    get()?.prepareRequestConfigPushAction(lastConfig, updatedConfig);
  },
});

export { IRequestSlice, createRequestSlice, requestSliceKeys };
