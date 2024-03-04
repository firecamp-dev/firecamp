const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
  console.log('notarisation started manually.');
  const { electronPlatformName, appOutDir } = context;
  if (
    electronPlatformName !== 'darwin' ||
    !process.env.AID ||
    !process.env.APASS
  ) {
    console.log(
      'not running notarize. platform is not macos or environment not set up.'
    );
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  try {
    return await notarize({
      appBundleId: process.env.appBundleId,
      appPath: `${appOutDir}/${appName}.app`,
      appleId: process.env.AID,
      appleIdPassword: process.env.APASS,
    });
  } catch (e) {
    console.log('notarize error', e);
  }
};
