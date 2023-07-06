import { MantineProviderProps, Tuple } from '@mantine/core';
export enum EFirecampThemeVariant {
  LightPrimary = 'light-primary',
  LightSecondary = 'light-secondary',
  DarkPrimary = 'dark-primary',
  DarkSecondary = 'dark-secondary',
}
export type ColorType = Tuple<string, 10>;
export interface IFirecampThemeProvider extends MantineProviderProps {
  themeVariant: EFirecampThemeVariant;
}
