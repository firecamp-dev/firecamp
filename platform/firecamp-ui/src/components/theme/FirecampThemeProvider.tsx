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
  '#D6C0A9',
  '#D0AE8D',
  '#CD9F70',
  '#CE9052',
  '#D48332', // light theme color index
  '#B87634',
  '#9D6A37', // dark theme color index
  '#875F38',
];

const secondaryColor: ColorType = [
  '#B4D1BE',
  '#9CC7A9',
  '#83BF96',
  '#6ABB84',
  '#50BA72',
  '#3CB663',
  '#2DAF57', // light theme color index
  '#319551',
  '#32804B', // dark theme color index
  '#326E46',
];

const darkModeColor: ColorType = [
  '#fff', //text color
  '#acaebf',
  '#8c8fa3',
  '#666980',
  '#4d4f66', // for disabled value
  '#34354a',
  '#3c3c3c', // same color for both light & dark theme variant //'#2b2c3d'
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
