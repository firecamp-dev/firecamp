/* eslint-disable no-console */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
require('shelljs/global');
const { Environment, AppFormat } = require('./constants');
const build = require('../webpack.prod');

const env = process.env.NODE_ENV;

module.exports = async () => {
  try {
    // hold the build path as per the environment mode
    const buildPath = path.join(`${__dirname}/../build/${env}`);
    // copy project assets and generate config.
    const directoryPaths = [path.join(`${__dirname}/../build`), buildPath];

    // Remove build before start bundle
    rm('-rf', buildPath);

    // Create build directories
    directoryPaths.forEach((directoryPath) => {
      if (!fs.existsSync(directoryPath)) mkdir(directoryPath);
    });

    // Copy react app assets
    cp(
      '-R',
      path.join(`${__dirname}/../platform/firecamp-platform/public/assets/*`),
      buildPath
    );

    // generate package.json and manifest based on app environment
    // exec(`node ${buildPath}/build-scripts/init-package.js`);

    if (env === Environment.Production || env === Environment.Staging) {
      await build();
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

if (env === Environment.Development) module.exports();
