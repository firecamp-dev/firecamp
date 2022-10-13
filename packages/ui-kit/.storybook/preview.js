//to access tailwind.scss styles everywhere in project
import '../src/scss/tailwind.scss';
import { withTests } from '@storybook/addon-jest';
import { addDecorator } from "@storybook/react";
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

//adding globally theme-light by default
addDecorator((story) => {
  document.body.classList.add("theme-light", "primary-orange");
  return story() //<div className='text-appForeground'>{story()}</div>
})
