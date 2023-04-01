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

  // Request
  openSaveRequest: () => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
  },
  openEditRequest: (meta) => {
    const { isGuest } = useUserStore.getState();
    if (isGuest) return modalService.openSignIn();
    open(EPlatformModalTypes.EditRequest, meta);
  },

  // Environment
  openCloneEnvironment: (meta?: any) => {
    open(EPlatformModalTypes.CloneEnvironment, meta);
  },

  // Organization
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
