import { LegacyRef } from 'react';
import { MenuDirection } from '@szhsin/react-menu';
import { TId } from '@firecamp/types';
/**
 * Dropdown interface
 */
export interface IDropdown {
  id?: string;

  /**
   * A Boolean value whether dropdown is open or not
   */
  isOpen?: boolean;

  className?: string;

  /**
   * A function to call on toggle dropdown menu and return callback value
   */
  onToggle?: (open?: boolean) => any;

  /**
   * Boolean value whether dropdown is dependent on parent component or not. Pass detach true if not.
   */
  detach?: boolean;

  /**
   * Dropdown selected option
   */
  selected?: string | object;

  /**
   * children: child components
   */
  children?: any;
}

/**
 * Dropdown handler
 */
export interface IHandler {
  id?: string;
  className?: string;
  isOpen?: boolean;
  ref?: LegacyRef<HTMLDivElement>;
  children?: any;
  onToggleOpen?: () => any;
  tabIndex?: number;
}

export interface IOptions {
  isOpen?: boolean;
  onToggleOpen?: (isOpen: boolean) => void;
  ref?: any;
  selected?: string;
  /**
   * Dropdown menu options to display
   */
  options?: Array<IOption>;
  /**
   * Boolean value to set divider to options
   */
  hasDivider?: boolean;
  /**
   * Boolean value to show options in uppercase
   */
  applyUpperCase?: boolean;
  /**
   * Options header meta to configure header
   */
  headerMeta?: IHeaderMeta;
  /**
   * Dropdown options item classname
   */
  optionsClassName?: string;
  /**
   * Dropdown options header classname
   */
  headerClassName?: string;
  /**
   * Dropdown open direction ['right', 'top', 'bottom', 'left']
   */
  direction?: MenuDirection;
  /**
   * Message to show when no options are there
   */
  emptyMessage?: string;
  /**
   * A function to call on select option and pass an item as callback
   */
  onSelect?: (option?: any, event?: any) => any;

  children?: any;

  className?: string;
}

/**
 * Dropdown options's single option interface
 */
export interface IOption {
  /**
   * Option header
   */
  header?: string;
  /**
   * Option items
   */
  list?: Array<IItem>;

  //----------- If no header is there ----------
  id?: string;
  name?: string;
  /**
   * Boolean value whether option disabled or not
   */
  disabled?: boolean;
  onClick?: (option?: any, event?: any) => any;
  className?: string;
  /**
   * Option's pre component/ text
   */
  prefix?: () => JSX.Element | JSX.Element[];
  /**
   * Option's post component/ text
   */
  postfix?: () => JSX.Element | JSX.Element[];
}

/**
 * Dropdown options's single option's list interface when option header is there
 */
export interface IItem {
  /**
   * optional option id
   */
  id?: TId;
  /**
   * Option item name
   */
  name: string;
  /**
   * Item's pre component/ text
   */
  prefix?: () => JSX.Element | JSX.Element[];
  /**
   * Item's post component/ text
   */
  postfix?: () => JSX.Element | JSX.Element[];
  /**
   * Boolean value whether option disabled or not
   */
  disabled?: boolean;
  /**
   * Item classname to have custom css
   */
  className?: string;
  /**
   * A function to call onClick/ select option from menu
   */
  onClick?: (option?: any, e?: any) => void;
  /**
   * A boolean value to state dot indication or not
   */
  dotIndicator?: boolean;
}

/**
 * Dropdown options's single option's header meta
 */
export interface IHeaderMeta {
  /**
   * Boolean value to show header in uppercase
   */
  applyUpperCase?: boolean;
  /**
   * Header's pre component/ text
   */
  prefix?: () => JSX.Element | JSX.Element[];
  /**
   * Header's post component/ text
   */
  postfix?: () => JSX.Element | JSX.Element[];
}
