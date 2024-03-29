import React from 'react';
import type { Config } from 'jest';

global.React = React;

const esModules = ['nanoid'].join('|');

const config: Config = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': [
      'ts-jest',
      {
        babelConfig: true,
      },
    ],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
    '@react-icons/all-files/lib/esm':
      '<rootDir>/../../node_modules/@react-icons/all-files',
    '\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.ts',
    '\\.(txt)$': '<rootDir>/../../node_modules/raw-loader',
    '^nanoid(/(.*)|$)': 'nanoid$1',
    '^monaco-editor': '<rootDir>/__mocks__/monacoMock.ts',
    '^@monaco-editor/react':
      '<rootDir>/../../node_modules/@monaco-editor/react',
    '@firecamp/rest-executor/dist/esm':
      '<rootDir>/../firecamp-rest-executor/dist/esm/index.d.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/__mocks__/testSetupFile.ts'],
};

export default config;
