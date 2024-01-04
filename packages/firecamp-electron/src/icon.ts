const path = require('path');
const isDev = require('electron-is-dev');

let trayIcon: string;
let appIcon: string;

// dev environment tray icon paths
if (isDev) {
  if (process.platform === 'linux')
    trayIcon = path.join(__dirname, '../assets/icons/mac/64.png'); //22x22
  else if (process.platform === 'darwin')
    trayIcon = path.join(__dirname, '../assets/icons/mac/64.png'); // 16x16
  else if (process.platform === 'win32')
    trayIcon = path.join(__dirname, '.../assets/icons/mac/64.png'); //32x32
} else if (process.platform === 'linux')
  // prod. environment tray icon paths
  trayIcon = path.join(process.resourcesPath, 'assets/icons/mac/64.png');
// 22x22
else if (process.platform === 'darwin')
  trayIcon = path.join(process.resourcesPath, 'assets/icons/images/16x16.png');
// 16x16
else if (process.platform === 'win32')
  trayIcon = path.join(process.resourcesPath, 'assets/icons/mac/64.png'); // 32x32

// App icon paths
if (process.platform === 'linux')
  appIcon = path.join(__dirname, '../assets/icons/mac/512x512.png');
else if (process.platform === 'darwin')
  appIcon = path.join(__dirname, '../assets/mac/icon.icns');
else if (process.platform === 'win32')
  appIcon = path.join(__dirname, '../assets/icons/win/icon.ico');

export { appIcon, trayIcon };
