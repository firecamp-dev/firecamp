import { ReactNode } from 'react';
import { TId } from '@firecamp/types';

export interface ITab {
  /** unique identifier */
  id: string;

  /** tab index */
  index?: number;

  /** add class name to show custom styling */
  className?: string;

  /** show count as badge */
  count?: number;

  /** tab name */
  name: string;

  /** tab state ['default', 'modified'] */
  state?: 'default' | 'modified';

  /** tab is preview tab or not*/
  isPreview?: boolean;

  /** tab border meta */
  borderMeta?: ITabBorderMeta;

  /** close tab icon meta */
  closeTabIconMeta?: ICloseTabIconMeta;

  /** is tab is active tab or not */
  isActive?: boolean;

  /** a callback function to call on click/ select tab */
  onSelect?: Function;

  /** pre component, render before tab name */
  preComp?: ReactNode;

  /** post component, render after tab name */
  postComp?: ReactNode;

  /** a boolean value to show dot indication */
  dotIndicator?: boolean;

  /** allow to re order or not*/
  reOrderable?: boolean;

  /** callback function to call on re-ordered */
  onReorder?: () => { orderedList: Array<ITab> };
  height?: number;
  tabVersion?: number;
  tabIndex?: number;
}

/** Tab close icon configuration to set icon position, visibility, click event, and disabled property */
export interface ICloseTabIconMeta {
  /** set true if need top show close icon */
  show?: boolean;

  /** a function to call upon close icon click */
  onClick?: (tabId: TId, index: number) => void;

  /** prevent click event for close icon if true*/
  disabled?: boolean;
}

/** Tab border configuration to set border position, and visibility */
export interface ITabBorderMeta {
  /** active tab border placement */
  placementForActive?: EActiveBorderPosition;
  right?: boolean;
}

/** active tab border placement */
export enum EActiveBorderPosition {
  Top = 'top',
  Bottom = 'bottom',
}
