const { app, dialog } = require('electron');
import {
  autoUpdater,
  ProgressInfo,
  UpdateInfo,
  UpdaterEvents,
} from 'electron-updater';
import log from 'electron-log';
import * as isDev from 'electron-is-dev';
import {
  showNoUpdateAvailable,
  showUpdateDownloadedWinDialog,
  showUpdateDownloadedMacDialog,
} from './dialogs';

export class AppUpdater {
  newVersion: number | null;
  showDialog: boolean;
  // autoUpdate: boolean;
  winEventsRegistered: boolean;
  // notifyUpdateDownloaded: boolean;
  constructor() {
    this.newVersion = null;
    this.showDialog = false;
    // this.autoUpdate = false;
    // this.notifyUpdateDownloaded = true;
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
      console.log('the update is available');
      this.newVersion = info.version;
      // auto start downloading if found update
      autoUpdater.downloadUpdate();
    });

    autoUpdater.on('download-progress', (progress: ProgressInfo) => {
      // console.log('the update download progress is ', progress);
      win.webContents.send('download-progress', {
        version: this.newVersion || 'New Version',
        percentage: `${Math.floor(progress.percent)}%`,
      });
    });

    autoUpdater.on('update-not-available', (info: UpdateInfo) => {
      // console.log('the update is bot available ', info);
      win.webContents.send('app_update_timeline', 'Update-Not-Available');
      if (this.showDialog) {
        this.showDialog = false;
        showNoUpdateAvailable(win, info);
      }
    });

    autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
      // console.log('the update has been downloaded ', info);
      win.webContents.send('update-downloaded', { version: info.version });
      showUpdateDownloadedWinDialog(win); // currently the win and mac both have the same dialog modal
      // showUpdateDownloadedMacDialog(win);
    });

    autoUpdater.on('error', (error: any) => {
      console.log('the update has an error ', error);
      win.webContents.send(
        'app_update_timeline',
        `Error on update: ${error.message.toString()}`
      );
    });
  }

  checkForUpdate(showDialog: boolean) {
    console.log('checking updates...');
    if (showDialog) this.showDialog = true;
    autoUpdater.checkForUpdatesAndNotify();
  }
}
