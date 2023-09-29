import { useState } from 'react';
import { withTests } from '@storybook/addon-jest';
import { addDecorator } from '@storybook/react';

// make sure to import css scripts in order 1. preflight, 2. mantine Core, 3. tailwind styles
import '../src/scss/preflight.css';
import '@mantine/core/styles.css';
import '../src/scss/tailwind.scss';

import results from '../.jest-test-results.json';

import FirecampThemeSelector from '../src/components/theme/FirecampThemeSelector';
import FirecampThemeProvider from '../src/components/theme/FirecampThemeProvider';
import { EFirecampThemeVariant } from '../src/components/theme/FirecampThemeProvider.interfaces';

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

//adding globally theme-selection
addDecorator((story) => {
  const [theme, updateTheme] = useState(EFirecampThemeVariant.LightSecondary);

  return (
    <FirecampThemeProvider themeVariant={theme}>
      <StoryTheme theme={theme} updateTheme={updateTheme} />
      {story()}
    </FirecampThemeProvider>
  );
});

const StoryTheme = ({ theme, updateTheme }) => {
  return (
    <div className="flex flex-row justify-end items-center p-2 mb-2 ">
      <FirecampThemeSelector theme={theme} updateCurrentTheme={updateTheme} />
    </div>
  );
};
