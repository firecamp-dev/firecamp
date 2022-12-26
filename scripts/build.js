/* eslint-disable no-console */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
// const colors = require('colors');
const { Environment, AppFormat } = require('./constants');
const build = require('../webpack.prod');
require('shelljs/global');

const env = process.env.NODE_ENV;

module.exports = async () => {
  try {
    // hold the build path as per the environment mode
    const buildPath = path.join(`${__dirname}/../build/${env}`);
    // copy project assets and generate config.
    const directoryPaths = [path.join(`${__dirname}/../build`), buildPath];
    if (env === Environment.Development) {
      directoryPaths.push(
        path.join(`${__dirname}/../build/${env}/build-scripts`)
      );
    }
    if (env === Environment.Production) {
      directoryPaths.push(
        path.join(`${__dirname}/../build/${env}/build-scripts`),
        path.join(`${__dirname}/../build/${env}/services`),
        path.join(`${__dirname}/../build/${env}/packages-executors`)
      );
    }

    // Remove build before start bundle
    rm('-rf', buildPath);

    // Create build directories
    directoryPaths.forEach((directoryPath) => {
      if (!fs.existsSync(directoryPath)) mkdir(directoryPath);
    });

    // Copy build-scripts to generate build
    // cp(
    //   '-R',
    //   path.join(
    //     `${__dirname}/../packages/firecamp-desktop-app/src/build-scripts/*`
    //   ),
    //   `${buildPath}/build-scripts`
    // );

    // Copy react app assets
    cp(
      '-R',
      path.join(
        `${__dirname}/../packages/firecamp-platform/public/assets/*`
      ),
      buildPath
    );

    // generate package.json and manifest based on app environment
    // exec(`node ${buildPath}/build-scripts/init-package.js`);

    // Generate .html
    // exec(
    //   `pug -O "{ env: '${env}' }" -o ${buildPath} ${path.join(
    //     __dirname,
    //     '../packages/firecamp-platform/public/views/'
    //   )}`
    // );

    // cp(
    //   '-R',
    //   path.join(
    //     `${__dirname}/../packages/firecamp-desktop-app/public/splashscreen.html`
    //   ),
    //   `${buildPath}`
    // );

    // Copy electron agent assets, config and services
    if (
      env === Environment.Production &&
      process.env.AppFormat !== AppFormat.WebApp
    ) {
      // Copy electron agent services
      cp(
        '-R',
        path.join(
          `${__dirname}/../packages/firecamp-desktop-app/dist/services/*`
        ),
        `${buildPath}/services`
      );

      // Copy http executor
      cp(
        '-R',
        path.join(`${__dirname}/../packages-executors/*`),
        `${buildPath}/packages-executors`
      );

      // Copy dmg app assets
      if (process.env.AppFormat === AppFormat.Dmg) {
        mkdir(`${buildPath}/build`);

        cp(
          '-R',
          path.join(
            `${__dirname}/../packages/firecamp-desktop-app/public/assets/${env}/mac/*`
          ),
          `${buildPath}/build`
        );
      }

      // Copy common assets
      cp(
        '-R',
        path.join(
          `${__dirname}/../packages/firecamp-desktop-app/public/assets/${
            [...Object.values(Environment)].includes(env)
              ? 'production'
              : 'canary'
          }`
        ),
        `${buildPath}/assets`
      );
    }

    if (env === Environment.Production || env === Environment.Staging) {
      await build();
    }

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

if (env === Environment.Development) module.exports();
