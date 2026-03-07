import { Menu, app, shell } from 'electron';
import * as isDev from 'electron-is-dev';
const { execFile } = require('child_process');
import { AppUpdater } from './updater/updater';

const prepareAppMenus = (win: any, appUpdater: AppUpdater) => {
  return Menu.buildFromTemplate([
    {
      label: '&Menu',
      submenu: [
        {
          role: 'minimize',
        },
        {
          type: 'separator',
        },
        {
          label: 'Restart',
          click() {
            const options = {
              args: process.argv.slice(1).concat(['--relaunch']),
              execPath: process.execPath,
            };

            // Fix for .AppImage
            if (app.isPackaged && process.env.APPIMAGE) {
              execFile(process.env.APPIMAGE, options.args);
              app.quit();
              return;
            }

            app.relaunch(options);
            app.quit();
          },
        },
        {
          type: 'separator',
        },
        {
          role: 'hide',
          label: 'Hide Firecamp',
          accelerator: 'CmdOrCtrl+H',
          click() {
            app.hide();
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          role: 'quit',
        },
      ],
    },
    {
      role: 'editMenu',
    },
    {
      label: '&View',
      submenu: [
        {
          role: 'reload',
        },
        {
          type: 'separator',
        },
        {
          role: 'zoomIn',
        },
        {
          role: 'zoomOut',
        },
        {
          role: 'resetZoom',
        },
        {
          type: 'separator',
        },
        {
          role: 'toggleDevTools',
          //   accelerator: isDev
          //     ? 'CmdOrCtrl+Shift+<'
          //     : process.platform === 'darwin'
          //     ? 'Cmd+Shift+!'
          //     : 'Ctrl+Shift+#',
        },
        {
          type: 'separator',
        },
        {
          role: 'togglefullscreen',
        },
      ],
    },
    {
      label: '&Info',
      submenu: [
        {
          label: 'Follow us @Firecamp',
          click() {
            shell.openExternal('https://twitter.com/firecamp-dev');
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Release Notes',
          click() {
            shell.openExternal(
              `https://github.com/firecamp-dev/firecamp/releases/tag/v${app.getVersion()}`
            );
          },
        },
        {
          label: 'About Firecamp',
          click() {
            shell.openExternal('https://firecamp.io');
          },
        },
        {
          label: 'Check for updates',
          visible: true,
          click() {
            appUpdater.checkForUpdate(true);
          },
        },
        {
          type: 'separator',
        },
        {
          label: `Version ${app.getVersion()}`,
          enabled: false,
        },
      ],
    },
  ]);
};

export { prepareAppMenus };
