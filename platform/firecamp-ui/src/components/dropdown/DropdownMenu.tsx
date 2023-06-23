import { Fragment, FC } from 'react';
import cx from 'classnames';
import { Menu } from '@mantine/core';
import { IDropdownMenu } from './interfaces/DropdownMenu.interfaces';

enum EDefaultStyles {
  dropdown = 'border border-app-border bg-popover-background rounded-none px-0 ',
  label = 'text-activityBar-foreground-inactive font-default px-5 pt-3 pb-1 font-medium text-xs leading-3 ',
  item = 'cursor-pointer text-app-foreground hover:bg-focus1 focus-visible:!shadow-none font-default px-5 py-0 text-base leading-7',
  divider = 'bg-app-border',
}

const DropdownMenu: FC<IDropdownMenu> = ({
  id = '',
  selected = '',
  width = 200,
  options = [],
  handleRenderer,
  classNames = {},
  onSelect = () => {},
  onOpenChange = () => {},
}) => {
  return (
    <Menu
      id={id}
      shadow="md"
      width={width}
      classNames={classNames}
      onChange={onOpenChange}
    >
      <Menu.Target>
        <span className="inline-block">{handleRenderer()}</span>
      </Menu.Target>

      <Menu.Dropdown className={EDefaultStyles.dropdown}>
        {options.map((item, i) => {
          return (
            <Fragment key={`menu-item-${i}`}>
              {item.isLabel ? (
                <Menu.Label className={EDefaultStyles.label}>
                  {item.name}
                </Menu.Label>
              ) : (
                <Menu.Item
                  className={cx(EDefaultStyles.item, {'font-bold': selected === item.name})}
                  icon={typeof item.prefix === 'function' && item.prefix()}
                  rightSection={
                    typeof item.postfix === 'function' && item.postfix()
                  }
                  onClick={() => onSelect(item)}
                >
                  {item.name}
                </Menu.Item>
              )}

              {item.showSeparator ? (
                <Menu.Divider
                  key={`menu-divider-${i}`}
                  className={EDefaultStyles.divider}
                />
              ) : (
                <></>
              )}
            </Fragment>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};

export default DropdownMenu;
