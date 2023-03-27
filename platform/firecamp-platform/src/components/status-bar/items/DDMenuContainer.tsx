import { FC } from 'react';
import shallow from 'zustand/shallow';
import { Dropdown } from '@firecamp/ui';
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
      header: title,
      list: [
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
      ],
    },
  ];

  const userOptions = [
    {
      header: title,
      list: [
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
            platformContext.app.modals.openCreateOrg();
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
      ],
    },
  ];

  return (
    <Dropdown>
      <Dropdown.Handler tabIndex={1} className="flex items-center invert">
        {title}
      </Dropdown.Handler>
      <Dropdown.Options
        options={isGuest ? guestOptions : userOptions}
        className="type-4"
        headerMeta={{
          postfix: () => (
            <div className="text-sm text-appForegroundInActive font-light leading-3  ">
              User
            </div>
          ),
        }}
        headerClassName="!bg-focus2 !text-base !text-appForegroundActive !font-base !capitalize !px-3 !pt-1 !pb-2"
      />
    </Dropdown>
  );
};

const WorkspaceDDMenus: FC<{ title: string; disabled?: boolean }> = ({
  title = '',
  disabled = false,
}) => {
  const options = [
    {
      header: title,
      list: [
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
      ],
    },
  ];

  return (
    <Dropdown>
      <Dropdown.Handler tabIndex={1} className="flex items-center invert">
        {title}
      </Dropdown.Handler>
      <Dropdown.Options
        options={options}
        className="type-4"
        headerMeta={{
          postfix: () => (
            <div className="text-sm text-appForegroundInActive font-light leading-3  ">
              Workspace
            </div>
          ),
        }}
        headerClassName="!bg-focus2 !text-base !text-appForegroundActive !font-base !capitalize !px-3 !pt-1 !pb-2"
      />
    </Dropdown>
  );
};

const OrgDDMenus: FC<{ title: string; disabled?: boolean }> = ({
  title = '',
  disabled = false,
}) => {
  const options = [
    {
      header: title,
      list: [
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
            platformContext.app.modals.openCreateOrg();
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
      ],
    },
  ];

  return (
    <Dropdown>
      <Dropdown.Handler tabIndex={1} className="flex items-center invert">
        {title}
      </Dropdown.Handler>
      <Dropdown.Options
        options={options}
        className="type-4"
        headerMeta={{
          postfix: () => (
            <div className="text-sm text-appForegroundInActive font-light leading-3  ">
              Organization
            </div>
          ),
        }}
        headerClassName="!bg-focus2 !text-base !text-appForegroundActive !font-base !capitalize !px-3 !pt-1 !pb-2"
      />
    </Dropdown>
  );
};

export { DDMenuContainer };
