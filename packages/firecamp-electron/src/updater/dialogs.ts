const { app, dialog } = require('electron');

const showUpdateDownloadedWinDialog = (win: any) => {
  dialog.showMessageBoxSync(win, {
    type: 'question',
    title: '👏️Install updates',
    message:
      'New updates are installed successfully, It will get reflected after app relaunch',
    detail:
      'Please save your unsaved tabs first if you are in-between your work.',
    buttons: ['Cancel', 'Relaunch'],
  });
};

const showUpdateDownloadedMacDialog = (win: any) => {
  dialog.showMessageBoxSync(win, {
    type: 'question',
    title: '👏️Install updates',
    message: 'Updates downloaded, It’ll get auto-installed on the restart.',
    detail:
      'New updates are installed successfully, It will get reflected after app relaunch',
    buttons: ['Cancel', 'Relaunch'],
    noLink: true,
  });
};

const showUpdateAvailable = (win: any) => {
  dialog.showMessageBoxSync(win, {
    type: 'info',
    title: 'Found Updates',
    message: 'Found updates, do you want to update now?',
    buttons: ['Sure', 'No'],
  });
};

const showNoUpdateAvailable = (win: any) => {
  dialog.showMessageBoxSync(win, {
    type: 'info',
    title: 'No Updates Available',
    message: 'The current app version is up-to-date',
    buttons: ['Ok'],
  });
};

export {
  showUpdateAvailable,
  showNoUpdateAvailable,
  showUpdateDownloadedWinDialog,
  showUpdateDownloadedMacDialog,
};
