// imports environment
require('dotenv').config();

const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { common, env, plugins, rules, output } = require('./webpack.config');

const withReport = process.env.npm_config_withReport;

module.exports = {
  ...common,
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
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
  output,
  plugins: [
    ...plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin({ resourceRegExp: /[^/]+\/[\S]+.dev$/ }),
    new webpack.DefinePlugin({
      'process.env': {
        ...env,
        FIRECAMP_EXTENSION_AGENT_ID: JSON.stringify(
          process.env.FIRECAMP_EXTENSION_AGENT_ID
        ),
      },
    }),
    // new BundleAnalyzerPlugin(),
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
          ],
        },
      },
    ],
  },
};
