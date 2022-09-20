import { useModalStore } from '../store/modal';
import { useUserStore } from '../store/user';
import { EPlatformModalTypes } from '../types';

const { open, close } = useModalStore.getState();
const modalService = {
  close,
  open: (modalType: EPlatformModalTypes, meta?: any) => open(modalType, meta),
  openSignIn: () => open(EPlatformModalTypes.SignIn),

  // Auth
  openSignInWithEmail: () => open(EPlatformModalTypes.SignInWithEmail),
  openSignUp: () => {
    const { isGuest } = useUserStore.getState();
    if (!isGuest) return;
    open(EPlatformModalTypes.SignUp);
  },
  openForgotPassword: () => {
    const { isGuest } = useUserStore.getState();
    if (!isGuest) return;
    open(EPlatformModalTypes.ForgotPassword);
  },
  openResetPassword: () => {
    const { isGuest } = useUserStore.getState();
    if (!isGuest) return;
    open(EPlatformModalTypes.ResetPassword);
  },

  // User
  openUserProfile: () => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
    open(EPlatformModalTypes.UserProfile);
  },

  // Workspace
  openCreateWorkspace: () => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
    open(EPlatformModalTypes.CreateWorkspace);
  },
  openWorkspaceManagement: () => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
    open(EPlatformModalTypes.WorkspaceManagement);
  },
  openSwitchWorkspace: () => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
    open(EPlatformModalTypes.SwitchWorkspace);
  },
  openInviteMembers: () => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
    open(EPlatformModalTypes.InviteMembers);
  },

  // Collection
  openCreateCollection: () => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
    open(EPlatformModalTypes.CreateCollection);
  },
  openCollectionSetting: (meta?: any) => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
    open(EPlatformModalTypes.CollectionSetting, meta);
  },

  // Folder
  openCreateFolder: (meta: any) => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
    open(EPlatformModalTypes.CreateFolder, meta);
  },
  openFolderSetting: (meta: any) => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
    open(EPlatformModalTypes.FolderSetting, meta);
  },

  // Request
  openSaveRequest: () => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
    open(EPlatformModalTypes.SaveRequest);
  },
  openEditRequest: (meta) => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
    open(EPlatformModalTypes.EditRequest, meta);
  },

  // Environment
  openManageEnvironemnt: (meta?: any) => {
    open(EPlatformModalTypes.ManageEnvironment, meta);
  },
  openCreateEnvironment: (meta?: any) => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
    open(EPlatformModalTypes.CreateEnvironment, meta);
  },

  // Organization
  openCreateOrg: () => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
    open(EPlatformModalTypes.CreateOrg);
  },
  openOrgManagement: () => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
    open(EPlatformModalTypes.OrgManagement);
  },
  openSwitchOrg: () => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
    open(EPlatformModalTypes.SwitchOrg);
  },

  // Cookie, Ssl, Proxy
  openCookieManager: () => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
    open(EPlatformModalTypes.CookieManager);
  },
  openSslNProxy: () => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
    open(EPlatformModalTypes.SslNProxy);
  },
};

export default modalService;
