import { FC, useState } from 'react';
import {
  // ColorScheme,
  // ColorSchemeProvider,
  MantineProvider,
  createTheme,
  mergeThemeOverrides,
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import {
  EFirecampThemeVariant,
  ColorType,
  IFirecampThemeProvider,
} from './FirecampThemeProvider.interfaces';
import { EEditorTheme } from '@firecamp/types';
import { EditorApi } from '@firecamp/ui';
import { primaryColor, resolver, secondaryColor } from './theme';

const FirecampThemeProvider: FC<IFirecampThemeProvider> = ({
  children,
  ...props
}) => {
  const _initialize = () => {
    // on first time load set theme from local storage, if not found then set default
    let themeStored = localStorage.getItem('theme') as EFirecampThemeVariant;
    if (!Object.values(EFirecampThemeVariant).includes(themeStored)) {
      themeStored = EFirecampThemeVariant.LightPrimary;
    }
    return themeStored;
  };
  // const _initializeColorScheme = () => {
  //   // on first time load set theme from local storage, if not found then set default
  //   let themeColor = (
  //     [
  //       EFirecampThemeVariant.DarkPrimary,
  //       EFirecampThemeVariant.DarkSecondary,
  //     ].includes(localStorage.getItem('theme') as EFirecampThemeVariant)
  //       ? 'dark'
  //       : 'light'
  //   ) as ColorScheme;

  //   return themeColor;
  // };

  // const [colorScheme, setColorScheme] = useState<ColorScheme>(
  //   _initializeColorScheme
  // );
  const [theme, setTheme] = useState<EFirecampThemeVariant>(_initialize);

  // update theme
  const updateTheme = (theme: EFirecampThemeVariant) => {
    // update the color schema
    // setColorScheme(
    //   [
    //     EFirecampThemeVariant.LightPrimary,
    //     EFirecampThemeVariant.LightSecondary,
    //   ].includes(theme)
    //     ? 'light'
    //     : 'dark'
    // );

    // save in local storage
    localStorage.setItem('theme', theme);

    // update theme
    setTheme(theme);

    updateMonacoEditorTheme(theme);
  };

  const updateMonacoEditorTheme = (theme: EFirecampThemeVariant) => {
    // update the monaco editor theme
    const editorTheme = [
      EFirecampThemeVariant.LightPrimary,
      EFirecampThemeVariant.LightSecondary,
    ].includes(theme)
      ? EEditorTheme.Lite
      : EEditorTheme.Dark;

    localStorage.setItem('editorTheme', editorTheme);
    EditorApi.setEditorTheme(editorTheme);
  };

  // TODO global styles to add

  // globalStyles: (globalTheme) => ({
  //   ':root': {
  //     ...([
  //       EFirecampThemeVariant.LightSecondary,
  //       EFirecampThemeVariant.DarkSecondary,
  //     ].includes(theme)
  //       ? {
  //           '--app-primary': 'var(--mantine-color-green-7) !important',
  //         }
  //       : {}),
  //   },

  //   // tailwind class based theme styles
  //   ...(globalTheme.colorScheme === 'dark'
  //     ? {
  //         '.invert img': {
  //           filter: 'invert(0.8)',
  //         },
  //         '.drag-icon': {
  //           filter: 'invert(1)',
  //         },
  //       }
  //     : {
  //         '.invert img': {
  //           filter: 'invert(0)',
  //         },
  //       }),

  const defaultTheme = createTheme({
    fontFamily: " 'Lato', 'sans-serif' ",
    primaryColor: 'primary-color',
  });
  const primaryTheme = createTheme({
    colors: {
      'primary-color': primaryColor,
    },
  });
  const secondaryTheme = createTheme({
    colors: {
      'primary-color': secondaryColor,
    },
  });
  const defaultPrimaryTheme = mergeThemeOverrides(defaultTheme, primaryTheme);
  const defaultSecondaryTheme = mergeThemeOverrides(
    defaultTheme,
    secondaryTheme
  );

  return (
    <MantineProvider
      theme={defaultPrimaryTheme}
      cssVariablesResolver={resolver}
      // withCSSVariables
      // withGlobalStyles
      // withNormalizeCSS
      {...props}
    >
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );

  // //@ts-ignore
  // <ColorSchemeProvider colorScheme={theme}
  // toggleColorScheme={(c: ColorScheme | EFirecampThemeVariant) => {
  //   updateTheme(c as EFirecampThemeVariant);
  // }}
  // >
  // </ColorSchemeProvider>
};

export default FirecampThemeProvider;
