import { TId } from '@firecamp/types';

export enum PlatformEvents {
  WorkspaceEvents = 'platform/workspace.events',
  ExplorerEvents = 'platform/explorer.events',
  EnvironmentEvents = 'platform/environment.events',
  TabEvents = 'platform/tabs.events',
}
export enum PlatformWorkspaceEvents {
  WorkspaceCreated = 'platform/workspace.created',
  WorkspaceUpdated = 'platform/workspace.updated',
  WorkspaceDeleted = 'platform/workspace.deleted',
}

export enum PlatformExplorerEvents {
  CollectionCreated = 'platform/collection.created',
  CollectionUpdated = 'platform/collection.updated',
  CollectionDeleted = 'platform/collection.deleted',

  FolderCreated = 'platform/folder.created',
  FolderUpdated = 'platform/folder.updated',
  FolderDeleted = 'platform/folder.deleted',

  RequestCreated = 'platform/request.created',
  RequestUpdated = 'platform/request.updated',
  RequestDeleted = 'platform/request.deleted',
}

export enum PlatformEnvironmentEvents {
  EnvironmentCreated = 'platform/env.created',
  EnvironmentUpdated = 'platform/env.updated',
  EnvironmentDeleted = 'platform/env.deleted',
}

export enum EPlatformTabs {
  openNew = 'platform/tabs.openNew',
  openRequest = 'platform/tabs.openRequest',
  openSaved = 'platform/tabs.openSaved',
  close = 'platform/tabs.close',

  opened = 'platform/tabs.opened',
  closed = 'platform/tabs.closed',
  changeState = 'platform/tabs.changeState',
}

export const prepareEventNameForRequestPull = (reqId: TId) => `pull/r/${reqId}`;
export const prepareEventNameForEnvToTab = (tabId: TId) => `env/t/${tabId}`;
