// import environments
require('dotenv').config();

const webpack = require('webpack');
const path = require('path');
const metadata = require('./package.json');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

exports.common = {
  entry: {
    app: path.join(
      __dirname,
      './packages/firecamp-core/src/containers/index.tsx'
    ),
    identity: path.join(
      __dirname,
      './packages/firecamp-core/src/containers/identity.tsx'
    ),
  },
  optimization: {
    nodeEnv: process.env.NODE_ENV,
    minimize: false,
    splitChunks: {
      name: 'vendor',
      chunks(chunk) {
        // To prevent generate separate chunk for background script
        // Because all node_modules not needed in background script
        return !chunk?.name?.includes('background');
      },
    },
  },
  resolve: {
    extensions: ['*', '.mjs', '.js', '.json', '.jsx', '.ts', '.tsx', '.svg'],
    alias: {
      faker: path.resolve('./node_modules/faker'),
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      lodash: path.resolve('./node_modules/lodash'),
      nanoid: path.resolve('./node_modules/nanoid'),
      'awesome-notifications': path.resolve(
        './node_modules/awesome-notifications'
      ),
      '@babel/runtime': path.resolve('./node_modules/@babel/runtime'),
      'monaco-editor': path.resolve('./node_modules/monaco-editor'),
    },
    fallback: {
      fs: false,
    },
  },
};

exports.output = {
  globalObject: 'this',
  filename: '[name].bundle.js',
  chunkFilename: '[name].bundle.js',
};

if (process.env.NODE_ENV === 'development') {
  exports.output['path'] = path.join(__dirname, './build/dev/js');
  exports.output['clean'] = true;
} else {
  exports.output['path'] = path.join(__dirname, './build/production/js');
}

exports.env = {
  NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  FIRECAMP_API_HOST: JSON.stringify(process.env.FIRECAMP_API_HOST),
  FIRECAMP_PROXY_API_HOST: JSON.stringify(process.env.FIRECAMP_PROXY_API_HOST),
  FIRECAMP_EXTENSION_AGENT_ID: JSON.stringify(process.env.FIRECAMP_EXTENSION_AGENT_ID),
  APP_VERSION: JSON.stringify(metadata.version),
  APP_FORMAT: JSON.stringify(process.env.APP_FORMAT),
  SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
  CRISP_WEBSITE_ID: JSON.stringify(process.env.CRISP_WEBSITE_ID),
  GOOGLE_OAUTH2_CLIENT_ID: JSON.stringify(process.env.GOOGLE_OAUTH2_CLIENT_ID),
  GOOGLE_OAUTH2_REDIRECT_URI: JSON.stringify(
    process.env.GOOGLE_OAUTH2_REDIRECT_URI
  ),
  GITHUB_OAUTH2_CLIENT_ID: JSON.stringify(process.env.GITHUB_OAUTH2_CLIENT_ID),
  GITHUB_OAUTH2_REDIRECT_URI: JSON.stringify(
    process.env.GITHUB_OAUTH2_REDIRECT_URI
  ),
  GOOGLE_ANALYTICS_CHROME_ID: JSON.stringify(
    process.env.GOOGLE_ANALYTICS_CHROME_ID
  ),
  GOOGLE_ANALYTICS_ELECTRON_ID: JSON.stringify(
    process.env.GOOGLE_ANALYTICS_ELECTRON_ID
  ),
};

exports.plugins = [
  new HtmlWebpackPlugin({
    inject: false,
    template: path.join(__dirname, './build/dev/app.html'),
  }),
  new NodePolyfillPlugin(),
  new webpack.ProgressPlugin({
    entries: true,
    modules: true,
    modulesCount: 100,
    profile: true,
    handler: (percentage, message, ...args) => {
      console.clear();
      console.log((percentage * 100).toFixed() + '%', message, ...args);
    },
  }),
  new MonacoWebpackPlugin({
    // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
    globalAPI: true,
    publicPath: '/js/',
    filename: '[name].worker.bundle.js',
    languages: ['javascript', 'html', 'typescript', 'json'],
  }),
];

exports.rules = [
  { test: /\.flow$/, loader: 'ignore-loader' },
  {
    test: /\.css$/,
    use: [
      'style-loader', // creates style nodes = require( JS strings
      'css-loader', // translates CSS into CommonJS
    ],
  },
  {
    test: /\.s[ac]ss$/i,
    use: [
      'style-loader', // creates style nodes = require( JS strings
      'css-loader', // translates CSS into CommonJS
      'sass-loader', // compiles Sass to CSS
    ],
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource',
  },
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  },
];
