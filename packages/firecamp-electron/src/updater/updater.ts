const { app, dialog } = require('electron');
import { autoUpdater, UpdaterEvents } from 'electron-updater';
import log from 'electron-log';
const isDev = require('electron-is-dev');
import { showNoUpdateAvailable } from './dialogs';

export class AppUpdate {
  newVersion: number | null;
  showMsg: boolean;
  autoUpdate: boolean;
  winEventsRegistered: boolean;
  notifyUpdateDownloaded: boolean;
  constructor() {
    this.newVersion = null;
    this.showMsg = true;
    this.autoUpdate = false;
    this.notifyUpdateDownloaded = true;
    this.winEventsRegistered = false;

    log.transports.file.level = 'debug';
    autoUpdater.logger = log;
    autoUpdater.forceDevUpdateConfig = isDev;
    autoUpdater.autoDownload = false;
    autoUpdater.allowDowngrade = false;
  }

  registerEvents(win: any) {
    this.winEventsRegistered = true;
    autoUpdater.on('update-available', (info: any) => {
      this.newVersion = info.version;
      // Auto start downloading if found update
      autoUpdater.downloadUpdate();
    });

    autoUpdater.on('download-progress', (progress: any) => {
      win.webContents.send('download-progress', {
        version: this.newVersion || 'New Version',
        percentage: `${Math.floor(progress.percent)}%`,
      });
    });

    autoUpdater.on('update-not-available', () => {
      win.webContents.send('app_update_timeline', 'Update-Not-Available');
      if (this.showMsg) {
        console.log(app.getVersion());
        showNoUpdateAvailable(win);
      }
    });

    autoUpdater.on('update-downloaded', (info: any) => {
      win.webContents.send('update-downloaded', {
        version: info.version,
      });
    });

    autoUpdater.on('error', (error: any) => {
      win.webContents.send(
        'app_update_timeline',
        `Error on update: ${error.message.toString()}`
      );
    });
  }

  checkForUpdate() {
    autoUpdater.checkForUpdatesAndNotify();
  }
}
