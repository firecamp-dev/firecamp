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
const FirecampThemeSelector = ({ theme, updateCurrentTheme }: any) => {
  const _setTheme = (t: EFirecampThemeVariant) => {
    try {
      // Set app body theme - for matching tailwind theme
      document.body.className = `sb-main-padded sb-show-main theme-${
        t.split('-')[0]
      } primary-${t.split('-')[1] === 'secondary' ? 'green' : 'orange'}`;
    } catch (error) {
      console.log({ error });
    }
    updateCurrentTheme(t);
  };

  return (
    <DropdownMenu
      handler={() => <Button text={theme} variant='outline'/>}
      options={ThemeOptions}
      onSelect={(t) => _setTheme(t.name)}
    />
  );
};
export default FirecampThemeSelector;
