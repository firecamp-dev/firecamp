import { useState } from 'react';
import classnames from 'classnames';

import { RiBracesLine } from '@react-icons/all-files/ri/RiBracesLine';
import { VscArrowDown } from '@react-icons/all-files/vsc/VscArrowDown';
import { VscFolder } from '@react-icons/all-files/vsc/VscFolder';
import { VscOrganization } from '@react-icons/all-files/vsc/VscOrganization';
import { AiOutlineUserAdd } from '@react-icons/all-files/ai/AiOutlineUserAdd';
import { AiOutlineUserSwitch } from '@react-icons/all-files/ai/AiOutlineUserSwitch';
import { VscMultipleWindows } from '@react-icons/all-files/vsc/VscMultipleWindows';
import { VscWindow } from '@react-icons/all-files/vsc/VscWindow';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';

import { Button, DropdownMenu, FcIconGetSquare } from '@firecamp/ui';
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
}

const options = [
  {
    id: EMenuOptions.Request,
    name: 'New request',
    prefix: () => <FcIconGetSquare size={16} className='text-app-foreground-active' />,
  },
  {
    id: EMenuOptions.Collection,
    name: 'New collection',
    prefix: () => <VscFolder size={16} className='text-app-foreground-active' />,
  },
  {
    id: EMenuOptions.Environment,
    name: 'New environment',
    prefix: () => <RiBracesLine size={16} className='text-app-foreground-active' />,
  },

  {
    id: EMenuOptions.ImportCollection,
    name: 'Import collection',
    showSeparator: true,
    prefix: () => <VscArrowDown size={16} className='text-app-foreground-active' />,
  },
  {
    id: EMenuOptions.Workspace,
    name: 'New workspace',
    prefix: () => <VscWindow size={16} className='text-app-foreground-active' />,
  },
  {
    id: EMenuOptions.Organization,
    name: 'New organization',
    prefix: () => <VscOrganization size={16} className='text-app-foreground-active' />,
  },
  {
    id: EMenuOptions.InviteMembers,
    name: 'Invite members',
    showSeparator: true,
    prefix: () => <AiOutlineUserAdd size={16} className='text-app-foreground-active' />,
  },
  {
    id: EMenuOptions.SwitchOrg,
    name: 'Switch organization',
    prefix: () => <AiOutlineUserSwitch size={16} className='text-app-foreground-active' />,
  },
  {
    id: EMenuOptions.SwitchWorkspace,
    name: 'Switch workspace',
    prefix: () => <VscMultipleWindows size={16} className='text-app-foreground-active' />,
  },
];

const GlobalCreateDD = ({}) => {
  const [isOpen, toggleOpen] = useState(false);
  const { open } = useTabStore.getState();
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
    }
  };

  return (
    <div className="border-l border-b border-tab-border flex items-center pl-1">
      <DropdownMenu
        onOpenChange={(v) => toggleOpen(v)}
        handler={() => (
          <Button
            text={'Create'}
            rightIcon={<VscTriangleDown size={12} className={classnames({'transform rotate-180': isOpen})}/>}
            transparent
            primary
            compact
            xs
          />
        )}
        options={options}
        onSelect={onSelect}
        classNames={{
          dropdown: '-ml-[2px]',
        }}
      />
    </div>
  );
};
export default GlobalCreateDD;
