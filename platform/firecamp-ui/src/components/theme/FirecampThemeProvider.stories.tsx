import { useState } from 'react';
import cx from 'classnames';
import { Button as MantineButton } from '@mantine/core';
import { Button, FirecampThemeProvider } from '@firecamp/ui';
import { EFirecampThemeVariant } from './FirecampThemeProvider.interfaces';

export default {
  title: 'UI-Kit/Theme/FirecampThemeProvider',
  component: FirecampThemeProvider,
};

export const Example = ({ ...args }: any) => {
  const [theme, updateTheme] = useState(EFirecampThemeVariant.LightSecondary);
  return (
    <FirecampThemeProvider {...args} themeVariant={theme}>
      <div className="border border-app-border rounded p-6">
        <StoryTheme theme={theme} updateCurrentTheme={updateTheme} />

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

const StoryTheme = ({ theme, updateCurrentTheme }: any) => {
  const themes = [
    {
      className: 'themeBG light-green',
      value: EFirecampThemeVariant.LightSecondary,
    },
    {
      className: 'themeBG light-orange',
      value: EFirecampThemeVariant.LightPrimary,
    },
    {
      className: 'themeBG dark-green',
      value: EFirecampThemeVariant.DarkSecondary,
    },
    {
      className: 'themeBG dark-orange',
      value: EFirecampThemeVariant.DarkPrimary,
    },
  ];

  const _setTheme = (t: string) => {
    try {
      // Set app body theme - for matching tailwind theme
      document.body.className = `sb-main-padded sb-show-main" theme-${
        t.split('-')[0]
      } primary-${t.split('-')[1] === 'secondary' ? 'green' : 'orange'}`;
    } catch (error) {
      console.log({ error });
    }
    updateCurrentTheme(t);
  };

  return (
    <div className="flex flex-row justify-start items-center p-2 mb-2 ">
      <div className="block text-base uppercase font-semibold text-app-foreground-inactive mb-1 mr-2">
        Themes
      </div>
      <div className="flex">
        {themes.map((th, index) => {
          return (
            <div
              className={cx(
                {
                  active: theme === th.value,
                },
                'fc-theme'
              )}
              key={index}
              onClick={(e) => _setTheme(th.value)}
            >
              <div className={th.className}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
