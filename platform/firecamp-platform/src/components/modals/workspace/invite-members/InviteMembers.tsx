import { FC, useEffect, useState } from 'react';
import { Modal, IModal, SecondaryTab } from '@firecamp/ui';
import { _array, _misc } from '@firecamp/utils';
import { Rest } from '@firecamp/cloud-apis';
import InviteNonOrgMembers from './tabs/InviteNonOrgMembers';
import InviteOrgMembers from './tabs/InviteOrgMembers';
import { EUserRolesWorkspace } from '../../../../types';
import { EPlatformScope, usePlatformStore } from '../../../../store/platform';

enum EInviteMemberTabs {
  NewMembers = 'newMembers',
  OrgMembers = 'orgMembers',
}

const InviteMembers: FC<IModal> = ({ isOpen = false, onClose = () => {} }) => {
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);
  const [orgMembers, setOrgMembers] = useState([]);

  const [nonOrgTabState, setNonOrgTabState] = useState<{
    role: EUserRolesWorkspace;
    value: string;
  }>({ role: EUserRolesWorkspace.Collaborator, value: '' });
  const [orgTabState, setOrgTabState] = useState<{
    id: string;
    name: string;
    email: string;
    role: EUserRolesWorkspace;
  }>({
    id: '',
    name: '',
    email: '',
    role: EUserRolesWorkspace.Collaborator,
  });

  const changeNonOrgTabState = (state) => {
    setNonOrgTabState((s) => ({ ...s, ...state }));
  };
  const changeOrgTabState = (state) => {
    setOrgTabState((s) => ({ ...s, ...state }));
  };

  const [activeTab, setActiveTab] = useState<EInviteMemberTabs>(
    EInviteMemberTabs.NewMembers
  );

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

  return (
    <>
      <Modal.Header className="border-b border-app-border">
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
              state={nonOrgTabState}
              onChange={changeNonOrgTabState}
            />
          ) : (
            <InviteOrgMembers
              state={orgTabState}
              members={orgMembers}
              isFetchingMembers={isFetchingMembers}
              onChange={changeOrgTabState}
            />
          )}
        </div>
      </Modal.Body>
    </>
  );
};
export default InviteMembers;
