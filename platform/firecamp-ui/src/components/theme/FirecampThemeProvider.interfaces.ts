import {
  DefaultMantineColor,
  MantineProviderProps,
  Tuple,
} from '@mantine/core';

type ExtendedCustomColors = 'primary-color' | DefaultMantineColor;

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}
export enum EFirecampThemeVariant {
  LightPrimary = 'light-primary',
  LightSecondary = 'light-secondary',
  DarkPrimary = 'dark-primary',
  DarkSecondary = 'dark-secondary',
}
export type ColorType = Tuple<string, 10>;
export interface IFirecampThemeProvider extends MantineProviderProps {
  themeVariant?: EFirecampThemeVariant;
}
