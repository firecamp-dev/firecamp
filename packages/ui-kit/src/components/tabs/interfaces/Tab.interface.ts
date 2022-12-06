import { ICloseTabIconMeta, ITabBorderMeta } from './Tabs.interfaces';

export interface ITab {
  /** tab name */
  name: string;

  /** unique identifier */
  id: string;

  /** tab index*/
  index?: number | string;

  /** add class name to show custom styling */
  className?: string;

  /** show count as badge */
  count?: number;

  /** tab state ['default', 'modified'] */
  state?: string;

  /**tab is preview tab or not */
  isPreview?: boolean;

  /** tab border meta */
  borderMeta?: ITabBorderMeta;

  /** close tab icon meta */
  closeTabIconMeta?: ICloseTabIconMeta;

  /** is tab is active tab or not */
  isActive?: boolean;

  /** a callback function to call on click/ select tab */
  onSelect?: Function;

  /** tab name pre component */
  preComp?: Function;

  /** tab name post component */
  postComp?: Function;

  /** a boolean value to state dot indication or not */
  dotIndicator?: boolean;

  /** a boolean value states whether you can to allow re-ordering list or not */
  canReorder?: boolean;

  /** a callback function to call when tab is being re-ordered */
  onReorder?: (dragTab: any, index: number) => void;
  height?: number;
  tabVersion?: number;
  tabIndex?: number;
}
