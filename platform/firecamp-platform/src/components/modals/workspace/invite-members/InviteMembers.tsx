import { FC, useEffect, useState } from 'react';
import { Container, Drawer, IModal, Notes, SecondaryTab } from '@firecamp/ui';
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

const InviteMembers: FC<IModal> = ({ opened = false, onClose = () => {} }) => {
  const { scope, organization } = usePlatformStore(s => ({
    scope: s.scope,
    organization: s.organization
  }));

  const [isFetchingMembers, setIsFetchingMembers] = useState(false);
  const [orgMembers, setOrgMembers] = useState([]);

  const [nonOrgTabState, setNonOrgTabState] = useState<{
    role: EUserRolesWorkspace;
    usersList: Array<{
      name: string;
      email: string;
    }>;
  }>({
    role: EUserRolesWorkspace.Collaborator,
    usersList: [
      { name: '', email: '' },
      { name: '', email: '' },
      { name: '', email: '' },
    ],
  });
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
    <Drawer
      opened={opened}
      onClose={onClose}
      size={576}
      title={
        <div className="text-lg leading-5 px-1 flex items-center font-medium">
          Invite Members To Join The Workspace
        </div>
      }
      classNames={{
        body: 'pb-4 h-[90vh]',
      }}
    >
      <Container>
        {(scope == EPlatformScope.Person) ? (
          <Container.Body className="mt-8">
            <InviteNotAllowed />
          </Container.Body>
        ) : (
          <>
            <Container.Header className="!pt-4">
              <SecondaryTab
                className="flex items-center pb-6 -ml-2"
                list={tabs}
                activeTab={activeTab}
                onSelect={(tabId: EInviteMemberTabs) => setActiveTab(tabId)}
              />
            </Container.Header>
            <Container.Body>
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
            </Container.Body>
          </>
        )}
      </Container>
    </Drawer>
  );
};
export default InviteMembers;

const InviteNotAllowed = () => {
  return (
    <Notes
      title={
        'Inviting users to your personal workspace is currently unavailable.'
      }
      description={`But don't worry! <br/>
        You can still collaborate effectively by taking the first step to create an organization. 🤝 <br/>
        Start working together seamlessly and efficiently with your team in no time!`}
    />
  );
};
