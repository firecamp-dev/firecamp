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

  // cookie
  CookieManager = 'cookieManager',

  // ssl & proxy
  SslNProxy = 'sslNProxy',
}

export const EPlatformModalDefaultProps = {
  // organization
  [EPlatformModalTypes.OrgManagement]: {
    size: 600,
    classNames: { content: 'h-[80vh]' },
  },
  //  { height: '80vh', width: '600px' },
  [EPlatformModalTypes.SwitchOrg]: {
    size: 440,
    classNames: { content: 'p-0 !pb-6' },
  },
  // { width: '440px', className: 'p-0 !pb-6' },

  // workspace
  [EPlatformModalTypes.WorkspaceManagement]: { size: 550 },
  // {
  //   height: '650px',
  //   width: '550px',
  // },
  [EPlatformModalTypes.InviteMembers]: {},
  // { height: '700px' },
  [EPlatformModalTypes.SwitchWorkspace]: {
    size: 440,
    classNames: { content: 'p-0 !pb-6' },
  },

  // request
  [EPlatformModalTypes.EditRequest]: { size: 450 },
  // { height: '600px', width: '450px' },

  // environment

  [EPlatformModalTypes.CloneEnvironment]: { size: 500 },
  // { height: '750px', width: '500px' },

  // auth
  [EPlatformModalTypes.SignIn]: {
    size: 440,
  },
  [EPlatformModalTypes.SignInWithEmail]: { size: 440 },
  [EPlatformModalTypes.SignUp]: { size: 440 },
  [EPlatformModalTypes.RefreshToken]: { closeOnEscape: false },
  [EPlatformModalTypes.ForgotPassword]: { size: 440 },
  [EPlatformModalTypes.ResetPassword]: {
    size: 440,
    classNames: { content: 'p-4' },
  },

  // user
  [EPlatformModalTypes.UserProfile]: {},

  // cookie
  [EPlatformModalTypes.CookieManager]: {},

  // ssl & proxy
  [EPlatformModalTypes.SslNProxy]: {},
};

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
