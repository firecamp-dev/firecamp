const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const base = require('./webpack.common');

const withReport = process.env.npm_config_withReport;

module.exports = merge(base, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  output: { clean: true },
  optimization: {
    nodeEnv: 'development'
  },
  devServer: {
    //server: 'https',
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
