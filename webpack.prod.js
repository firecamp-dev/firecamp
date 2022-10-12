/* eslint-disable no-console */
const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const { common, env, plugins, rules } = require('./webpack.config');

const nodeEnv = process.env.NODE_ENV;
const config = {
  ...common,
  mode: 'production',
  output: {
    globalObject: 'this',
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.join(__dirname, `./build/${nodeEnv}`),
  },
  plugins: [
    ...plugins,
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new webpack.IgnorePlugin({ resourceRegExp: /[^/]+\/[\S]+.prod$/ }),
    new webpack.DefinePlugin({
      'process.env': env,
    }),
    new CompressionPlugin(),
  ],
  module: {
    rules: [
      ...rules,
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            [
              '@babel/preset-react',
              {
                runtime: 'automatic',
              },
            ],
            '@babel/preset-typescript',
          ],
          plugins: [
            [
              '@babel/plugin-transform-runtime',
              {
                regenerator: true,
              },
            ],
            ['@babel/plugin-proposal-export-default-from'],
            'add-module-exports',
            ['transform-remove-console', { exclude: ['info'] }],
          ],
        },
      },
    ],
  },
};

module.exports = () =>
  new Promise((resolve, reject) => {
    console.log('[Webpack Build]');
    console.log('-'.repeat(80));

    const compiler = webpack(config);

    compiler.run((err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }

        reject(err.stack || err.details || err);
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);

        reject(info.errors);
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }

      resolve();
    });
  });
