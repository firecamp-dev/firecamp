import shallow from 'zustand/shallow';
// import SSLnProxyManager from '../modals/ssl-proxy-manager/SSLnProxyManager';
// import AuthContainer from '../common/auth/AuthContainer';
// import CookieManager from '../modals/cookie-manager/CookieManager';
// import RefreshToken from '../common/auth/RefreshToken';
import { useModalStore } from '../../store/modal';
import { EPlatformModalTypes } from '../../types';
import ForgotPassword from './auth/ForgotPassword';
import RefreshToken from './auth/RefreshToken';
import ResetPassword from './auth/ResetPassword';
import SignIn from './auth/SignIn';
import SignInWithEmail from './auth/SignInWithEmail';
import SignUp from './auth/SignUp';
import SwitchOrg from './organization/SwitchOrg';
import InviteMembers from './workspace/invite-members/InviteMembers';
import OrgManagement from './organization/OrgManagement';
import WorkspaceManagement from './workspace/WorkspaceManagement';
import SwitchWorkspace from './workspace/SwitchWorkspace';
import CloneEnvironment from './environment/CloneEnvironment';
import EditRequest from './request/edit-request/EditRequest';

export const ModalContainer = () => {
  const { currentOpenModal, isOpen, close } = useModalStore(
    (s) => ({
      currentOpenModal: s.currentOpenModalType,
      isOpen: s.isOpen,
      open: s.open,
      close: s.close,
    }),
    shallow
  );

  const renderModal = (modalType: EPlatformModalTypes) => {
    switch (modalType) {
      case EPlatformModalTypes.None:
        return <></>;

      // Organization
      case EPlatformModalTypes.OrgManagement:
        return <OrgManagement opened={isOpen} onClose={close} />;
      case EPlatformModalTypes.SwitchOrg:
        return <SwitchOrg opened={isOpen} onClose={close} />;

      // Workspace
      case EPlatformModalTypes.InviteMembers:
        return <InviteMembers opened={isOpen} onClose={close} />;
      case EPlatformModalTypes.WorkspaceManagement:
        return <WorkspaceManagement opened={isOpen} onClose={close} />;
      case EPlatformModalTypes.SwitchWorkspace:
        return <SwitchWorkspace opened={isOpen} onClose={close} />;

      // Request
      case EPlatformModalTypes.EditRequest:
        return <EditRequest opened={isOpen} onClose={close} />;

      // Environment
      case EPlatformModalTypes.CloneEnvironment:
        return <CloneEnvironment opened={isOpen} onClose={close} />;

      // User
      // case EPlatformModalTypes.UserProfile: return <UserProfile isOpen={isOpen} onClose={close} />;

      // Auth
      case EPlatformModalTypes.SignIn:
        return <SignIn opened={isOpen} onClose={close} />;
      case EPlatformModalTypes.SignInWithEmail:
        return <SignInWithEmail opened={isOpen} onClose={close} />;
      case EPlatformModalTypes.SignUp:
        return <SignUp opened={isOpen} onClose={close} />;
      case EPlatformModalTypes.ForgotPassword:
        return <ForgotPassword opened={isOpen} onClose={close} />;
      case EPlatformModalTypes.ResetPassword:
        return <ResetPassword opened={isOpen} onClose={close} />;
      case EPlatformModalTypes.RefreshToken:
        return <RefreshToken opened={isOpen} onClose={close} />;
      default:
        return <></>;
    }
  };

  return renderModal(currentOpenModal);
};
