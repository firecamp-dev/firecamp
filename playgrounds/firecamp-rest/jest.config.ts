import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!graphql-language-service)(.*)',
    '/node_modules/(?!@react-icons/all-files)',
  ],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy',
    '!!raw-loader!./interfaces/Scripts.d': 'identity-obj-proxy', //@note keep the raw-loader.d.ts at types/
    '^uuid$': 'uuid',
    '^nanoid$': 'nanoid',
    '@react-icons': 'identity-obj-proxy',
    'monaco-editor': '<rootDir>/../../node_modules/@monaco-editor/react',
  },
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./src/setup-jest.tsx'],
};
export default config;
