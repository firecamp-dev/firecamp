/* eslint-disable no-console */
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
const base = require('./webpack.common');

const nodeEnv = process.env.NODE_ENV;

const config = merge(base, {
  mode: 'production',
  output: {
    globalObject: 'this',
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.join(__dirname, `./build/${nodeEnv}`),
  },
  optimization: {
    nodeEnv: 'production',
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: 2,
      }),
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new webpack.IgnorePlugin({ resourceRegExp: /[^/]+\/[\S]+.prod$/ }),
    // new CompressionPlugin(),
  ],
});

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
