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

import { Button, DropdownV2, FcIconGetSquare } from '@firecamp/ui';
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
    id: 'CreateNewHeader',
    name: 'Create New',
    disabled: true,
    options: [
      {
        id: EMenuOptions.Request,
        name: 'Request',
        prefix: () => <FcIconGetSquare className="mr-2" size={16} />,
        // postfix: () => (
        //   <span className="ml-auto text-inputPlaceholder pl-2">⌘K</span>
        // ),
      },
      {
        id: EMenuOptions.Collection,
        name: 'Collection',
        prefix: () => <VscFolder className="mr-2" size={16} />,
      },
      {
        id: EMenuOptions.Environment,
        name: 'Environment',
        prefix: () => <RiBracesLine className="mr-2" size={16} />,
      },
      {
        id: EMenuOptions.ImportCollection,
        name: 'Import Collection',
        showSeparator: true,
        prefix: () => <VscArrowDown className="mr-2" size={16} />,
      },
    ],
  },
  {
    id: 'CreateNewByAdminHeader',
    name: 'Create New (By Admin)',
    disabled: true,
    options: [
      {
        id: EMenuOptions.Workspace,
        name: 'Workspace',
        prefix: () => <VscWindow className="mr-2" size={16} />,
      },
      {
        id: EMenuOptions.Organization,
        name: 'Organization',
        prefix: () => <VscOrganization className="mr-2" size={16} />,
      },
      {
        id: EMenuOptions.InviteMembers,
        name: 'Invite Members',
        showSeparator: true,
        prefix: () => <AiOutlineUserAdd className="mr-2" size={16} />,
      },
    ],
  },
  {
    id: 'SwitchHeader',
    name: 'SWITCH',
    disabled: true,
    options: [
      {
        id: EMenuOptions.SwitchOrg,
        name: 'Switch Organization',
        prefix: () => <AiOutlineUserSwitch className="mr-2" size={16} />,
      },
      {
        id: EMenuOptions.SwitchWorkspace,
        name: 'Switch Workspace',
        prefix: () => <VscMultipleWindows className="mr-2" size={16} />,
      },
    ],
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
      <DropdownV2
        onOpenChange={(v) => toggleOpen(v)}
        handleRenderer={() => (
          <Button
            text={'Create'}
            className={classnames({ open: isOpen })}
            primary
            withCaret
            transparent
            ghost
            xs
          />
        )}
        options={options}
        onSelect={onSelect}
        classes={{
          animate: true,
          rounded: false,
          options: 'w-[200px] bg-popover-background !pb-2 mt-[3px]',
          header:
            '!pb-1 !pt-3 !px-5 uppercase !text-xs font-medium leading-3 font-sans !text-activityBar-foreground-inactive !opacity-100	',
          optionListItem:
            '!px-5 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none cursor-pointer',
        }}
      />
    </div>
  );
};
export default GlobalCreateDD;
