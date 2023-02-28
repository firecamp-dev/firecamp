import { IAuthUiState, EAuthTypes } from '@firecamp/types';

export interface IAuthSetting {
  /**
   * Auth data
   */
  authUiState: IAuthUiState;

  /**
   * Active auth among all auth
   */
  activeAuth: string;

  /**
   * A boolean value to state whether you want to allow to inherit auth from parent or not
   */
  allowInherit?: boolean;

  /**
   * A message to display when inherit auth is selected
   */
  inheritAuthMessage?: string;

  /**
   * Passes updated auth value in to parent component
   */
  onChangeAuth: (
    authType: EAuthTypes,
    updates: { key: string; value: any } | any
  ) => void;

  /**
   * Update active auth value
   */
  onChangeActiveAuth: (authType: EAuthTypes) => Promise<any> | any;

  /**
   * Update auth value for auth tyoe OAuth2
   */
  onChangeOAuth2Value: (key: string, updates: any) => void;

  /**
   * Open parent auth settings to update/ view parent auth
   */
  openParentAuthModal?: () => void;

  /**
   * Fetch OAuth2 token
   */
  fetchTokenOnChangeOAuth2?: (options: any) => void;

  /**
   * Fetch inherited auth from parent
   */
  fetchInheritedAuth?: () => Promise<any> | any;

  oauth2LastToken?: string;
}
