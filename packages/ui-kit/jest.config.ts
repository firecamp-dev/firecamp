import React from "react";
import type {Config} from 'jest';

global.React = React;

const esModules = ["nanoid"].join("|");

const config: Config = {
  testEnvironment: "jsdom",
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': ['ts-jest',   {
        babelConfig: true,
      }],
          "^.+\\.(js|jsx)$": "babel-jest"
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  moduleNameMapper: {
     "\\.(css|sass)$": "<rootDir>/__mocks__/styleMock.ts",
     "^uuid$": "uuid",
     "https": "https",
     "^nanoid(/(.*)|$)": "nanoid$1",
  },
};

export default config;