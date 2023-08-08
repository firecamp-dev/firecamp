import { useState } from 'react';
import { AiOutlineUserSwitch } from '@react-icons/all-files/ai/AiOutlineUserSwitch';
import { VscMultipleWindows } from '@react-icons/all-files/vsc/VscMultipleWindows';
import {
  ArrowDown,
  AppWindow,
  Braces,
  Building,
  FolderClosed,
  MailOpen,
  UserPlus2,
} from 'lucide-react';

import { DropdownMenu, FcIconGetSquare, BurgerIcon } from '@firecamp/ui';
import platformContext from '../../services/platform-context';
import { useWorkspaceStore } from '../../store/workspace';
import { useTabStore } from '../../store/tab';
import { ETabEntityTypes } from '../tabs/types';

enum EMenuOptions {
  Request = 'request',
  Collection = 'collection',
  Environment = 'environment',
  ImportCollection = 'import-collection',
  Workspace = 'workspace',
  Organization = 'organization',
  InviteMembers = 'invite-members',
  SwitchOrg = 'switch-org',
  SwitchWorkspace = 'switch-workspace',
  AllInvitation = 'all-invitation',
}

const options = [
  {
    id: EMenuOptions.Request,
    name: 'New request',
    prefix: () => (
      <FcIconGetSquare size={16} className="text-app-foreground-active" />
    ),
  },
  {
    id: EMenuOptions.Collection,
    name: 'New collection',
    prefix: () => (
      <FolderClosed size={16} className="text-app-foreground-active" />
    ),
  },
  {
    id: EMenuOptions.Environment,
    name: 'New environment',
    prefix: () => <Braces size={16} className="text-app-foreground-active" />,
  },

  {
    id: EMenuOptions.ImportCollection,
    name: 'Import collection',
    showSeparator: true,
    prefix: () => (
      <ArrowDown size={16} className="text-app-foreground-active" />
    ),
  },
  {
    id: EMenuOptions.Workspace,
    name: 'New workspace',
    prefix: () => (
      <AppWindow size={16} className="text-app-foreground-active" />
    ),
  },
  {
    id: EMenuOptions.Organization,
    name: 'New organization',
    prefix: () => <Building size={16} className="text-app-foreground-active" />,
  },
  {
    id: EMenuOptions.InviteMembers,
    name: 'Invite members',
    showSeparator: true,
    prefix: () => (
      <UserPlus2 size={16} className="text-app-foreground-active" />
    ),
  },
  {
    id: EMenuOptions.SwitchOrg,
    name: 'Switch organization',
    prefix: () => (
      <AiOutlineUserSwitch size={16} className="text-app-foreground-active" />
    ),
  },
  {
    id: EMenuOptions.SwitchWorkspace,
    name: 'Switch workspace',
    prefix: () => (
      <VscMultipleWindows size={16} className="text-app-foreground-active" />
    ),
    showSeparator: true,
  },
  {
    id: EMenuOptions.AllInvitation,
    name: 'View invitation',
    prefix: () => <MailOpen size={16} className="text-app-foreground-active" />,
  },
];

const GlobalCreateDD = ({}) => {
  const { open } = useTabStore.getState();
  const [isOpen, toggleOpen] = useState(false);

  const onSelect = (option) => {
    switch (option.id) {
      case EMenuOptions.Request:
        open({}, { id: '', type: ETabEntityTypes.Request });
        break;
      case EMenuOptions.Collection:
        platformContext.platform.createCollectionPrompt();
        break;
      case EMenuOptions.Environment:
        platformContext.platform.createEnvironmentPrompt();
        break;
      case EMenuOptions.ImportCollection:
        const { openImportTab } = useWorkspaceStore.getState();
        openImportTab();
        break;
      case EMenuOptions.Workspace:
        platformContext.platform.createWorkspacePrompt();
        break;
      case EMenuOptions.Organization:
        platformContext.platform.createOrganizationPrompt();
        break;
      case EMenuOptions.InviteMembers:
        platformContext.app.modals.openInviteMembers();
        break;
      case EMenuOptions.SwitchOrg:
        platformContext.app.modals.openSwitchOrg();
        break;
      case EMenuOptions.SwitchWorkspace:
        platformContext.app.modals.openSwitchWorkspace();
        break;
      case EMenuOptions.AllInvitation:
        platformContext.app.modals.openAllInvitation();
        break;
    }
  };

  return (
    <div className="border-l border-b border-tab-border flex items-center">
      <DropdownMenu
        onOpenChange={(v) => toggleOpen(v)}
        handler={() => <BurgerIcon opened={isOpen} size={'sm'} className='mx-2 pt-0' />}
        options={options}
        footer={<div className="mt-1">v{process.env.APP_VERSION}</div>}
        onSelect={onSelect}
        classNames={{
          dropdown: '-mt-1 -ml-[2px] pb-0',
        }}
      />
    </div>
  );
};
export default GlobalCreateDD;
