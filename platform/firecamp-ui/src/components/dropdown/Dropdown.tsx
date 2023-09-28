import { FC, useState, useEffect, useRef } from 'react';

import { MenuItem, MenuHeader, ControlledMenu } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import classname from 'classnames';
import { VscCircleFilled } from '@react-icons/all-files/vsc/VscCircleFilled';
import {
  IDropdown,
  IOptions,
  IHandler,
} from './interfaces/Dropdown.interfaces';

import './Dropdown.scss';

const Dropdown: FC<IDropdown> & {
  Handler: FC<IHandler>;
  Options: FC<IOptions>;
} = ({
  id = '',
  isOpen: propIsOpen = false,
  onToggle = () => {},
  detach = true,
  className = '',
  children = '',
  selected = '', //TODO: check usage and deprecate if not needed - used to highlight (via bold font) the selected option name from the list
}) => {
  let [isOpen, toggleIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (detach === false) {
      toggleIsOpen(propIsOpen);
    }
  }, [propIsOpen]);

  let _onToggleOpen = (value: boolean) => {
    if (onToggle && detach === false) {
      onToggle(value);
    }
    if (detach === true) {
      toggleIsOpen(value);
    }
  };

  /**
   * To add isOpen and onToggleOpen props in each child
   */
  if (children && Array.isArray(children) && children.length) {
    let childrenWithProps: any[] = [];
    children.map((child) => {
      if (typeof child === 'object') {
        childrenWithProps.push(
          Object.assign({}, child, {
            props: Object.assign({}, child.props, {
              isOpen,
              onToggleOpen: _onToggleOpen,
              selected,
              ref,
            }),
          })
        );
      } else {
        childrenWithProps.push(child);
      }
    });
    children = [...(childrenWithProps || [])];
  }

  return (
    <div id={id} className={className}>
      {children}
    </div>
  );
};
export default Dropdown;

const Handler: FC<IHandler> = ({
  id = '',
  className = '',
  isOpen = false,
  ref = null,
  children = [],
  onToggleOpen = (isOpen: boolean) => {},
  tabIndex = 1,
}) => {
  return (
    <div
      id={id}
      className={classname(className, { open: isOpen })}
      onClick={() => {
        onToggleOpen(!isOpen);
      }}
      ref={ref}
      tabIndex={tabIndex}
      role="button"
    >
      {children}
    </div>
  );
};

const Divider = () => {
  return <hr className={'!option-0 my-1'}></hr>;
};

const Options: FC<IOptions> = ({
  isOpen = false,
  onToggleOpen = (isOpen: boolean) => {},
  ref = null,
  options = [],
  hasDivider = false,
  applyUpperCase = false,
  headerMeta = {
    applyUpperCase: false,
    prefix: () => {},
    postfix: () => {},
  },
  selected = '',
  optionsClassName = '',
  headerClassName = '',
  direction = 'bottom',
  emptyMessage = '',
  className = '',
  children = [],
  onSelect = (option?: any, event?: any) => {},
}) => {
  return (
    <ControlledMenu
      state={isOpen ? 'open' : 'closed'}
      anchorRef={ref}
      className={classname('fc-custom-dropdown block m-4 absolute', className)}
      direction={direction}
      onClose={(e) => {
        if (isOpen) onToggleOpen(false);
      }}
    >
      {options?.length ? (
        options?.map((option, oi) => {
          return option?.header ? (
            [
              // Menu header
              <MenuHeader
                key={`option-header-${oi}`}
                className={
                  headerClassName ||
                  `!pb-1 !pt-3 !px-5 !text-xs text-activityBar-foreground-inactive font-medium relative font-sans leading-3`
                }
              >
                {headerMeta?.prefix ? headerMeta.prefix() : ''}
                <span className="bg-transparent relative pr-1 z-10">
                  {option.header || ''}
                </span>
                {headerMeta?.postfix ? headerMeta.postfix() : ''}
              </MenuHeader>,

              // Option list, show empty mes
              option?.list?.length
                ? option?.list?.map((item, i) => {
                    return (
                      <MenuItem
                        key={`option-item-${oi}-${i}`}
                        disabled={item.disabled}
                        onClick={(e) => {
                          item?.onClick
                            ? item?.onClick?.(item, e)
                            : onSelect(item, e);
                        }}
                      >
                        <div
                          className={classname(
                            optionsClassName || item.className,
                            'flex items-center w-full'
                          )}
                        >
                          {item?.prefix ? item.prefix() : ''}
                          <span
                            className="flex-1 whitespace-pre flex items-center"
                            style={
                              item.name === selected
                                ? { fontWeight: 'bold' }
                                : {}
                            }
                          >
                            {item.name || ''}
                            {item?.dotIndicator === true && (
                              <span>
                                <VscCircleFilled
                                  size={12}
                                  className="text-primaryColor ml-1  !opacity-100"
                                />
                              </span>
                            )}
                          </span>
                          {item?.postfix ? item.postfix() : ''}
                        </div>
                      </MenuItem>
                    );
                  })
                : emptyMessage,
              // show divider if has divider is true and not a last option
              hasDivider && oi !== options.length - 1 ? <Divider /> : '',
            ]
          ) : (
            <MenuItem
              key={`option-item-${oi}`}
              disabled={option.disabled}
              onClick={(e) => {
                if ('onClick' in option) {
                  option?.onClick?.(option, e);
                } else {
                  onSelect(option, e);
                }
              }}
            >
              <div
                className={classname(
                  optionsClassName || option.className,
                  'flex items-center w-full'
                )}
              >
                {option?.prefix ? option.prefix() : ''}
                <span
                  className="flex-1 whitespace-pre"
                  style={option.name === selected ? { fontWeight: 'bold' } : {}}
                >
                  {option.name || ''}
                </span>
                {option?.postfix ? option.postfix() : ''}
              </div>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem>
          {children || (
            <div className={'flex items-center w-full'}>{emptyMessage}</div>
          )}
        </MenuItem>
      )}
    </ControlledMenu>
  );
};

Dropdown.Handler = Handler;
Dropdown.Options = Options;
