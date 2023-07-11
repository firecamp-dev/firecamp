import { useState } from 'react';
import cx from 'classnames';
import { Button as MantineButton } from '@mantine/core';
import { Button, FirecampThemeProvider } from '@firecamp/ui';
import { EFirecampThemeVariant } from './FirecampThemeProvider.interfaces';
import FirecampThemeSelector from './FirecampThemeSelector';

export default {
  title: 'UI-Kit/Theme/FirecampThemeProvider',
  component: FirecampThemeProvider,
};

export const Example = ({ ...args }: any) => {
  const [theme, updateTheme] = useState(EFirecampThemeVariant.LightSecondary);
  return (
    <FirecampThemeProvider {...args} themeVariant={theme}>
      <div className={cx('border border-app-border rounded p-6')}>
        <span className="mx-2">Firecamp Theme Selector : </span>
        <FirecampThemeSelector theme={theme} updateCurrentTheme={updateTheme} />

        <div className="flex flex-row justify-start items-center p-2 mb-2 ">
          <div className="block text-base uppercase font-semibold text-app-foreground-inactive mb-1 mr-2">
            Mantine Button
          </div>
          <MantineButton>Button example</MantineButton>
          <MantineButton disabled>Button example</MantineButton>
        </div>
        <br />
        <div className="flex flex-row justify-start items-center p-2 mb-2 ">
          <div className="block text-base uppercase font-semibold text-app-foreground-inactive mb-1 mr-2">
            Firecamp Button
          </div>
          <Button text="Button example" primary md />
        </div>
      </div>
    </FirecampThemeProvider>
  );
};
