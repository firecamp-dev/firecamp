import { app, BrowserWindow, ipcMain, screen } from 'electron';
import RestExecutor from '@firecamp/rest-executor';

// initialize the rest executor
// const httpExecutor = new HttpExecutor();

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({ width, height });

  if (app.isPackaged) {
    // 'build/index.html'
    // win.loadURL(`file://${__dirname}/../../build/prod/index.html`);
  } else {
    win.loadURL(`file://${__dirname}/../../../build/dev/index.html`);
    // win.loadURL('http://localhost:3000');

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

  ipcMain.handle('http:send', async () => {
    return RestExecutor;
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
