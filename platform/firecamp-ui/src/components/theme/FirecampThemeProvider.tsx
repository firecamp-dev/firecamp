import { FC, useEffect, useState } from 'react';
import { ColorScheme, MantineProvider } from '@mantine/core';
import {
  EFirecampThemeVariant,
  ColorType,
  IFirecampThemeProvider,
} from './FirecampThemeProvider.interfaces';

const primaryColor: ColorType = [
  '#fff4e6',
  '#ffe8cc',
  '#ffd8a8',
  '#ffc078',
  '#ffa94d',
  '#ff922b',
  '#fd7e14', // light theme color index
  '#f76707',
  '#e8590c', // dark theme color index
  '#d9480f',
];

const secondaryColor: ColorType = [
  '#ebfbee',
  '#d3f9d8',
  '#b2f2bb',
  '#8ce99a',
  '#69db7c',
  '#51cf66',
  '#40c057', // light theme color index
  '#37b24d',
  '#2f9e44', // dark theme color index
  '#2b8a3e',
];

const darkModeColor: ColorType = [
  '#fff', //text color
  '#acaebf',
  '#8c8fa3',
  '#666980',
  '#4d4f66',
  '#34354a',
  '#2b2c3d',
  '#2d2c2c', //body background color
  '#0c0d21',
  '#01010a',
];

const FirecampThemeProvider: FC<IFirecampThemeProvider> = ({
  themeVariant,
  children,
  ...props
}) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const [themeColor, updatethemeColor] = useState<ColorType>(primaryColor);

  useEffect(() => {
    updateTheme(themeVariant);
  }, [themeVariant]);

  // update theme colorScheme & primaryColor
  const updateTheme = (color: EFirecampThemeVariant) => {
    updatethemeColor(
      [
        EFirecampThemeVariant.LightPrimary,
        EFirecampThemeVariant.DarkPrimary,
      ].includes(color)
        ? primaryColor
        : secondaryColor
    );

    setColorScheme(
      [
        EFirecampThemeVariant.LightPrimary,
        EFirecampThemeVariant.LightSecondary,
      ].includes(color)
        ? 'light'
        : 'dark'
    );
  };

  return (
    <MantineProvider
      theme={{
        colorScheme,
        colors: {
          'primary-color': themeColor,
          dark: darkModeColor,
        },
        primaryColor: 'primary-color',
        fontFamily: " 'Lato', 'sans-serif' ",
        components: {
          Button: {
            styles: (theme, params, { variant }) => ({
              root: {
                fontFamily: 'sans-serif',
                fontWeight: 'normal',

                '&:disabled, &[data-disabled]': {
                  backgroundColor:
                    theme.colors[theme.primaryColor][
                      theme.colorScheme === 'light' ? 6 : 8
                    ],
                  color: theme.colors.dark[0],
                  opacity: 0.5,
                },
              },
            }),
          },
        },
      }}
      withGlobalStyles
      withNormalizeCSS
      {...props}
    >
      {children}
    </MantineProvider>
  );
};

export default FirecampThemeProvider;
