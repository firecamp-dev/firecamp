import { FC } from 'react';
import shallow from 'zustand/shallow';
import { DropdownMenu } from '@firecamp/ui';
import { _misc } from '@firecamp/utils';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import { VscSignIn } from '@react-icons/all-files/vsc/VscSignIn';
import { VscSignOut } from '@react-icons/all-files/vsc/VscSignOut';
import { VscAccount } from '@react-icons/all-files/vsc/VscAccount';
import { VscRemote } from '@react-icons/all-files/vsc/VscRemote';
import { VscChevronRight } from '@react-icons/all-files/vsc/VscChevronRight';
// import { CgFormatSlash } from '@react-icons/all-files/cg/CgFormatSlash';
import { useWorkspaceStore } from '../../../store/workspace';
import { useUserStore } from '../../../store/user';
import { usePlatformStore, EPlatformScope } from '../../../store/platform';
import platformContext from '../../../services/platform-context';

const DDMenuContainer = () => {
  const { isGuest, user } = useUserStore(
    (s) => ({
      isGuest: s.isGuest,
      user: s.user,
    }),
    shallow
  );

  const { workspace } = useWorkspaceStore(
    (s) => ({
      workspace: s.workspace,
    }),
    shallow
  );

  const { scope, organization } = usePlatformStore(
    (s) => ({
      scope: s.scope,
      organization: s.organization,
    }),
    shallow
  );

  return (
    <div className="bg-focus3 flex items-center px-3">
      <VscAccount size={16} className="mr-1" />
      <UserDDMenus title={user.username} isGuest={isGuest} />
      {/* <CgFormatSlash size={20} className="" /> */}
      <VscChevronRight size={14} className="mt-0.5" />
      {scope == EPlatformScope.Organization ? (
        <>
          <OrgDDMenus title={organization?.name} />
          <VscChevronRight size={14} className="mt-0.5" />
          {/* <CgFormatSlash size={20} className="" /> */}
        </>
      ) : (
        <></>
      )}

      {/* <VscChevronRight size={14} className="mx-2 mt-0.5" /> */}
      <WorkspaceDDMenus title={workspace.name} disabled={!!isGuest} />
    </div>
  );
};

const UserDDMenus: FC<{ title: string; isGuest: boolean }> = ({
  title = 'Guest',
  isGuest,
}) => {
  const guestOptions = [
    {
      name: title,
      isLabel: true,
      postfix: () => (
        <>
          <br />
          <div
            className={
              'text-sm font-light leading-3 text-app-foreground-inactive'
            }
          >
            User
          </div>
        </>
      ),
    },
    {
      name: 'Sign in',
      postfix: () => (
        <div className={'ml-2 text-primaryColor'}>
          <VscSignIn size={20} />
        </div>
      ),
      onClick: () => platformContext.app.modals.openSignIn(),
    },
    {
      name: 'Create an account',
      postfix: () => (
        <div className={'ml-2 text-primaryColor'}>
          <VscAccount size={20} />
        </div>
      ),
      onClick: () => platformContext.app.modals.openSignUp(),
    },
  ];

  const userOptions = [
    {
      name: title,
      isLabel: true,
      postfix: () => (
        <>
          <br />
          <div
            className={
              'text-sm font-light leading-3 text-app-foreground-inactive'
            }
          >
            User
          </div>
        </>
      ),
    },
    // TODO: add the onClick action
    {
      name: 'User Profile',
      postfix: () => (
        <div className={'ml-2 text-primaryColor'}>
          <VscAccount size={14} />
        </div>
      ),
    },
    {
      name: 'Create new organization',
      postfix: () => (
        <div className={'ml-2'}>
          <VscAdd size={14} />
        </div>
      ),
      onClick: () => {
        platformContext.platform.createOrganizationPrompt();
      },
    },
    {
      name: 'Switch to organization',
      postfix: () => (
        <div className={'ml-2 text-primaryColor'}>
          <VscRemote size={14} />
        </div>
      ),
      onClick: () => {
        platformContext.app.modals.openSwitchOrg();
      },
    },
    {
      name: 'Switch to Personal Workspace',
      postfix: () => (
        <div className={'ml-2 text-primaryColor'}>
          <VscRemote size={14} />
        </div>
      ),
      onClick: () => {
        localStorage.removeItem('switchToOrg');
        localStorage.removeItem('workspace');
        platformContext.app.modals.openSwitchWorkspace();
      },
    },
    {
      name: 'Sign out',
      postfix: () => (
        <div className={'ml-2 text-primaryColor'}>
          <VscSignOut size={14} />
        </div>
      ),
      onClick: () => platformContext.app.logout(),
    },
  ];

  return (
    <DropdownMenu
      handler={() => (
        <span className="pl-1 cursor-pointer">{title}</span>
      )}
      options={isGuest ? guestOptions : userOptions}
      onSelect={(v) => v.onClick()}
      classNames={{
        dropdown: '!pt-0 mt-2 min-w-fit',
        label:
          '!capitalize flex items-center text-app-foreground !pt-[0.2rem] !pb-2 !px-3 !block !text-base leading-6 !bg-focus2 ',
        item: '!py-1 !px-3',
      }}
      width={150}
      sm
    />
  );
};

