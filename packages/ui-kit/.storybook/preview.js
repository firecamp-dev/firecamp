//to access tailwind.scss styles everywhere in project
import '../src/scss/tailwind.scss';
import { useState, useEffect } from "react";
import { withTests } from '@storybook/addon-jest';
import { addDecorator } from "@storybook/react";
import cx from 'classnames';
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

//adding globally theme-selection
addDecorator((story) => {
  return <div>
    <StoryTheme initialClassName="sb-main-padded sb-show-main"/>
    {story()}
    </div>
})


const StoryTheme = ({initialClassName = ""}) => {
const STORY_THEME = {
  mode: {
  Light: 'light',
  Dark: 'dark',
  },
  color: {
  Green : 'green',
  Orange : 'orange',
  }
}

    const themes = [
    {
      className: 'themeBG light-green',
      value: {
        name: 'theme-light primary-green',
        class: 'theme-light primary-green',
        mode: STORY_THEME.mode.Light,
        color: STORY_THEME.color.Green,
      },
    },
    {
      className: 'themeBG light-orange',
      value: {
        name: 'theme-light primary-orange',
        class: 'theme-light primary-orange',
        mode: STORY_THEME.mode.Light,
        color: STORY_THEME.color.Orange,
      },
    },
    {
      className: 'themeBG dark-green',
      value: {
        name: 'theme-dark primary-green',
        class: 'theme-dark primary-green',
        mode: STORY_THEME.mode.Dark,
        color: STORY_THEME.color.Green,
      },
    },
    {
      className: 'themeBG dark-orange',
      value: {
        name: 'theme-dark primary-orange',
        class: 'theme-dark primary-orange',
        mode: STORY_THEME.mode.Dark,
        color: STORY_THEME.color.Orange,
      },
    },
  ];

  const [theme, updateTheme] = useState(themes[0].value)

  
  useEffect(() => {
    try {
      // Set app body theme
      document.body.className = `${initialClassName} theme-${theme?.mode || 'light'} primary-${
        theme?.color || 'orange'
      }`;
    } catch (error) {
      console.log({ error });
    }
  }, [theme || {}]);

  const _setTheme = (theme) => {
    try {
      updateTheme(theme);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-row justify-end items-center p-2 mb-2 ">
      <div className="block text-base uppercase font-semibold text-appForegroundInActive mb-1 mr-2">
        Themes
      </div>
      <div className="flex">
        {themes.map((th, index) => {
          return (
            <div
              className={cx(
                {
                  active:
                    theme?.color === th?.value?.color &&
                    theme?.mode === th?.value?.mode,
                },
                'fc-theme'
              )}
              key={index}
              onClick={(e) => {
                _setTheme(th.value);
              }}
            >
              <div className={th.className}></div>
            </div>
          );
        })}
      </div>
    </div>
  );

}