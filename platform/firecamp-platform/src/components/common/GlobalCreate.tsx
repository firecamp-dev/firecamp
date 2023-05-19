import { useState } from 'react';
import classnames from 'classnames';
import { Dropdown, Button } from '@firecamp/ui';
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
    header: 'CREATE NEW',
    list: [
      { id: EMenuOptions.Request, name: 'REQUEST' },
      { id: EMenuOptions.Collection, name: 'COLLECTION' },
      { id: EMenuOptions.Environment, name: 'ENVIRONMENT' },
      { id: EMenuOptions.ImportCollection, name: 'IMPORT COLLECTION' },
    ],
  },
  {
    header: 'Create New (by admin)',
    list: [
      { id: EMenuOptions.Workspace, name: 'WORKSPACE' },
      { id: EMenuOptions.Organization, name: 'ORGANIZATION' },
      { id: EMenuOptions.InviteMembers, name: 'INVITE MEMBERS' },
    ],
  },
  {
    header: 'SWITCH',
    list: [
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
    <div className="border-l border-b border-tab-border flex items-center pl-1">
      <Dropdown
        detach={false}
        isOpen={isOpen}
        onToggle={() => {
          toggleOpen(!isOpen);
        }}
        selected={''}
      >
        <Dropdown.Handler>
          <Button
            text={'Create'}
            className={classnames('!text-primaryColor')}
            withCaret
            transparent
            ghost
            xs
          />
        </Dropdown.Handler>
        <Dropdown.Options
          options={options}
          onSelect={onSelect}
          headerMeta={{ applyUpperCase: true }}
          hasDivider={true}
          className="type-1"
        />
      </Dropdown>
    </div>
  );
};
export default GlobalCreateDD;
