import { Menu } from '@mantine/core';

const DropdownMenu = ({
  options = [],
  handleRenderer,
  classNames = {},
}: {
  options: any[];
  handleRenderer: () => JSX.Element;
  classNames?: {};
}) => {

  return (
    <Menu shadow="md" width={200} classNames={classNames}>
      <Menu.Target>
        <span className="inline-block">{handleRenderer()}</span>
      </Menu.Target>

      <Menu.Dropdown>
        {options.map((item, i) => {
          if (item.isLabel)
            return <Menu.Label key={`label-${i}`}>{item.name}</Menu.Label>;
          else if (item.showSeparator)
            return <Menu.Divider key={`menu-divider-${i}`} />;

          return (
            <Menu.Item
              key={`menu-item-${i}`}
              icon={typeof item.prefix === 'function' && item.prefix()}
              rightSection={
                typeof item.postfix === 'function' && item.postfix()
              }
            >
              {item.name}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};

export default DropdownMenu;
