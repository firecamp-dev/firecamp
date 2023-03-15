import { TId } from '@firecamp/types';
import { ITab } from './Tab.interface';

/** Tabs props */
export interface ITabs {
  /**
   * A unique identifier
   */
  id?: string;
  /**
   * Add class name to show custom styling
   */
  className?: string;
  /**
   * Tabs list to show
   */
  list: Array<ITab>;
  /**
   * Tabs pre component to show before tab
   */
  preComp?: Function;
  /**
   * Tabs post component to show after tab
   */
  postComp?: Function;
  suffixComp?: Function;
  /**
   * Active tab id among list
   */
  activeTab?: string;
  /**
   * Close icon meta object for tab
   */
  closeTabIconMeta?: ICloseTabIconMeta;
  /**
   * Add icon meta object to add new tab
   */
  addTabIconMeta?: IAddTabIconMeta;
  /**
   * Tab border meta object to configure tab border
   */
  tabBorderMeta?: ITabBorderMeta;
  /**
   * A boolean value states whether you can to allow re-ordering list or not
   */
  canReorder?: boolean;
  /**
   * A callback function to call when tab is being clicked/ selected
   */
  onSelect?: (id: TId, index?: number, event?: any) => void;
  /**
   * A callback function to call when tab is being re-ordered
   */
  onReorder?: (orderedList: ITab[]) => void;

  withDivider?: boolean;
  /**
   * Tab height
   */
  height?: number;
  /**
   * Manage className/ UI by tabVersion, [1,2]
   */
  tabsVersion?: number;

  equalWidth?: boolean;

  tabIndex?: number;
}

/**
 * Tab close icon configuration to set icon position, visibility, click event, and disabled property
 *
 */
export interface ICloseTabIconMeta {
  /**
   * Set true if need top show close icon
   */
  show?: boolean;
  /**
   * A callback function to call onClick close icon to close tab
   */
  onClick?: Function;
  /**
   * Set true if prevent clicking in close icon
   */
  disabled?: boolean;
}

/**
 * Tab add icon configuration to set icon position, visibility, click event, and disabled property
 */
export interface IAddTabIconMeta {
  id?: string;

  /**
   * Set true if need top show add icon
   */
  show?: boolean;
  /**
   * A callback function to call onClick add icon to add new tab
   */
  onClick?: Function;
  /**
   * Set true if prevent clicking in add icon
   */
  disabled?: boolean;
}

/**
 * Tab border configuration to set border position, and visibility
 */
export interface ITabBorderMeta {
  /**
   * Active tab border placement
   */
  placementForActive?: string;
  right?: boolean;
}

/**
 * Active tab border placement
 */
export enum EPlacementForActive {
  Top = 'top',
  Bottom = 'bottom',
}
