import { ICloseTabIconMeta, ITabBorderMeta } from './Tabs.interfaces';

export interface ITab {
  /**
   * Unique identifier
   */
  id: string;
  /**
   * Tab index
   */
  index?: string;
  /**
   * Add class name to show custom styling
   */
  className?: string;

  /**
   * show count as badge
   */
  count?: number;

  /**
   * Tab name
   */
  name: string;
  /**
   * Tab state ['default', 'modified']
   */
  state?: string;
  /**
   * Tab is preview tab or not
   */
  isPreview?: boolean;
  /**
   * Tab border meta
   */
  borderMeta?: ITabBorderMeta;
  /**
   * close tab icon meta
   */
  closeTabIconMeta?: ICloseTabIconMeta;
  /**
   * Is tab is active tab or not
   */
  isActive?: boolean;
  /**
   * A callback function to call on click/ select tab
   */
  onSelect?: Function;
  /**
   * Tab name pre component
   */
  preComp?: Function;
  /**
   * Tab name post component
   */
  postComp?: Function;
  /**
   * A boolean value to state dot indication or not
   */
  dotIndicator?: boolean;
  /**
   * A boolean value states whether you can to allow re-ordering list or not
   */
  canReorder?: boolean;
  /**
   * A callback function to call when tab is being re-ordered
   */
  onReorder?: () => { orderedList: Array<ITab> };
  height?: number;
  tabVersion?: number;
  tabIndex?: number;
}
