const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('__electron__', {
  http: {
    send: (request: any, variables: any) =>
      ipcRenderer.invoke('http:send', request, variables),
    stop: (requestId: string) => ipcRenderer.invoke('http:stop', requestId),
  },
});
