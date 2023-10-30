const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('__electron__', {
  http: {
    send: () => ipcRenderer.invoke('http:send'),
    stop: () => ipcRenderer.invoke('http:stop'),
  },
});
