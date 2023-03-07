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

export interface IEntityTab<E = any> extends ITab {
  /**
   * minimal info or the entity, it'll help tab and newly opened request to show the minimal information on load
   * for request
   *  {
   *     url?: IUrl;
   *     method?: EHttpMethod;
   *     __meta?: IMeta;
   * }
   */
  entity: Partial<E>;
  /** request meta */
  __meta?: IRequestTabMeta;
}

/** Tab meta */
export interface IRequestTabMeta {
  entityId: TId;
  entityType: ETabEntityTypes;
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
  tab: IRequestTab;

  //v3 props
  platformContext: {
    request: IPlatformRequestService;
    environment: IPlatformEnvironmentService;
    getFirecampAgent: () => EFirecampAgent;
  };
}

export enum ETabEntityTypes {
  Environment = 'environment',
  Collection = 'collection',
  Folder = 'folder',
  Request = 'request',
  Import = 'import',
}
