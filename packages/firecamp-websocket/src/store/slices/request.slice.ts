import { IWebSocket } from '@firecamp/types';

import {
  IUrlSlice,
  createUrlSlice,
  IConnectionsSlice,
  createConnectionSlice,
} from '../index';

interface IRequestSlice extends IUrlSlice, IConnectionsSlice {
  request: IWebSocket;

  initialiseRequest: (request: IWebSocket) => void;
  setRequestKey: (key: string, value: any) => void;
  changeMeta: (key: string, value: any) => void;
  changeConfig: (key: string, value: any) => void;
}

const requestSliceKeys: string[] = [
  'url',
  'connections',
  'config',
  'meta',
  '_meta',
];

const createRequestSlice = (
  set,
  get,
  initialRequest: IWebSocket
): IRequestSlice => ({
  request: initialRequest,

  //url
  ...createUrlSlice(set, get),
  ...createConnectionSlice(set, get),

  initialiseRequest: (request: IWebSocket) => {
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

  changeMeta: (key: string, value: any) => {
    let lastMeta = get()?.last?.request.meta;
    let updatedMeta = {
      ...(get()?.request.meta || {}),
      [key]: value,
    };
    set((s) => ({
      ...s,
      request: { ...s.request, meta: updatedMeta },
    }));

    // Prepare push action for meta
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
    get()?.prepareRootPushAction({ config: lastConfig }, updatedConfig);
  },
});

export { IWebSocket, IRequestSlice, createRequestSlice, requestSliceKeys };
