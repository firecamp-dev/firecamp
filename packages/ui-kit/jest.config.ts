import React from "react";
import type {Config} from 'jest';

global.React = React;

const config: Config = {
  testEnvironment: "jsdom",
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    // "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
     "\\.(css|sass)$": "<rootDir>/__mocks__/styleMock.ts",
     "^uuid$": "uuid",
     "https": "https"
  },
};

export default config;