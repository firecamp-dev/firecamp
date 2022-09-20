import { EWorkspaceType } from '@firecamp/types';

export interface IWorkspace {
  /**
   * workspace name
   */
  name: string;
  /**
   * workspace metadata
   */
  meta: {
    /**
     * is workspace default created at the time user
     * collaboration account created
     */
    is_default: boolean;
    type: EWorkspaceType;
  };
  _meta: {
    id: string;
  };
}

/**
 * User payload received in the sign-up/sign-in API
 */
export interface IUser {
  email: string;
  _meta: {
    id: string;
  };
}

/**
 * Response of authentication API
 */
export interface IAuthResponse {
  meta: {
    access_token: string;
    active_workspace: string;
  };
  user: IUser;
  workspace: IWorkspace;
}

/**
 * Types of auth to register user account
 */
export enum EProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  GITHUB = 'github',
}

/**
 * IRefreshTokenResponse
 */
export interface IRefreshTokenResponse {
  status: number;
  data: {
    access_token: string;
  };
}
