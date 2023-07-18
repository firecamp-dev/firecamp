import { FC, useEffect, useState } from 'react';
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  createStyles,
} from '@mantine/core';
import {
  EFirecampThemeVariant,
  ColorType,
  IFirecampThemeProvider,
} from './FirecampThemeProvider.interfaces';
import { EEditorTheme } from '@firecamp/types';
import { EditorApi } from '@firecamp/ui';

const primaryColor: ColorType = [
  '#EEE8E2',
  '#E1D3C5',
  '#D6C0A9',
  '#D0AE8D',
  '#CD9F70',
  '#CE9052',
  '#D48332',
  '#B87634',
  '#9D6A37',
  '#875F38',
];

const secondaryColor: ColorType = [
  '#B4D1BE',
  '#9CC7A9',
  '#83BF96',
  '#6ABB84',
  '#50BA72',
  '#3CB663',
  '#2DAF57',
  '#319551',
  '#32804B',
  '#326E46',
];

const defaultDarkColor: ColorType = [
  '#C1C2C5',
  '#A6A7AB',
  '#909296',
  '#5c5f66',
  '#373A40',
  '#2C2E33',
  '#25262b',
  '#1A1B1E',
  '#141517',
  '#101113',
];
const defaultGrayColor: ColorType = [
  '#f8f9fa',
  '#f1f3f5',
  '#e9ecef',
  '#dee2e6',
  '#ced4da',
  '#adb5bd',
  '#868e96',
  '#495057',
  '#343a40',
  '#212529',
];

export const useFirecampStyle = createStyles((theme) => ({
  backgroundWithOpacity: {
    '&:focus': {
      backgroundColor: theme.fn.rgba(primaryColor[6], 0.54),
      borderWidth: '0px',
    },
  },
}));

const FirecampThemeProvider: FC<IFirecampThemeProvider> = ({
  themeVariant = EFirecampThemeVariant.LightPrimary,
  children,
  ...props
}) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const [themeColor, updatethemeColor] = useState<EFirecampThemeVariant>(
    EFirecampThemeVariant.LightPrimary
  );

  useEffect(() => {
    updateTheme(themeVariant);
  }, [themeVariant]);

  // update theme colorScheme & primaryColor
  const updateTheme = (color: EFirecampThemeVariant) => {
    // update the primary color
    updatethemeColor(color);

    // update the color schema
    setColorScheme(
      [
        EFirecampThemeVariant.LightPrimary,
        EFirecampThemeVariant.LightSecondary,
      ].includes(color)
        ? 'light'
        : 'dark'
    );

    // update the monaco editor theme
    const editorTheme = [
      EFirecampThemeVariant.LightPrimary,
      EFirecampThemeVariant.LightSecondary,
    ].includes(color)
      ? EEditorTheme.Lite
      : EEditorTheme.Dark;

    localStorage.setItem('editorTheme', editorTheme);
    EditorApi.setEditorTheme(editorTheme);
  };

  return (
    //@ts-ignore
    <ColorSchemeProvider colorScheme={themeColor}
      toggleColorScheme={(c: ColorScheme | EFirecampThemeVariant) =>
        updateTheme(c as EFirecampThemeVariant)
      }
    >
      <MantineProvider
        theme={{
          colorScheme,
          colors: {
            'primary-color': [
              EFirecampThemeVariant.LightPrimary,
              EFirecampThemeVariant.DarkPrimary,
            ].includes(themeColor)
              ? primaryColor
              : secondaryColor,
            dark: defaultDarkColor,
            gray: defaultGrayColor,
          },
          primaryColor: 'primary-color',
          fontFamily: " 'Lato', 'sans-serif' ",
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
