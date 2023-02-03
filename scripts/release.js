/* eslint-disable no-console */
require('dotenv').config();
const { red, yellow } = require('colors');
const semver = require('semver');
require('shelljs/global');
const build = require('./build');
const { version } = require('../package.json');
const { Environment, AppFormat } = require('./constants');

const env = process.env.NODE_ENV;

/**
 * 1. test variables
 */

const validator = {
  /** validate project version  */
  version: () => {
    if (!semver.valid(version)) {
      console.log(
        `${red('Error:')} invalid project version(${yellow(version)})`
      );
      process.exit();
    }
  },

  /** validate env variables  */
  variables: () => {
    const variables = [
      'FIRECAMP_API_HOST',
      'CSC_KEY_PASSWORD',
      'CSC_LINK',
      'DO_KEY_ID',
      'DO_SECRET_KEY',
    ];

    // Check if environment variables set
    variables.forEach((variable) => {
      if (
        !process.env.variable ||
        typeof process.env[variable] === 'undefined' ||
        process.env[variable].length < 5
      ) {
        console.log(
          `${red('Error:')} Env. variable ${yellow(variable)} not set`
        );
        process.exit();
      }
    });
  },
};

const helper = {
  buildWebApp: async () => {
    process.env.NODE_OPTIONS = '--max-old-space-size=4096';

    await build();

    // Finished the process if build=chrome
    if (process.env.AppFormat === AppFormat.WebApp) {
      // remove unused packages
      rm('-rf', `build/${env}/build-scripts`);
      rm('-rf', `build/${env}/packages-executors`);
      rm('-rf', `build/${env}/services`);

      // remove chrome extension app files // TODO: remove it later
      rm('-rf', `build/${env}/splashscreen.html`);
      rm('-rf', `build/${env}/manifest.json`);
      rm('-rf', `build/${env}/background.html`);
      rm('-rf', `build/${env}/window.html`);

      process.exit();
    }
  },
};

// set app version in the environment
process.env.APP_VERSION = version;

// check FIRECAMP_API_HOST env. variable value does not contains invalid value
if (
  env !== Environment.Staging &&
  (process.env.FIRECAMP_API_HOST.includes('localhost') ||
    process.env.FIRECAMP_API_HOST.includes('testing') ||
    process.env.FIRECAMP_API_HOST.includes('127.0.0.1'))
) {
  console.log(
    `${red(
      'Error:'
    )} invalid value set for env. variable (FIRECAMP_API_HOST ${yellow(
      process.env.FIRECAMP_API_HOST
    )})`
  );
  process.exit();
}

const _exec = (command) =>
  new Promise((resolve) => {
    let result;

    const _command = exec(command, { async: true, silent: true });

    _command.stdout.on('data', (data) => {
      result = data.toString();
    });

    _command.on('close', (code) => {
      if (code !== 0) {
        console.error(
          `
${red('Error: ')}Failed to execute command: ${command}`
        );

        process.exit();
      } else {
        console.log(`
✅ ${command} executed successfully`);

        resolve(result);
      }
    });
  });

const preBuildCliCommands = async () => {
  // Prevent check git tag while staging build
  if (env === Environment.Staging) return Promise.resolve();

  // Check is tag was checked out or not
  // await _exec('git describe --tags', { async: true })
  //   .then((result) => {
  //     console.log(result);
  //     if (result.replace(/\n/g, '') !== `v${version}`) {
  //       console.log(
  //         `${red('Error:')} Please checkout tag '${yellow(
  //           `v${version}`
  //         )}' for release`
  //       );
  //       process.exit();
  //     } else return Promise.resolve();
  //   })
  //   .catch((e) => {
  //     console.log(e, 'this is the error');
  //   });
};

if (env === Environment.Staging) {
  helper.buildWebApp();
}
if (env === Environment.Production) {
  try {
    preBuildCliCommands().then(async () => {
      await helper.buildWebApp();

      // Set bundle id for electron app
      if (env === Environment.Production)
        process.env.appBundleId = 'com.firecamp.app';
      else if (env === Environment.Canary)
        process.env.appBundleId = 'com.firecamp.canary';

      // Copy release note and post build checks
      cp(
        '-R',
        'packages/firecamp-desktop-app/public/release-notes.md',
        'build/production'
      );

      // Remove chrome extension app files
      rm('-rf', 'build/production/background.html');
      rm('-rf', 'build/production/window.html');
      rm('-rf', 'build/production/js/background.bundle.js');

      // Add library: electron
      cd('build/production');
      exec(
        'export NODE_ENV=development && pnpm install && pnpm add_electron && export NODE_ENV=production'
      );

      // Add library: electron-oauth-helper
      exec('pnpm add ../../../firecamp-forks/electron-oauth-helper -W');

      // Prepare linux os 'AppImage' build
      if (process.env.AppFormat === AppFormat.AppImage) {
        // do not publish the app
        if (process.argv[3] === 'l') exec('electron-builder --linux AppImage');

        // publish the app
        if (process.argv[3] === 'p') {
          exec(
            'electron-builder --linux AppImage -p always -c.releaseInfo.releaseNotesFile=release-notes.md'
          );

          // Get the hash value of the AppImage build
          const shasum = await _exec(
            `shasum -a 256 ./dist/Firecamp-${process.env.APP_VERSION}.AppImage`
          );

          console.log(`${yellow('shasum:')} ${shasum}`);
        }
      }

      // Prepare linux os 'Snap' build
      if (process.env.AppFormat === AppFormat.Snap) {
        // do not publish the app
        if (process.argv[3] === 'l') exec('electron-builder --linux Snap');

        // publish the app
        if (process.argv[3] === 'p')
          exec('electron-builder --linux Snap -p always');
      }

      // Prepare windows os 'nsis' build
      if (process.env.AppFormat === AppFormat.NSIS) {
        // do not publish the app
        if (process.argv[3] === 'l') exec('electron-builder --win');

        // publish the app
        if (process.argv[3] === 'p') {
          exec(
            'electron-builder --win -p always -c.releaseInfo.releaseNotesFile=release-notes.md'
          );

          // Get the hash value of the nsis build
          const shasum = await _exec(
            `shasum -a 256 ./dist/Firecamp-${process.env.APP_VERSION}.exe`
          );

          console.log(`${yellow('shasum:')} ${shasum}`);
        }
      }

      // Prepare mac os 'dmg' build
      if (process.env.AppFormat === AppFormat.Dmg) {
        // do not publish the app
        if (process.argv[3] === 'l') exec('electron-builder --mac');

        // publish the app
        if (process.argv[3] === 'p') {
          exec(
            'electron-builder --mac -p always -c.releaseInfo.releaseNotesFile=release-notes.md'
          );

          // Get the hash value of the nsis build
          const shasum = await _exec(
            `shasum -a 256 ./dist/Firecamp-${process.env.APP_VERSION}.dmg`
          );

          console.log(`${yellow('shasum:')} ${shasum}`);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
}
