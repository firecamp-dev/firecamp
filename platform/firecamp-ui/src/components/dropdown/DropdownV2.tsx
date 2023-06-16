import { Fragment } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import cx from 'classnames';
import { _array } from '@firecamp/utils';
import { IDropdownV2, IOptionsV2 } from './interfaces/Dropdownv2.interfaces';


const DEFAULT_STYLES = {
  disabled: 'opacity-50',
  roundedContainer: 'rounded bg-appBackground border border-appForeground',
  squaredContainer: 'border border-focusBorder focus-visible:!shadow-none',
  shadowContainer:
    '!shadow-popoverBoxshadow focus-visible:!shadow-popoverBoxshadow',
  nestedOptionTrigger: 'flex items-center',
  optionItem: 'flex items-center text-appForeground px-2',
  separator: 'my-1 bg-appForeground opacity-50',
};

enum LIST_ITEM_HIERARCHY {
  LIST_ITEM = 'LIST_ITEM',
  HEADER_LIST_ITEM = 'HEADER_LIST_ITEM',
  NESTED_LIST_ITEM = 'NESTED_LIST_ITEM',
}
// DropDownV2 is used in InviteNonOrgMembers, InviteOrgMembers Popup
const DropDownV2 = ({
  showOptionArrow = false,
  handleRenderer,
  options,
  onSelect,
  disabled = false,
  classes = {},
}: IDropdownV2) => {
  classes = {
    rounded: false,
    animate: false,
    shadow: false,
    trigger: '',
    options: '',
    item: '',
    listItem: '',
    header: '',
    headerListItem: '',
    ...classes,
  };

  const renderMenuItems = (
    items: IOptionsV2[],
    order = LIST_ITEM_HIERARCHY.LIST_ITEM
  ) => {
    return items.map((item, index) => {
      if (item.list) {
        return (
          <Fragment key={index}>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger
                className={cx([DEFAULT_STYLES.nestedOptionTrigger], {
                  [DEFAULT_STYLES.disabled]: item.disabled,
                })}
                disabled={item.disabled}
                asChild
              >
                <span>
                  {typeof item.prefix === 'function' && item.prefix()}
                  <span className={cx(classes.item)}>{item.name}</span>
                  {typeof item.postfix === 'function' && item.postfix()}
                </span>
              </DropdownMenu.SubTrigger>
              <DropdownMenu.Portal>
                <DropdownMenu.SubContent
                  className={cx(
                    {"data-[side='bottom']:animate-slideUpAndFade": !classes.animate},
                    {"data-[side='bottom']:animate-slideDownAndFade": classes.animate},
                    { [DEFAULT_STYLES.roundedContainer]: classes.rounded },
                    { [DEFAULT_STYLES.squaredContainer]: !classes.rounded },
                    { [DEFAULT_STYLES.shadowContainer]: classes.shadow },
                    classes.options
                  )}
                  sideOffset={5}
                  alignOffset={0}
                >
                  {renderMenuItems(
                    item.list,
                    LIST_ITEM_HIERARCHY.NESTED_LIST_ITEM
                  )}
                  <DropdownMenu.Arrow />
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>
            {item.showSeparator && <Separator />}
          </Fragment>
        );
      } else {
        return (
          <Fragment key={index}>
            <DropdownMenu.Item
              className={cx(
                [DEFAULT_STYLES.optionItem],
                { [classes.header]: !_array.isEmpty(item.headerList) },
                {
                  [classes.headerListItem]:
                    order === LIST_ITEM_HIERARCHY.HEADER_LIST_ITEM,
                },
                { [classes.item]: order === LIST_ITEM_HIERARCHY.LIST_ITEM },
                {
                  [classes.listItem]:
                    order === LIST_ITEM_HIERARCHY.NESTED_LIST_ITEM,
                },
                {
                  [DEFAULT_STYLES.disabled]: item.disabled,
                }
              )}
              disabled={item.disabled}
              onClick={() => !item.disabled && onSelect(item)}
            >
              {typeof item.prefix === 'function' && item.prefix()}
              {item.name}
              {typeof item.postfix === 'function' && item.postfix()}
            </DropdownMenu.Item>
            {item.showSeparator && <Separator />}

            {item.headerList &&
              renderMenuItems(
                item.headerList,
                LIST_ITEM_HIERARCHY.HEADER_LIST_ITEM
              )}
          </Fragment>
        );
      }
    });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={cx({ [DEFAULT_STYLES.disabled]: disabled })}
        disabled={disabled}
        asChild
      >
        <span className={classes.trigger}>{handleRenderer()}</span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cx(
            {"data-[side='bottom']:animate-slideUpAndFade": !classes.animate},
            {"data-[side='bottom']:animate-slideDownAndFade": classes.animate},        
            { [DEFAULT_STYLES.roundedContainer]: classes.rounded },
            { [DEFAULT_STYLES.squaredContainer]: !classes.rounded },
            { [DEFAULT_STYLES.shadowContainer]: classes.shadow },
            { 'd-none border-0': options.length === 0 },
            classes.options
          )}
          sideOffset={5}
        >
          {renderMenuItems(options, LIST_ITEM_HIERARCHY.LIST_ITEM)}
          {showOptionArrow && <DropdownMenu.Arrow />}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const Separator = () => {
  return (
    <DropdownMenu.Separator
      className={DEFAULT_STYLES.separator}
      style={{ height: '1px' }}
    />
  );
};

export default DropDownV2;
