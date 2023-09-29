import {
  DefaultMantineColor,
  MantineProviderProps,
  MantineColorsTuple,
} from '@mantine/core';

type ExtendedCustomColors = 'primary-color' | DefaultMantineColor;

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>;
  }
}
export enum EFirecampThemeVariant {
  LightPrimary = 'light-primary',
  LightSecondary = 'light-secondary',
  DarkPrimary = 'dark-primary',
  DarkSecondary = 'dark-secondary',
}
export type ColorType = MantineColorsTuple;
export interface IFirecampThemeProvider extends MantineProviderProps {}
