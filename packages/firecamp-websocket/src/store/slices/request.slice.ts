import { IWebSocket } from '@firecamp/types';

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
    const state = get();
    const lastConfig = state.last?.request.config;
    const updatedConfig = {
      ...(get()?.request.config || {}),
      [key]: value,
    };
    set((s) => ({ request: { ...s.request, config: updatedConfig } }));

    // prepare push action for config in _root
    state.prepareRootPushAction({ config: lastConfig }, updatedConfig);
  },
});

export { IWebSocket, IRequestSlice, createRequestSlice, requestSliceKeys };
