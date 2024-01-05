import { app, dialog } from 'electron';
import { UpdateInfo } from 'electron-updater';

const showUpdateDownloadedWinDialog = (win: any) => {
  dialog.showMessageBoxSync(win, {
    type: 'question',
    title: '👏️ Installed New Version',
    message:
      'New version has been installed successfully, You can restart the app',
    detail:
      'Please save your unsaved tabs first if you are in-between your work.',
    buttons: ['Cancel', 'Restart'],
  });
};

const showUpdateDownloadedMacDialog = (win: any) => {
  dialog.showMessageBoxSync(win, {
    type: 'question',
    title: '👏️ Installed New Version',
    message:
      'New version has been installed successfully, You can restart the app',
    detail:
      // 'New updates are installed successfully, It will get reflected after app relaunch',
      'Please save your unsaved tabs first if you are in-between your work.',
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
