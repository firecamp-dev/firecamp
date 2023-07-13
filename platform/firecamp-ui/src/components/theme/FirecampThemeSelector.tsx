import { useMantineColorScheme } from '@mantine/core';
import DropdownMenu from '../dropdown/DropdownMenu';
import Button from '../buttons/MButton';
import { EFirecampThemeVariant } from './FirecampThemeProvider.interfaces';

const ThemeOptions = [
  {
    name: EFirecampThemeVariant.LightPrimary,
  },
  {
    name: EFirecampThemeVariant.LightSecondary,
  },
  {
    name: EFirecampThemeVariant.DarkPrimary,
  },
  {
    name: EFirecampThemeVariant.DarkSecondary,
  },
];
const FirecampThemeSelector = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const _setTheme = (t: any) => {
    try {
      // Set app body theme - for matching tailwind theme
      document.body.className = `sb-main-padded sb-show-main theme-${
        t.split('-')[0]
      } primary-${t.split('-')[1] === 'secondary' ? 'green' : 'orange'}`;
    } catch (error) {
      console.log({ error });
    }
    toggleColorScheme(t);
  };

  return (
    <DropdownMenu
      handler={() => (
        <Button
          text={colorScheme}
          variant="outline"
          classNames={{ root: 'mx-2' }}
          compact
          xs
        />
      )}
      options={ThemeOptions}
      onSelect={(t) => _setTheme(t.name)}
    />
  );
};
export default FirecampThemeSelector;
