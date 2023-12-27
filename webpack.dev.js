const { readFileSync } = require('fs');
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const base = require('./webpack.common');

// const withReport = process.env.npm_config_withReport;
const nodeEnv = process.env.NODE_ENV;

module.exports = merge(base, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  output: {
    clean: true,
    globalObject: 'this',
    filename: '[name].dev.js',
    chunkFilename: '[name].dev.js',
    path: `${__dirname}/build/${nodeEnv}`,
    publicPath: '',
  },
  optimization: {
    nodeEnv: 'development',
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
  devServer: {
    // server: 'https',
    // https: {
    // key: readFileSync('x-dev-certs/localhost.key.pem'),
    // cert: readFileSync('x-dev-certs/localhost.cert.pem'),
    // ca: readFileSync('x-dev-certs/ca/rootCA.pem'),
    // },
    static: path.join(__dirname, './build/development'),
    compress: true,
    port: 3000,
    open: true,
    hot: true,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin({ resourceRegExp: /[^/]+\/[\S]+.dev$/ }),
    // new BundleAnalyzerPlugin(),
  ],
});
