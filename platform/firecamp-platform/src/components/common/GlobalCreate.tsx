import { useState } from 'react';
import classnames from 'classnames';
import { Dropdown, Button } from '@firecamp/ui-kit';
import platformContext from '../../services/platform-context';
import { platformEmitter } from '../../services/platform-emitter';
import { EPlatformTabs } from '../../services/platform-emitter/events';
import { useWorkspaceStore } from '../../store/workspace';

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
  const onSelect = (option) => {
    switch (option.id) {
      case EMenuOptions.Request:
        platformEmitter.emit(EPlatformTabs.openNew, 'rest');
        break;
      case EMenuOptions.Collection:
        const { createCollectionPrompt } = useWorkspaceStore.getState();
        createCollectionPrompt();
        break;
      case EMenuOptions.Environment:
        const { tabId, collectionId } =
          platformContext.environment.getCurrentTabEnv();
        if (!collectionId) {
          const msg =
            tabId == 'home'
              ? 'Please open a saved request from the collection to create an environment of that collecction'
              : 'The current tab request is not saved, please save it in the collection';
          platformContext.app.notify.info(msg);
          return;
        }
        platformContext.app.modals.openCreateEnvironment({
          collectionId,
        });
        break;
      case EMenuOptions.ImportCollection:
        break;
      case EMenuOptions.Workspace:
        platformContext.app.modals.openCreateWorkspace();
        break;
      case EMenuOptions.Organization:
        platformContext.app.modals.openCreateOrg();
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
            text={'NEW'}
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
