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

  ipcMain.handle('auth:github', async (e, clientId, scopes = []) => {
    const authWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
    });
    let githubUrl = 'https://github.com/login/oauth/authorize?';
    let authUrl =
      githubUrl + 'client_id=' + clientId + '&scope=' + scopes.join(',');
    authWindow.loadURL(authUrl);
    authWindow.show();

    const cb = (e: any, rs: any, rj: any) => {
      const rawCode = /code=([^&]*)/.exec(e.url) || null,
        code = rawCode && rawCode.length > 1 ? rawCode[1] : null,
        error = /\?error=(.+)$/.exec(e.url);

      // if there is a code in the callback, proceed to get token from github throw front
      if (code) {
        authWindow.close();
        rs(code);
      } else if (error) {
        authWindow.close();
        rj(error);
      }
    };
    return new Promise((rs, rj) => {
      // will-navigate is observed when github session is alive
      authWindow.webContents.on('will-navigate', (e) => cb(e, rs, rj));
      // will-redirect is observed when github session is expired or user is signing first time
      authWindow.webContents.on('will-redirect', (e) => cb(e, rs, rj));
    });
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
