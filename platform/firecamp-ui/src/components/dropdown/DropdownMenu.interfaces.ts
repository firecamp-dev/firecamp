import type { MenuProps } from '@mantine/core';
import { ReactNode } from 'react';

export interface IDropdownMenu {
  /**
   * Add the custom header for options
   */
  header?: ReactNode;
  /**
   * Add the custom footer for options
   */
  footer?: ReactNode;
  /**
   * Add id to the dropdown wrapper
   */
  id?: string;
  /**
   * used to highlight (via bold font) the selected option name from the list
   */
  selected?: string;
  /**
   * Define the width for the dropdown
   */
  width?: number;
  /**
   * Sets the styling for menu items to a smaller size, including the text size and padding.
   */
  sm?: boolean;
  /**
   * Classnames object ( component Styles API )
   */
  classNames?: {
    trigger?: string;
    dropdown?: string;
    label?: string;
    item?: string;
    divider?: string;
    itemRightSection?: string;
  };
  /**
   * to add any additional mantine menu props
   */
  menuProps?: MenuProps;
  /**
   * to disable the dropdown selection
   */
  disabled?: boolean;
  /**
   * Element to be shown to preview the dropdown
   */
  handler: () => JSX.Element;
  /**
   * list of options
   */
  options: Array<IOptions>;
  /**
   * function on selection
   */
  onSelect: (option?: any) => void;
  /**
   * To get the options visibility status
   */
  onOpenChange?: (open: boolean) => void;
}
export interface IOptions {
  /**
   * to display a separator line at the bottom of current option item
   */
  showSeparator?: boolean;
  /**
   * to uniquely identify each option separately
   */
  id?: string | number;
  /**
   * to display the option name
   */
  name: string;
  /**
   * to display the tooltip text
   */
  title?: string;
  /**
   * to display the option item as Label
   */
  isLabel?: boolean;
  /**
   * to display the option item as disabled
   */
  disabled?: boolean;
  /**
   * to display the item with an dot indicator
   */
  dotIndicator?: boolean;
  /**
   * to perform action based on selection
   */
  onSelect?: (option?: any, event?: any) => any;
  /**
   * Option's pre component/ text
   */
  prefix?: () => JSX.Element | JSX.Element[];
  /**
   * Option's post component/ text
   */
  postfix?: () => JSX.Element | JSX.Element[];
}
