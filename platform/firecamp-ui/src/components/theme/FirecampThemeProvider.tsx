import { FC, useEffect, useState } from 'react';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
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

const defaultDarkColor: ColorType = [
  '#C1C2C5', //#bbb
  '#A6A7AB', // #9e9d9d
  '#909296', // #9C9C9C
  '#5c5f66', // #777777 //.1 #7777773d // .2 #57606a;
  '#373A40', // #3c3c3c //.1 #414141
  '#2C2E33', // #2d2c2c //.1 #333333 //.2 #2e2e30
  '#25262b', // #262626 //.1 #2b2b2b // .2 #2a2a2a // .3 #24292f;
  '#1A1B1E', // #1B1A1A //.1 1A191C
  '#141517',
  '#101113', // rgba(0, 0, 0, 0.36) //.1 #00000059 //.2 ffffff17 // .3 #00000017;
];
const defaultGrayColor: ColorType = [
  '#f8f9fa', //#fafbfc;
  '#f1f3f5', // #f3f4f5 // .1 #f5f5f5;
  '#e9ecef', //#ececec;
  '#dee2e6', //dddddd
  '#ced4da', //#cccccc //.1(similar to #ffffff80) //.2(similar to #ffffff66) // .3 #d0d0d1
  '#adb5bd', //#b1b1b1
  '#868e96', //#808080
  '#495057',
  '#343a40',
  '#212529', // #252526 //.1 #222/#222222
];

const FirecampThemeProvider: FC<IFirecampThemeProvider> = ({
  themeVariant = EFirecampThemeVariant.LightPrimary,
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
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={(c: ColorScheme | EFirecampThemeVariant) => updateTheme(c as EFirecampThemeVariant)}>
      <MantineProvider
        theme={{
          colorScheme,
          colors: {
            'primary-color': themeColor,
            dark: defaultDarkColor,
            gray: defaultGrayColor,
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
    </ColorSchemeProvider>
  );
};

export default FirecampThemeProvider;
