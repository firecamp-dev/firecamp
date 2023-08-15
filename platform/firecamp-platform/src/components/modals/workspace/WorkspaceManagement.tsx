import { FC, useEffect, useState } from 'react';
import { IWorkspace } from '@firecamp/types';
import {
  Container,
  Drawer,
  IModal,
  SecondaryTab,
  ProgressBar,
} from '@firecamp/ui';
import { _array, _misc } from '@firecamp/utils';
import { Rest } from '@firecamp/cloud-apis';
import { useWorkspaceStore, IWorkspaceStore } from '../../../store/workspace';
import EditInfoTab from './tabs/EditInfoTab';
import MembersTab from './tabs/MembersTab';
import PendingInviteMembersTab from './tabs/PendingInviteMembersTab';
import platformContext from '../../../services/platform-context';
import './workspace.scss';

enum ETabTypes {
  Edit = 'edit',
  Members = 'members',
  PendingInvitation = 'pending_invitation',
}
const WorkspaceManagement: FC<IModal> = ({
  opened = false,
  onClose = () => {},
}) => {
  let { workspace, setWorkspace } = useWorkspaceStore((s: IWorkspaceStore) => ({
    workspace: s.workspace,
    setWorkspace: s.setWorkspace,
  }));

  const [isRequesting, setIsRequesting] = useState(false);
  const [wrsMembers, setWrsMembers] = useState([]);
  const [wrsInviteMembers, setWrsInviteMembers] = useState([]);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);
  const [activeTab, setActiveTab] = useState<ETabTypes>(ETabTypes.Edit);

  const tabs = [
    { name: 'Edit', id: ETabTypes.Edit },
    { name: 'Members', id: ETabTypes.Members },
    { name: 'Pending Invitation', id: ETabTypes.PendingInvitation },
  ];

  /** fetch wrs members to be shown on second tab activated, only fetch once */
  useEffect(() => {
    if (
      [ETabTypes.Members, ETabTypes.PendingInvitation].includes(activeTab) &&
      activeTab === ETabTypes.Members
        ? wrsMembers.length === 0
        : wrsInviteMembers.length === 0
    ) {
      setIsFetchingMembers(true);
      Rest.workspace
        .getMembers(workspace.__ref.id)
        .then((res) => res.data)
        .then(({ members = [], invited = [] }) => {
          const memberList = members.map((m, i) => {
            return {
              id: m.__ref?.id ?? i,
              name: m.name || m.username,
              email: m.email,
              role: m.role,
            };
          });
          const invitedMemberList = invited.map((m, i) => {
            return {
              id: m.__ref?.id ?? i,
              name: m.name || m.username,
              email: m.email,
              role: m.role,
            };
          });
          setWrsMembers(memberList);
          setWrsInviteMembers(invitedMemberList);
        })
        .finally(() => setIsFetchingMembers(false));
    }
  }, [activeTab]);

  const onUpdate = ({ name, description }) => {
    if (isRequesting) return;
    const _name = name.trim();
    const _description = description?.trim();

    const _wrs: Partial<IWorkspace> = {};
    if (workspace.name !== _name) {
      _wrs.name = _name;
    }
    if (workspace.description !== _description) {
      _wrs.description = _description;
    }

    setIsRequesting(true);
    Rest.workspace
      .update(workspace.__ref.id, _wrs)
      .then((res) => res.data)
      .then(({ error, message }) => {
        if (!error) {
          platformContext.app.notify.success(
            "The workspace's detail has been changed successfully."
          );
          setWorkspace({ ...workspace, ..._wrs } as IWorkspace);
        } else {
          platformContext.app.notify.alert(message);
        }
      })
      .catch((e) => {
        platformContext.app.notify.alert(e.response?.data.message || e.message);
      })
      .finally(() => {
        setIsRequesting(false);
      });
  };

  const renderTab = (tabId: string) => {
    switch (tabId) {
      case ETabTypes.Edit:
        return (
          <EditInfoTab
            workspace={workspace}
            isRequesting={isRequesting}
            handleSubmit={onUpdate}
            disabled={false} // TODO: only allowed for owner & admin
          />
        );
      case ETabTypes.Members:
        return (
          <MembersTab
            members={wrsMembers}
            isFetchingMembers={isFetchingMembers}
          />
        );
      case ETabTypes.PendingInvitation:
        return (
          <PendingInviteMembersTab
            members={wrsInviteMembers}
            isFetchingMembers={isFetchingMembers}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <div className="text-lg leading-5 px-2 flex items-center font-medium">
          Workspace Management
        </div>
      }
      size={550}
      classNames={{
        body: '!p-4 h-[90vh]',
      }}
    >
      <>
        <ProgressBar active={isRequesting} />
        <Container>
          <Container.Header>
            <SecondaryTab
              className="flex items-center w-full"
              list={tabs}
              activeTab={activeTab}
              onSelect={(tabId: ETabTypes) => setActiveTab(tabId)}
            />
          </Container.Header>
          <Container.Body>{renderTab(activeTab)}</Container.Body>
        </Container>
      </>
    </Drawer>
  );
};

export default WorkspaceManagement;
