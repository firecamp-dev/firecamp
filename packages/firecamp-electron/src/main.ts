import { app, BrowserWindow, ipcMain, screen } from 'electron';
import RestExecutor from '@firecamp/rest-executor';
import * as path from 'node:path';


const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    width,
    height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (app.isPackaged) {
    // 'build/index.html'
    // win.loadURL(`file://${__dirname}/../../build/prod/index.html`);
  } else {
    // win.loadURL(`file://${__dirname}/../../../build/dev/index.html`);
    win.loadURL('https://localhost:3000');

    win.webContents.openDevTools();

    // Hot Reloading on 'node_modules/.bin/electronPath'
    // require('electron-reload')(__dirname, {
    //   electron: path.join(
    //     __dirname,
    //     '..',
    //     '..',
    //     'node_modules',
    //     '.bin',
    //     'electron' + (process.platform === 'win32' ? '.cmd' : '')
    //   ),
    //   forceHardReset: true,
    //   hardResetMethod: 'exit',
    // });
  }
};

app.whenReady().then(() => {
  createWindow();

  const reMap: Record<string, any> = {};
  ipcMain.handle('http:send', async (event, request, variables) => {
    reMap[request.__ref.id] = new RestExecutor();
    const res = await reMap[request.__ref.id].send(request, variables);
    // once the request is executed, free the cached executor
    delete reMap[request.__ref.id];
    return res;
  });

  ipcMain.handle('http:stop', async (event, requestId) => {
    const restE = reMap[requestId];
    if (restE) restE.cancel();
    return;
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});
