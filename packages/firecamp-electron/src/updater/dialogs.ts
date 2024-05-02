import { app, dialog } from 'electron';
import { UpdateInfo } from 'electron-updater';

const showUpdateDownloadedWinDialog = (win: any) => {
  const index = dialog.showMessageBoxSync(win, {
    type: 'question',
    title: '👏️ Installed New Version',
    message: 'The new version is installed. You may now restart the app.',
    detail: 'Please ensure you save any open, unsaved work before proceeding.',
    buttons: ['Cancel', 'Restart'],
  });
  if (index == 1) {
    app.relaunch();
    app.exit();
  }
};

const showUpdateDownloadedMacDialog = (win: any) => {
  const index = dialog.showMessageBoxSync(win, {
    type: 'question',
    title: '👏️ Installed New Version',
    message: 'The new version is installed. You may now restart the app.',
    detail: 'Please ensure you save any open, unsaved work before proceeding.',
    buttons: ['Cancel', 'Relaunch'],
    noLink: true,
  });
  if (index == 1) {
    app.relaunch();
    app.exit();
  }
};

const showUpdateAvailable = (win: any) => {
  const index = dialog.showMessageBoxSync(win, {
    type: 'info',
    title: 'Update Found',
    message: 'Found updates, do you want to update now?',
    buttons: ['Sure', 'No'],
  });
  if (index == 1) {
    app.relaunch();
    app.exit();
  }
};

const showNoUpdateAvailable = (win: any, info: UpdateInfo) => {
  const index = dialog.showMessageBoxSync(win, {
    type: 'info',
    title: 'No Updates Available',
    message: `No updates available. \n\n You're using the latest version Firecamp v${info.version}.`,
    buttons: ['Ok'],
  });
  if (index == 1) {
    app.relaunch();
    app.exit();
  }
};

export {
  showUpdateAvailable,
  showNoUpdateAvailable,
  showUpdateDownloadedWinDialog,
  showUpdateDownloadedMacDialog,
};
