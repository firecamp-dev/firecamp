const path = require('path');
module.exports = {
  stories: [
    '../src/stories/**/*.stories.mdx',
    '../src/stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/components/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-jest'
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: (config) => {
    // add SCSS support for CSS Modules
    config.module.rules.push({
      test: /\.s[ac]ss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    // add postcss-loader for tailwindcss
    config.module.rules.push({
      test: /\.css$/,
      use: [
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [require('tailwindcss'), require('autoprefixer')],
            },
          },
        },
      ],
      include: path.resolve(__dirname, '../'),
    });

    config.module.rules.push({
        test: /\.txt$/,
        use: ['raw-loader'],
        include: path.resolve(__dirname, '../'),
    })

    config.resolve.alias = {
      ...config.resolve.alias,
      "@firecamp/rest-executor/dist/esm": path.join(__dirname,"../../firecamp-rest-executor/dist/esm/script-runner/snippets/index.js")
      
    //   "https": path.join(__dirname, "../../../node_modules/@types/node/https")
    //   "react/jsx-dev-runtime": path.join(__dirname, "../../../node_modules/react/jsx-dev-runtime.js"),
    //   "react/jsx-runtime": path.join(__dirname, "../../../node_modules/react/jsx-runtime.js")
    }
    // console.log(config);
    config.externals = {
      ...config.externals,
      vscode: 'commonjs vscode', // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    };

    return config;
  },
};
