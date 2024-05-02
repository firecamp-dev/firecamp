const { contextBridge, ipcRenderer } = require('electron');
import { PreloadSocketIO } from './preload/socket-io';
import { PreloadWS } from './preload/ws';

contextBridge.exposeInMainWorld('__electron__', {
  http: {
    send: (request: any, variables: any) => {
      if (request.body?.type == 'multipart/form-data') {
        request.body = {
          ...request.body,
          value: interceptMultipartBody(request.body),
        };
      }
      return ipcRenderer.invoke('http:send', request, variables);
    },
    stop: (requestId: string) => ipcRenderer.invoke('http:stop', requestId),
  },
  auth: {
    github: (clientId: string, scope: string[]) => {
      return ipcRenderer.invoke('auth:github:code', clientId, scope);
    },
  },
  webSocket: PreloadWS,
  io: PreloadSocketIO,
});

/* electron has limitation that we can not send DOM elements like files over ipc, thus we need to send only file meta including name, path and type */
const interceptMultipartBody = (body: any) => {
  const { value = [], type } = body;
  return value.map((v: any) => {
    if (v.file) {
      return {
        ...v,
        file: {
          name: v.file.name,
          path: v.file.path,
          type: v.file.type,
        },
      };
    }
    return v;
  });
};
