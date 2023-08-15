export enum EWorkspaceTypes {
  Personal = 1,
  Organizational = 2,
}

export enum EUserRolesOrganization {
  // Owner = 1, //TODO: for future use
  Admin = 2,
  Collaborator = 3,
}
export enum EUserRolesWorkspace {
  Owner = 1,
  Admin = 2,
  Collaborator = 3,
  Viewer = 4,
}
export enum EUserRolesCollection {
  Collaborator = 3,
  Viewer = 4,
}

// Modal
export enum EPlatformModalTypes {
  None = 'none', // Ideal type which represents no opened modal at all

  // organization
  OrgManagement = 'orgManagement',
  SwitchOrg = 'switchOrg',

  // workspace
  WorkspaceManagement = 'workspaceManagement',
  InviteMembers = 'inviteMembers',
  SwitchWorkspace = 'switchWorkspace',

  // request
  EditRequest = 'editRequest',

  // environment
  CloneEnvironment = 'cloneEnvironment',

  // auth
  SignIn = 'signIn',
  SignInWithEmail = 'signInEmail',
  SignUp = 'signUp',
  RefreshToken = 'refreshToken',
  ForgotPassword = 'forgotPassword',
  ResetPassword = 'ResetPassword',

  // user
  UserProfile = 'userProfile',
  AllInvitation = 'allInvitation',

  // cookie
  CookieManager = 'cookieManager',

  // ssl & proxy
  SslNProxy = 'sslNProxy',
}

export enum ECloudApiHeaders {
  Authorization = 'Authorization',
  SocketId = 'X-Socket-Id',
  ClientId = 'X-Client-Id',
  WorkspaceId = 'X-Workspace-Id',
  AppVersion = 'X-App-Version',
}

export enum EThemeMode {
  Light = 'light',
  Dark = 'dark',
}

export enum EThemeColor {
  Green = 'green',
  Orange = 'orange',
}

export const DefaultTheme = {
  name: 'theme-light primary-orange',
  class: 'theme-light primary-orange',
  mode: EThemeMode.Light,
  color: EThemeColor.Orange,
};
