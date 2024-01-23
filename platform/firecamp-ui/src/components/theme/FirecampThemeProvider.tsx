import { FC, useState } from 'react';
import {
  MantineProvider,
  createTheme,
  mergeThemeOverrides,
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

import { EEditorTheme } from '@firecamp/types';
import { EditorApi } from '@firecamp/ui';
import { FCThemeVariantProvider } from './FirecampThemeVariantProvider';
import {
  EFirecampThemeVariant,
  IFirecampThemeProvider,
} from './FirecampThemeProvider.interfaces';
import { primaryColor, resolver, secondaryColor } from './theme';

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
const defaultSecondaryTheme = mergeThemeOverrides(defaultTheme, secondaryTheme);

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

  const [theme, setTheme] = useState<EFirecampThemeVariant>(_initialize);

  // update theme
  const updateTheme = (theme: EFirecampThemeVariant) => {
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

  return (
    <FCThemeVariantProvider
      value={theme}
      setValue={(v: EFirecampThemeVariant) => updateTheme(v)}
    >
      <MantineProvider
        theme={
          [
            EFirecampThemeVariant.LightPrimary,
            EFirecampThemeVariant.DarkPrimary,
          ].includes(theme)
            ? defaultPrimaryTheme
            : defaultSecondaryTheme
        }
        cssVariablesResolver={resolver}
        {...props}
      >
        <ModalsProvider>{children}</ModalsProvider>
      </MantineProvider>
    </FCThemeVariantProvider>
  );
};

export default FirecampThemeProvider;
