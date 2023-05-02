import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  setupFilesAfterEnv: ['./jest.setup.ts'],
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.esm.json',
    },
  },
  verbose: true,
  testPathIgnorePatterns: [],
};
export default config;
