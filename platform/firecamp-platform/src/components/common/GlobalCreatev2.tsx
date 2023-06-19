import { useState } from 'react';
import classnames from 'classnames';
import { Button, DropdownV2 } from '@firecamp/ui';
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
    headerList: [
      { id: EMenuOptions.Request, name: 'REQUEST' },
      { id: EMenuOptions.Collection, name: 'COLLECTION' },
      { id: EMenuOptions.Environment, name: 'ENVIRONMENT' },
      {
        id: EMenuOptions.ImportCollection,
        name: 'IMPORT COLLECTION',
        showSeparator: true,
      },
    ],
  },
  {
    id: 'CreateNewByAdminHeader',
    name: 'Create New (By Admin)',
    disabled: true,
    headerList: [
      { id: EMenuOptions.Workspace, name: 'WORKSPACE' },
      { id: EMenuOptions.Organization, name: 'ORGANIZATION' },
      {
        id: EMenuOptions.InviteMembers,
        name: 'INVITE MEMBERS',
        showSeparator: true,
      },
    ],
  },
  {
    id: 'SwitchHeader',
    name: 'SWITCH',
    disabled: true,
    headerList: [
      { id: EMenuOptions.SwitchOrg, name: 'SWITCH ORGANIZATION' },
      { id: EMenuOptions.SwitchWorkspace, name: 'SWITCH WORKSPACE' },
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
    <div className="border-l border-b border-tabBorder flex items-center pl-1">
      <DropdownV2
        onOpenChange={(v) => toggleOpen(v)}
        handleRenderer={() => (
          <Button
            text={'Create'}
            className={classnames({'open': isOpen})}
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
          options: 'w-[200px] bg-popoverBackground !pb-2 mt-[3px]',
          header:
            '!pb-1 !pt-3 !px-5 uppercase !text-xs font-medium leading-3 font-sans !text-activityBarInactiveForeground !opacity-100	',
          headerListItem:
            '!px-5 text-sm uppercase hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none cursor-pointer',
        }}
      />
    </div>
  );
};
export default GlobalCreateDD;
