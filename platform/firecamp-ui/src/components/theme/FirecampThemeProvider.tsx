import { FC, useEffect, useState } from 'react';
import { ColorScheme, MantineProvider } from '@mantine/core';
import {
  EFirecampThemeVariant,
  ColorType,
  IFirecampThemeProvider,
} from './FirecampThemeProvider.interfaces';

const primaryColor: ColorType = [
  '#EEE8E2',
  '#E1D3C5',
  '#D6C0A9', // dark mode color index [in ghost variant]
  '#D0AE8D',
  '#CD9F70',
  '#CE9052',
  '#D48332', // light theme bgcolor index
  '#B87634',
  '#9D6A37', // dark theme color index
  '#875F38',
];

const secondaryColor: ColorType = [
  '#B4D1BE',
  '#9CC7A9',
  '#83BF96', // dark mode color index [in ghost variant]
  '#6ABB84',
  '#50BA72',
  '#3CB663',
  '#2DAF57', // light theme color index
  '#319551',
  '#32804B', // dark theme color index
  '#326E46',
];

const darkModeColor: ColorType = [
  '#d5d7e0',
  '#acaebf',
  '#8c8fa3',
  '#666980',
  '#4d4f66', // for disabled value
  '#34354a',
  '#2b2c3d', // same color for both light & dark theme variant 
  '#1d1e30', //body background color
  '#0c0d21',
  '#01010a',
];

const grayColor: ColorType = [
  '#CCCCCC',
  '#616161',
  '#585858',
  '#505050',
  '#494949',
  '#424242', //outline-dark
  '#3C3C3C', //outline-light
  '#363636',
  '#313131',
  '#2C2C2C',
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
          gray: grayColor,
        },
        primaryColor: 'primary-color',
        fontFamily: " 'Lato', 'sans-serif' ",
        components: {
          Button: {
            styles: (theme, params, { variant }) => ({
              root: {
                fontFamily: 'sans-serif',
                fontWeight: 'normal',
              },
            }),
          },
        },
      }}
      withCSSVariables
      withGlobalStyles
      withNormalizeCSS
      {...props}
    >
      {children}
    </MantineProvider>
  );
};

export default FirecampThemeProvider;
