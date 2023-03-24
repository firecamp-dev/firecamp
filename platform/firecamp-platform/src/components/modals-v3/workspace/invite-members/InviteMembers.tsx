import { FC, useEffect, useState } from 'react';
import { Modal, IModal, SecondaryTab } from '@firecamp/ui';
import { _array, _misc } from '@firecamp/utils';
import InviteNonOrgMembers from './tabs/InviteNonOrgMembers';
import InviteOrgMembers from './tabs/InviteOrgMembers';
import { EUserRolesWorkspace } from '../../../../types';
import { useWorkspaceStore } from '../../../../store/workspace';
// import './workspace.scss';

enum EInviteMemberTabs {
  NewMembers = 'newMembers',
  OrgMembers = 'orgMembers',
}

const DUMMY_USER_DATA = [
  {
    id: 1,
    name: 'Shreya',
  },
  {
    id: 2,
    name: 'Nishchit',
  },
  {
    id: 3,
    name: 'Radhika',
  },
  {
    id: 4,
    name: 'Charmi',
  },
];

const InviteMembers: FC<IModal> = ({ isOpen = false, onClose = () => {} }) => {
  const { inviteMembers } = useWorkspaceStore.getState();
  const [iInProgress, setIInProgress] = useState(false);
  const [newMemberEditorValue, setMemberNewEditorValue] = useState('');
  const [activeTab, setActiveTab] = useState<EInviteMemberTabs>(
    EInviteMemberTabs.NewMembers
  );
  const [selectedRole, updateSelectedRole] = useState({
    name: 'Collaborator',
    id: EUserRolesWorkspace.Collaborator,
  });

  const [isRequesting, setIsRequesting] = useState(false);
  const [existingMemberList, updateExistingMemberList] = useState([]);

  const tabs = [
    { name: 'Invite New Members', id: EInviteMemberTabs.NewMembers },
    { name: "Invite Organization's Members", id: EInviteMemberTabs.OrgMembers },
  ];

  useEffect(() => {
    if (
      activeTab === EInviteMemberTabs.OrgMembers &&
      existingMemberList.length === 0
    ) {
      setIsRequesting(true);
      // Rest.organization.getMembers(orgId).then((data) => {
      console.log(`api will be called...`);
      const members = DUMMY_USER_DATA.map((m) => {
        return {
          id: m.id,
          name: m.name,
          className:
            ' px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none',
        };
      });
      updateExistingMemberList(members);
      // }).catch(console.log)
      //   .finally(() => setIsRequesting(false));

      setTimeout(() => setIsRequesting(false), 5000);
    }
  }, [activeTab]);

  // send new / existing member invitation
  const sendInvitation = (mDetails, eMember = false) => {
    if (eMember) return console.log(`invite existing member`, mDetails);

    console.log(`invite new member`, mDetails); //{members, role}
    // inviteMembers({ role: 2, members });
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
              invitingInProgress={iInProgress}
              sendInvitation={sendInvitation}
            />
          ) : (
            <InviteOrgMembers
              members={existingMemberList}
              invitingInProgress={iInProgress}
              sendInvitation={sendInvitation}
              isFetchingMembers={isRequesting} // TODO: Check why this
            />
          )}
        </div>
      </Modal.Body>
    </>
  );
};
export default InviteMembers;
