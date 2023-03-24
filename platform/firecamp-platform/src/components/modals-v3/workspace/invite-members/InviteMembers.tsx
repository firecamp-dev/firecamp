import { FC, useEffect, useState } from 'react';
import { Modal, IModal, SecondaryTab } from '@firecamp/ui';
import { _array, _misc } from '@firecamp/utils';
import { Rest } from '@firecamp/cloud-apis';
import InviteNonOrgMembers from './tabs/InviteNonOrgMembers';
import InviteOrgMembers from './tabs/InviteOrgMembers';
import { EUserRolesWorkspace } from '../../../../types';
import { useWorkspaceStore } from '../../../../store/workspace';
import { EPlatformScope, usePlatformStore } from '../../../../store/platform';
// import './workspace.scss';

enum EInviteMemberTabs {
  NewMembers = 'newMembers',
  OrgMembers = 'orgMembers',
}

const InviteMembers: FC<IModal> = ({ isOpen = false, onClose = () => {} }) => {
  const { inviteNonOrgMembers, inviteOrgMembers } =
    useWorkspaceStore.getState();
  const [isInvitingMembers, setIsInvitingMembers] = useState(false);
  const [newMemberEditorValue, setMemberNewEditorValue] = useState('');
  const [activeTab, setActiveTab] = useState<EInviteMemberTabs>(
    EInviteMemberTabs.NewMembers
  );
  const [selectedRole, updateSelectedRole] = useState({
    name: 'Collaborator',
    id: EUserRolesWorkspace.Collaborator,
  });

  const [isFetchingMembers, setIsFetchingMembers] = useState(false);
  const [orgMembers, setOrgMembers] = useState([]);

  const tabs = [
    { name: 'Invite New Members', id: EInviteMemberTabs.NewMembers },
    { name: "Invite Organization's Members", id: EInviteMemberTabs.OrgMembers },
  ];

  /** fetch org members to be invited on second tab activated, only fetch once */
  useEffect(() => {
    if (activeTab === EInviteMemberTabs.OrgMembers && orgMembers.length === 0) {
      const { scope, organization } = usePlatformStore.getState();
      if (scope == EPlatformScope.Person) return;
      setIsFetchingMembers(true);
      Rest.organization
        .getMembers(organization.__ref.id)
        .then((res) => {
          if (!Array.isArray(res?.data)) {
            throw new Error(
              'No members are found in this organization to be invited'
            );
          }
          const members = res.data.map((m) => {
            return {
              id: m.__ref.id,
              name: m.name || m.username || m.email,
              email: m.email,
              className:
                ' px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none',
            };
          });
          setOrgMembers(members);
        })
        .catch((e) => {
          console.log(e);
          //TODO: app notification here
        })
        .finally(() => setIsFetchingMembers(false));
    }
  }, [activeTab]);

  // send new / existing member invitation
  const sendInvitation = (member: {
    id: string;
    name: string;
    email: string;
    role: EUserRolesWorkspace;
  }) => {
    inviteOrgMembers([member]);
  };

  return (
    <>
      <Modal.Header className="border-b border-appBorder">
        <div className="text-lg leading-5 px-6 py-4 flex items-center font-medium">
          Invite Members To Join The Workspace
        </div>
      </Modal.Header>
      <Modal.Body scrollbar={false}>
        <div className="p-4 h-fit flex flex-col">
          <SecondaryTab
            className="flex items-center pb-6 -ml-2"
            list={tabs}
            activeTab={activeTab}
            onSelect={(tabId: EInviteMemberTabs) => setActiveTab(tabId)}
          />
          {activeTab == EInviteMemberTabs.NewMembers ? (
            <InviteNonOrgMembers
              value={newMemberEditorValue}
              onChange={setMemberNewEditorValue}
              memberRole={selectedRole}
              updateMemberRole={updateSelectedRole}
              isInvitingMembers={isInvitingMembers}
              sendInvitation={sendInvitation}
            />
          ) : (
            <InviteOrgMembers
              members={orgMembers}
              isInvitingMembers={isInvitingMembers}
              isFetchingMembers={isFetchingMembers}
              sendInvitation={sendInvitation}
            />
          )}
        </div>
      </Modal.Body>
    </>
  );
};
export default InviteMembers;
