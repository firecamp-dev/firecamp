/* eslint-disable no-console */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const Environment = require('./environment');
const build = require('../webpack.prod');
require('shelljs/global');

module.exports = async () => {
  try {
    // const replaceTasks = [
    //   {
    //     from: path.join(
    //       __dirname,
    //       '../webpack/replace/JsonpMainTemplate.runtime.js'
    //     ),
    //     to: path.join(
    //       __dirname,
    //       '../node_modules/webpack/lib/JsonpMainTemplate.runtime.js'
    //     ),
    //   },
    //   {
    //     from: path.join(__dirname, '../webpack/replace/process-update.js'),
    //     to: path.join(
    //       __dirname,
    //       '../node_modules/webpack-hot-middleware/process-update.js'
    //     ),
    //   },
    // ];

    // // Replace webpack config path
    // replaceTasks.forEach((task) => cp(task.from, task.to));

    // Copy project assets and generate config.
    const directoryPaths = [
      path.join(`${__dirname}/../build`),
      path.join(`${__dirname}/../build/development`),
      path.join(`${__dirname}/../build/production`),
      path.join(`${__dirname}/../build/development/build-scripts`),
      path.join(`${__dirname}/../build/production/build-scripts`),
      path.join(`${__dirname}/../build/production/services`),
      path.join(`${__dirname}/../build/production/packages-executors`),
    ];

    // Hold the build path as per the environment mode
    const buildPath =
      process.env.NODE_ENV === 'development'
        ? directoryPaths[1]
        : directoryPaths[2];

    // Remove all builds before start bundle
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
      path.join(`${__dirname}/../packages/firecamp-core/public/assets/*`),
      buildPath
    );

    // generate package.json and manifest based on app environment
    if (process.env.NODE_ENV === 'development')
      exec(`node ${buildPath}/build-scripts/init-package.js`);
    else exec(`node ${buildPath}/build-scripts/init-package.js`);

    // Generate .html
    exec(
      `pug -O "{ env: '${process.env.NODE_ENV}' }" -o ${buildPath} ${path.join(
        __dirname,
        '../packages/firecamp-core/public/views/'
      )}`
    );

    cp(
      '-R',
      path.join(
        `${__dirname}/../packages/firecamp-desktop-app/public/splashscreen.html`
      ),
      `${buildPath}`
    );

    // Copy electron agent assets, config and services
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.APP_FORMAT !== 'extension'
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
      if (process.env.APP_FORMAT === 'dmg') {
        mkdir(`${buildPath}/build`);

        cp(
          '-R',
          path.join(
            `${__dirname}/../packages/firecamp-desktop-app/public/assets/${process.env.NODE_ENV}/mac/*`
          ),
          `${buildPath}/build`
        );
      }

      // Copy common assets
      cp(
        '-R',
        path.join(
          `${__dirname}/../packages/firecamp-desktop-app/public/assets/${
            [...Object.values(Environment)].includes(process.env.NODE_ENV)
              ? 'production'
              : 'canary'
          }`
        ),
        `${buildPath}/assets`
      );
    }

    if (process.env.NODE_ENV === 'production') {
      await build();
    }

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

if (process.env.NODE_ENV === 'development') {
  if (process.env.NODE_ENV === Environment.Production) {
    console.log(
      `${colors.red(
        'Error:'
      )} Invalid value set for env. variable (NODE_ENV: ${colors.yellow(
        process.env.NODE_ENV
      )})`
    );
    process.exit();
  }

  if (process.env.NODE_ENV === Environment.Development) module.exports();
}

if (process.env.NODE_ENV === 'production') {
  if (process.env.NODE_ENV === Environment.Development) {
    console.log(
      `${colors.red(
        'Error:'
      )} Invalid value set for env. variable (NODE_ENV: ${colors.yellow(
        process.env.NODE_ENV
      )})`
    );
    process.exit();
  }
}
