const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
const base = require('./webpack.common');

const nodeEnv = process.env.NODE_ENV;

module.exports = merge(base, {
  mode: 'production',
  output: {
    clean: true,
    globalObject: 'this',
    filename: '[name].min.js',
    chunkFilename: '[name].min.js',
    path: path.join(__dirname, `./build/${nodeEnv}`),
  },
  optimization: {
    nodeEnv: 'production',
    // minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        minify: TerserPlugin.esbuildMinify,
        // terserOptions: {
        //   sourceMap: 'external',
        // },
      }),
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({ React: 'react' }),
    new webpack.IgnorePlugin({ resourceRegExp: /[^/]+\/[\S]+.prod$/ }),
    // new CompressionPlugin(),
  ],
});
