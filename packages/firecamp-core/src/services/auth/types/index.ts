import { EWorkspaceType } from '@firecamp/types';

export interface IWorkspace {
  /**
   * workspace name
   */
  name: string;
  /**
   * workspace metadata
   */
  __meta: {
    /**
     * is workspace default created at the time user
     * collaboration account created
     */
    isDefault: boolean;
    type: EWorkspaceType;
  };
  __ref: {
    id: string;
  };
}

/**
 * User payload received in the sign-up/sign-in API
 */
export interface IUser {
  email: string;
  __ref: {
    id: string;
  };
}

/**
 * Response of authentication API
 */
export interface IAuthResponse {
  __meta: {
    accessToken: string;
    activeWorkspace: string;
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
    accessToken: string;
  };
}
