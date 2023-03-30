import { useState } from 'react';
import classnames from 'classnames';
import { Dropdown, Button } from '@firecamp/ui';
import platformContext from '../../services/platform-context';
import { platformEmitter } from '../../services/platform-emitter';
import { EPlatformTabs } from '../../services/platform-emitter/events';
import { useWorkspaceStore } from '../../store/workspace';
import { useEnvStore } from '../../store/environment';
import { useTabStore } from '../../store/tab';
import { ERequestTypes } from '@firecamp/types';
import { ETabEntityTypes } from '../tabs/types';

enum EMenuOptions {
  Request = 'request',
  Collection = 'collection',
  Environment = 'environment',
  ImportCollection = 'import-collection',
  Workspace = 'workspace',
  Organization = 'organization',
  InviteMembers = 'invite-members',
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
        // platformContext.app.modals.openCreateOrg();
        break;
      case EMenuOptions.InviteMembers:
        platformContext.app.modals.openInviteMembers();
        break;
    }
  };

  return (
    <div className="border-l border-b border-tabBorder flex items-center pl-1">
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
