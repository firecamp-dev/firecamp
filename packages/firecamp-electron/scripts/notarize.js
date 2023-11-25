const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return notarize({
    appBundleId: process.env.appBundleId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.AID,
    appleIdPassword: process.env.APASS,
  });
};
