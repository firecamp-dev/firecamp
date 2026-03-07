import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  nativeImage,
  screen,
} from 'electron';
import RestExecutor from '@firecamp/rest-executor/dist';
import * as path from 'node:path';
import { appIcon, trayIcon } from './icon';
import { AppUpdater } from './updater/updater';
import { prepareAppMenus } from './menu';

const appUpdater = new AppUpdater();
const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    frame: true,
    width,
    height,
    icon: nativeImage.createFromPath(appIcon),
    titleBarStyle: 'customButtonsOnHover',
    // titleBarStyle: 'hiddenInset',
    // titleBarStyle: 'hidden',
    // transparent: true,
    webPreferences: {
      sandbox: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (app.isPackaged) {
    // 'build/index.html'
    // win.loadURL(`file://${__dirname}/index.html`);
    console.log(path.join(__dirname, 'index.html'));
    win.loadFile(path.join(__dirname, '../app', 'index.html'));
  } else {
    // win.loadURL(`file://${__dirname}/../../../build/dev/index.html`);
    win.loadURL('http://localhost:3000');

    win.webContents.openDevTools();

    win.webContents.on(
      'did-fail-load',
      (event, errorCode, errorDescription) => {
        console.log('Failed to load:', errorCode, errorDescription);
      }
    );

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

  Menu.setApplicationMenu(prepareAppMenus(win, appUpdater));

  win.on('ready-to-show', () => {
    win.maximize();
    win.show();
    win.focus();

    if (!appUpdater.winEventsRegistered) {
      appUpdater.registerEvents(win);
      appUpdater.checkForUpdate(false);
    }
  });
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

  ipcMain.handle('auth:github:code', async (e, clientId, scopes = []) => {
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
