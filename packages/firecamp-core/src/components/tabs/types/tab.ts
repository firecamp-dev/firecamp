import { ReactNode } from 'react';
import {
  EFirecampAgent,
  EHttpMethod,
  IMeta,
  IUrl,
  IRef,
  TId,
} from '@firecamp/types';
import { ITab } from '@firecamp/ui-kit';
import {
  IPlatformRequestService,
  IPlatformEnvironmentService,
} from '../../../services/platform-context';

/** Firecamp request tab */
export interface IRequestTab extends ITab {
  /** request type */
  type: string;

  /** request meta */
  __meta?: IRequestTabMeta;

  /** minimal request */
  request?: {
    url?: IUrl;
    method?: EHttpMethod;
    __meta?: IMeta;
    __ref?: IRef;
  };
}

/**
 * Tab meta
 */
export interface IRequestTabMeta {
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

export interface IRequestTabProps {
  index: number;
  tab: IRequestTab;
  activeTab?: TId;

  //v3 props
  platformComponents: {
    SavePopover?: ReactNode;
    EnvironmentWidget: ReactNode;
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
