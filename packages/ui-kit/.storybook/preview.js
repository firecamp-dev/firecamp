//to access tailwind.scss styles everywhere in project
import '../src/scss/tailwind.scss';
import { withTests } from '@storybook/addon-jest';
import results from '../.jest-test-results.json';


export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
export const decorators = [
  withTests({
    results,
  }),
];
