/* eslint-disable no-console */
require('dotenv').config();
const colors = require('colors');
const semver = require('semver');
require('shelljs/global');
const build = require('./build');
const { version } = require('../package.json');

const Environment = require('./environment');

const variables = [
  // 'FIRECAMP_API_HOST',
  // 'CSC_KEY_PASSWORD',
  // 'CSC_LINK',
  // 'DO_KEY_ID',
  // 'DO_SECRET_KEY',
];

// Validate project version
if (!semver.valid(version)) {
  console.log(
    `${colors.red('Error:')} Invalid project version(${colors.yellow(version)})`
  );
  process.exit();
}

// Set app version in the environment
process.env.APP_VERSION = version;

// Set release server production/staging/canary
// eslint-disable-next-line prefer-destructuring
process.env.RELEASE_SERVER = process.argv[2];

// Check if environment variables set
variables.forEach((variable) => {
  if (
    !(variable in process.env) ||
    typeof process.env[variable] === 'undefined' ||
    process.env[variable].length < 5
  ) {
    console.log(
      `${colors.red('Error:')} Env. variable ${colors.yellow(variable)} not set`
    );
    process.exit();
  }
});

// Check FIRECAMP_API_HOST env. variable value does not contains invalid value
if (
  process.env.NODE_ENV !== Environment.Staging &&
  (process.env.FIRECAMP_API_HOST.includes('localhost') ||
    process.env.FIRECAMP_API_HOST.includes('testing') ||
    process.env.FIRECAMP_API_HOST.includes('127.0.0.1'))
) {
  console.log(
    `${colors.red(
      'Error:'
    )} Invalid value set for env. variable (FIRECAMP_API_HOST ${colors.yellow(
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
${colors.red('Error: ')}Failed to execute command: ${command}`
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
  if (process.env.NODE_ENV === Environment.Staging) return Promise.resolve();

  // Check is tag was checked out or not
  // await _exec('git describe --tags', { async: true })
  //   .then((result) => {
  //     console.log(result);
  //     if (result.replace(/\n/g, '') !== `v${version}`) {
  //       console.log(
  //         `${colors.red('Error:')} Please checkout tag '${colors.yellow(
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

if (process.env.NODE_ENV === Environment.Production) {
  try {
    preBuildCliCommands().then(async () => {
      /**
       * Setting environments
       */
      process.env.NODE_OPTIONS = '--max-old-space-size=4096';

      await build();

      // Finished the process if build=chrome
      if (['extension', 'webapp'].includes(process.env.APP_FORMAT)) {
        // Remove unused packages
        rm('-rf', 'build/production/build-scripts');
        rm('-rf', 'build/production/packages-executors');
        rm('-rf', 'build/production/services');

        if (process.env.APP_FORMAT === 'webapp') {
          // Remove chrome extension app files
          rm('-rf', 'build/production/splashscreen.html');
          rm('-rf', 'build/production/manifest.json');
          rm('-rf', 'build/production/background.html');
          rm('-rf', 'build/production/window.html');
          // TODO: Why it's created
          rm('-rf', 'build/production/js/index.html');
          rm('-rf', 'build/production/js/background.bundle.js');
        }

        process.exit();
      }

      // Set bundle id for electron app
      if (process.env.NODE_ENV === Environment.Production)
        process.env.appBundleId = 'com.firecamp.app';
      else if (process.env.NODE_ENV === Environment.Canary)
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
        'export NODE_ENV=development && yarn install && yarn add_electron && export NODE_ENV=production'
      );

      // Add library: electron-oauth-helper
      exec('yarn add ../../../firecamp-forks/electron-oauth-helper -W');

      // Prepare linux os 'AppImage' build
      if (process.env.APP_FORMAT === 'appImage') {
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

          console.log(`${colors.yellow('shasum:')} ${shasum}`);
        }
      }

      // Prepare linux os 'Snap' build
      if (process.env.APP_FORMAT === 'snap') {
        // do not publish the app
        if (process.argv[3] === 'l') exec('electron-builder --linux Snap');

        // publish the app
        if (process.argv[3] === 'p')
          exec('electron-builder --linux Snap -p always');
      }

      // Prepare windows os 'nsis' build
      if (process.env.APP_FORMAT === 'nsis') {
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

          console.log(`${colors.yellow('shasum:')} ${shasum}`);
        }
      }

      // Prepare mac os 'dmg' build
      if (process.env.APP_FORMAT === 'dmg') {
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

          console.log(`${colors.yellow('shasum:')} ${shasum}`);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
}
