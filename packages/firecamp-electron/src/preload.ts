const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('__electron__', {
  http: {
    send: (request: any, variables: any) => {
      return ipcRenderer.invoke('http:send', request, variables);
    },
    stop: (requestId: string) => ipcRenderer.invoke('http:stop', requestId),
  },
  auth: {
    github: (clientId: string, scope: string[]) => {
      return ipcRenderer.invoke('auth:github:code', clientId, scope);
    },
  },
});
