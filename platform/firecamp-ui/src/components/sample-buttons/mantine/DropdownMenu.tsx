import { Fragment } from 'react';
import { Menu } from '@mantine/core';

const DropdownMenu = ({
  options = [],
  handleRenderer,
  classNames = {},
  onSelect = () => {},
  onOpenChange = () => {},
}: {
  options: any[];
  handleRenderer: () => JSX.Element;
  classNames?: {};
  onSelect: (option?: any) => void;
  onOpenChange?: (open: boolean) => void;
}) => {
  return (
    <Menu
      shadow="md"
      width={200}
      classNames={classNames}
      onChange={onOpenChange}
    >
      <Menu.Target>
        <span className="inline-block">{handleRenderer()}</span>
      </Menu.Target>

      <Menu.Dropdown
        className={'border border-appBorder bg-popoverBackground rounded-none'}
      >
        {options.map((item, i) => {
          return (
            <Fragment key={`menu-item-${i}`}>
              {item.isLabel ? (
                <Menu.Label
                  className="text-activityBarInactiveForeground font-sans"
                >
                  {item.name}
                </Menu.Label>
              ) : (
                <Menu.Item
                  className="cursor-pointer text-appForeground font-sans hover:bg-focus1 focus-visible:!shadow-none"
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
                  className={'bg-appBorder'}
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