const WorkspaceDDMenus: FC<{ title: string; disabled?: boolean }> = ({
  title = '',
  disabled = false,
}) => {
  const options = [
    {
      name: title,
      isLabel: true,
      postfix: () => (
        <>
          <br />
          <div
            className={
              'text-sm font-light leading-3 text-app-foreground-inactive'
            }
          >
            Workspace
          </div>
        </>
      ),
    },
    {
      name: 'Workspace Management',
      disabled,
      postfix: () => (
        <div className={'ml-2'}>
          <VscAdd size={14} strokeWidth={1.5} />
        </div>
      ),
      onClick: () => {
        platformContext.app.modals.openWorkspaceManagement();
      },
    },
    {
      name: 'Invite Members',
      disabled,
      postfix: () => (
        <div className={'ml-2'}>
          <VscAdd size={14} strokeWidth={1.5} />
        </div>
      ),
      onClick: () => {
        platformContext.app.modals.openInviteMembers();
      },
    },
    {
      name: 'Switch to Workspace',
      disabled,
      postfix: () => (
        <div className={'ml-2 text-primaryColor'}>
          <VscRemote size={14} strokeWidth={1.5} />
        </div>
      ),
      onClick: () => {
        platformContext.app.modals.openSwitchWorkspace();
      },
    },
    {
      name: 'Switch to Org',
      disabled,
      postfix: () => (
        <div className={'ml-2 text-primaryColor'}>
          <VscRemote size={14} strokeWidth={1.5} />
        </div>
      ),
      onClick: () => {
        platformContext.app.modals.openSwitchOrg();
      },
    },
  ];

  return (
    <DropdownMenu
      handler={() => (
        <span className="pl-1 cursor-pointer">{title}</span>
      )}
      options={options}
      onSelect={(v) => v.onClick()}
      classNames={{
        dropdown: '!pt-0 mt-2 min-w-fit',
        label:
          '!capitalize flex items-center text-app-foreground !pt-[0.2rem] !pb-2 !px-3 !block !text-base leading-6 !bg-focus2 ',
        item: '!py-1 !px-3',
      }}
      width={150}
      sm
    />
  );
};

const OrgDDMenus: FC<{ title: string; disabled?: boolean }> = ({
  title = '',
  disabled = false,
}) => {
  const options = [
    {
      name: title,
      isLabel: true,
      postfix: () => (
        <>
          <br />
          <div
            className={
              'text-sm font-light leading-3 text-app-foreground-inactive'
            }
          >
            Organization
          </div>
        </>
      ),
    },
    {
      name: 'Org Management',
      disabled,
      postfix: () => (
        <div className={'ml-2'}>
          <VscAdd size={14} strokeWidth={1.5} />
        </div>
      ),
      onClick: () => {
        platformContext.app.modals.openOrgManagement();
      },
    },
    {
      name: 'Create new Org',
      disabled,
      postfix: () => (
        <div className={'ml-2'}>
          <VscAdd size={14} strokeWidth={1.5} />
        </div>
      ),
      onClick: () => {
        platformContext.platform.createOrganizationPrompt();
      },
    },
    {
      name: 'Switch to Org',
      disabled,
      postfix: () => (
        <div className={'ml-2 text-primaryColor'}>
          <VscRemote size={14} strokeWidth={1.5} />
        </div>
      ),
      onClick: () => {
        platformContext.app.modals.openSwitchOrg();
      },
    },
  ];

  return (
    <DropdownMenu
      handler={() => (
        <span className="pl-1 cursor-pointer">{title}</span>
      )}
      options={options}
      onSelect={(v) => v.onClick()}
      classNames={{
        dropdown: '!pt-0 mt-2 min-w-fit',
        label:
          '!capitalize flex items-center text-app-foreground !pt-[0.2rem] !pb-2 !px-3 !block !text-base leading-6 !bg-focus2 ',
        item: '!py-1 !px-3',
      }}
      width={140}
      sm
    />
  );
};

export { DDMenuContainer };
