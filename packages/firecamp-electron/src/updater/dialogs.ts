import { app, dialog } from 'electron';
import { UpdateInfo } from 'electron-updater';

const showUpdateDownloadedWinDialog = (win: any) => {
  dialog.showMessageBoxSync(win, {
    type: 'question',
    title: '👏️ Installed New Version',
    message: 'The new version is installed. You may now restart the app.',
    detail: 'Please ensure you save any open, unsaved work before proceeding.',
    buttons: ['Cancel', 'Restart'],
  });
};

const showUpdateDownloadedMacDialog = (win: any) => {
  dialog.showMessageBoxSync(win, {
    type: 'question',
    title: '👏️ Installed New Version',
    message: 'The new version is installed. You may now restart the app.',
    detail: 'Please ensure you save any open, unsaved work before proceeding.',
    buttons: ['Cancel', 'Relaunch'],
    noLink: true,
  });
};

const showUpdateAvailable = (win: any) => {
  dialog.showMessageBoxSync(win, {
    type: 'info',
    title: 'Update Found',
    message: 'Found updates, do you want to update now?',
    buttons: ['Sure', 'No'],
  });
};

const showNoUpdateAvailable = (win: any, info: UpdateInfo) => {
  dialog.showMessageBoxSync(win, {
    type: 'info',
    title: 'No Updates Available',
    message: `No updates available. \n\n You're using the latest version Firecamp v${info.version}.`,
    buttons: ['Ok'],
  });
};

export {
  showUpdateAvailable,
  showNoUpdateAvailable,
  showUpdateDownloadedWinDialog,
  showUpdateDownloadedMacDialog,
};
