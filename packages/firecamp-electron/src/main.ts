const { app, BrowserWindow } = require('electron');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

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
});
