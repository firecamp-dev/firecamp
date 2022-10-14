import {
  EFirecampAgent,
  EHttpMethod,
  IMeta,
  IUrl,
  I_Meta,
  TId,
} from '@firecamp/types';
import {
  IPlatformRequestService,
  IPlatformEnvironmentService,
} from '../../../services/platform-context';

/**
 *  Firecamp request tab
 */
export interface ITab {
  /**
   * Unique identification for tab
   */
  id: string;

  /**
   *  Request tab name
   */
  name: string;

  /**
   * Request type
   */
  type: string;

  /**
   * Request sub-type
   */
  subType?: string;

  /**
   * Request tab meta
   */
  meta?: ITabMeta;

  request?: {
    url?: IUrl;
    method?: EHttpMethod;
    meta?: IMeta;
    _meta?: I_Meta;
  };
}

/**
 * Tab meta
 */
export interface ITabMeta {
  /**
   * Whether request tab is saved or not
   */
  isSaved?: boolean;

  /**
   * Whether request tab is updated/ changed or not
   */
  hasChange?: boolean;

  /**
   * Whether request tab is fresh (unsaved) or not
   */
  isFresh?: boolean;

  /**
   * Whether request tab is updated from pull or not
   */
  revision?: number;

  /**
   * Whether request tab is deleted or not
   */
  isDeleted?: boolean;

  /**
   * Whether request tab is history tab (open from history) or not
   */
  isHistoryTab?: boolean;
}

/**
 * Tab functions to perform actions
 */

export interface ITabFns {
  //set active tab
  setActive: (tabId: string) => void;

  // open a new tab
  open: (tabType?: string, subType?: string) => void;

  // close tab
  close: (e: any, tabId: string, doSave?: boolean) => void;

  // reorder tabs on drag and drop sequence
  reorder: (dragIndex: number, hoverIndex: number) => void;

  // close all tabs
  closeAll: (e?: any) => void;

  // close all saved tabs
  closeAllSaved: (e?: Event) => void;

  // save active tab
  save: (e?: any) => void;

  fetchRequest?: (reqId: string) => any;
}

export interface ITabProps {
  index: number;
  tab: ITab;
  activeTab?: TId;

  //v3 props
  platformComponents: {
    SavePopover?: JSX.Element;
    EnvironmentWidget: JSX.Element;
  };
  envVariables?: {
    mergedEnvVariables: object;
    collectionEnvVariables: object;
    workspaceEnvVariables: object;
  };
  platformContext: {
    request: IPlatformRequestService;
    environment: IPlatformEnvironmentService;
    getFirecampAgent: () => EFirecampAgent;
  };
}
