import { ReactNode, Ref } from 'react';
import { TId } from '@firecamp/types';
import { ITab, ICloseTabIconMeta, ITabBorderMeta } from './Tab.interface';

export interface ITabs {
  /** an unique identifier */
  id?: string;

  /** add class name to show custom styling */
  className?: string;

  /** tabs */
  list: Record<TId, ITab>;

  /** tab orders */
  orders: TId[];

  /** tabs pre component, render before tab title */
  preComp?: ReactNode;

  /** tabs post component, render at last */
  postComp?: ReactNode;

  /** tabs post component, render just after the name/title */
  suffixComp?: ReactNode;

  /** active tab id */
  activeTab?: string;

  /** close icon meta for tab */
  closeTabIconMeta?: ICloseTabIconMeta;

  /** add icon meta to add new tab*/
  addTabIconMeta?: IAddTabIconMeta;

  /** tab border meta to configure tab border **/
  tabBorderMeta?: ITabBorderMeta;

  /** a callback function to call when tab is being clicked/selected*/
  onSelect?: (id: string | number, index: number, event: any) => void;

  /** allow reorder */
  reOrderable: boolean;

  /** callback on tabs' reorder */
  onReorder?: (tabIds: TId[]) => void;

  withDivider?: boolean;

  /** height of the tab panel */
  height?: number;

  /** tab index for accessibility */
  tabIndex: number;

  /** Manage className/UI by tabVersion, [1, 2] */
  tabsVersion?: number;

  /** apply equal widths to all tabs */
  equalWidth?: boolean;

  ref?: Ref<any>;

  focus?: boolean;
}

/** Tab add icon configuration to set icon position, visibility, click event, and disabled property */
export interface IAddTabIconMeta {
  id?: string;

  /** show add icon if true */
  show?: boolean;

  /** callback function for add icon click */
  onClick?: Function;

  /** prevent click event if true */
  disabled?: boolean;
}
