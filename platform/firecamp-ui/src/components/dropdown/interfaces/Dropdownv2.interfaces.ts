export interface IDropdownV2 {
  /**
   * To provide custom styling to individual components
   */
  classes?: {
    rounded?: boolean;
    shadow?: boolean;
    animate?: boolean;
    trigger?: string;
    options?: string;
    item?: string;
    listItem?: string;
    header?: string;
    headerListItem?: string;
  };
  /**
   * To display arrow shown at the begin of container
   */
  showOptionArrow?: boolean;
  /**
   * Element to be shown to preview the dropdown
   */
  handleRenderer: () => JSX.Element;
  /**
   * list of options
   */
  options: Array<IOptionsV2>;
  /**
   * function on selection
   */
  onSelect: (option?: any, event?: any) => any;
  /**
   * To disable the selection option
   */
  disabled?: boolean;
  /**
   * To get the options visibility status
   */
  onOpenChange?: (open: boolean) => void;
}
export interface IOptionsV2 {
  /**
   * Option items nested to next popup
   */
  list?: Array<IOptionsV2>;
  /**
   * Option items to display below header
   */
  headerList?: Array<IOptionsV2>;
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
  name?: string;
  /**
   * to perform action based on selection
   */
  onSelect?: (option?: any, event?: any) => any;
  /**
   * Boolean value whether option disabled or not
   */
  disabled?: boolean;
  /**
   * Option's pre component/ text
   */
  prefix?: () => JSX.Element | JSX.Element[];
  /**
   * Option's post component/ text
   */
  postfix?: () => JSX.Element | JSX.Element[];
}
