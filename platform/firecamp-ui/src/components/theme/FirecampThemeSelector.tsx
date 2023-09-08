import { useEffect, useState } from 'react';
import { useMantineColorScheme } from '@mantine/core';
import cx from 'classnames';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import DropdownMenu from '../dropdown/DropdownMenu';
import Button from '../buttons/Button';
import { EFirecampThemeVariant } from './FirecampThemeProvider.interfaces';

const ThemeOptions = [
  {
    name: 'Light Orange',
    value: EFirecampThemeVariant.LightPrimary,
  },
  {
    name: 'Light Green',
    value: EFirecampThemeVariant.LightSecondary,
  },
  {
    name: 'Dark Orange',
    value: EFirecampThemeVariant.DarkPrimary,
  },
  {
    name: 'Dark Green',
    value: EFirecampThemeVariant.DarkSecondary,
  },
];
const FirecampThemeSelector = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [isOpen, toggleOpen] = useState(false);

  useEffect(() => {
    _setTheme(colorScheme);
  }, [colorScheme]);

  const _setTheme = (t: any) => {
    toggleColorScheme(t);
  };

  const activeTheme = ThemeOptions.find(
    (t) => t.value === (colorScheme as EFirecampThemeVariant)
  );
  if (!activeTheme) return <></>;
  return (
    <DropdownMenu
      onOpenChange={(v) => toggleOpen(v)}
      handler={() => (
        <Button
          text={activeTheme.name}
          classNames={{
            root: 'w-[220px]',
            inner: 'flex justify-between w-full',
          }}
          rightIcon={
            <VscTriangleDown
              size={12}
              className={cx({ 'transform rotate-180': isOpen })}
            />
          }
          fullWidth
          outline
          sm
        />
      )}
      options={ThemeOptions}
      onSelect={(t) => _setTheme(t.value)}
      width={220}
      classNames={{
        dropdown: 'mt-2',
      }}
    />
  );
};
export default FirecampThemeSelector;
