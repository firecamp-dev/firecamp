/* eslint-disable no-console */
require('dotenv-vault-core').config();
const { red, yellow } = require('colors');
const semver = require('semver');
require('shelljs/global');
const build = require('./build');
const { version } = require('../package.json');
const { Environment, AppFormat } = require('./constants');

const env = process.env.NODE_ENV;
const helper = {
  buildWebApp: async () => {
    process.env.NODE_OPTIONS = '--max-old-space-size=4096';
    await build();
  },
};

// set app version in the environment
process.env.APP_VERSION = version;

// check FIRECAMP_API_HOST env. variable value does not contains invalid value
const { FIRECAMP_API_HOST = '' } = process.env;
if (
  env !== Environment.Staging &&
  (FIRECAMP_API_HOST.includes('localhost') ||
    FIRECAMP_API_HOST.includes('testing') ||
    FIRECAMP_API_HOST.includes('127.0.0.1'))
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

// pre conditions can be validated here
const preBuildCliCommands = async () => Promise.resolve();

if ([Environment.Production, Environment.Staging].includes(env)) {
  try {
    preBuildCliCommands().then(async () => {
      await helper.buildWebApp();
    });
  } catch (error) {
    console.error(error);
  }
}
