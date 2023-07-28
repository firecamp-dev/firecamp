import { FC, useEffect, useState } from 'react';
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
import platformContext from '../../../services/platform-context';
import './workspace.scss';
import { Regex } from '../../../constants';
import PendingInviteMembersTab from './tabs/PendingInviteMembersTab';

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

  const [wrs, setWrs] = useState(workspace);
  const [isRequesting, setIsRequesting] = useState(false);
  const [wrsMembers, setWrsMembers] = useState([]);
  const [wrsInviteMembers, setWrsInviteMembers] = useState([]);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);
  const [error, setError] = useState({ name: '' });
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

  const onChange = (e, reset) => {
    if (reset) {
      if (error.name) setError({ name: '' });
      setWrs(workspace);
    } else {
      const { name, value } = e.target;
      if (error.name) setError({ name: '' });
      setWrs((w) => ({ ...w, [name]: value }));
    }
  };

  const onUpdate = () => {
    if (isRequesting) return;
    const name = wrs.name.trim();
    const description = wrs.description?.trim();

    if (!name || name.length < 6) {
      setError({ name: 'The workspace name must have minimum 6 characters' });
      return;
    }

    const isValid = Regex.WorkspaceName.test(name);
    if (!isValid) {
      setError({
        name: 'The workspace name must not contain any spaces or special characters.',
      });
      return;
    }

    if (
      workspace.name === wrs.name &&
      workspace.description === wrs.description
    )
      return;

    const _wrs: { name?: string; description?: string } = {};
    if (workspace.name !== name) {
      _wrs.name = name;
    }
    if (workspace.description !== description) {
      _wrs.description = description;
    }

    setIsRequesting(true);
    Rest.workspace
      .update(workspace.__ref.id, _wrs)
      .then(({ error, message }) => {
        if (!error) {
          platformContext.app.notify.success(
            "The workspace's detail has been changed successfully."
          );
          setWorkspace({ ...workspace, ..._wrs });
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
    // console.log(wrs, "wrs....")
    switch (tabId) {
      case ETabTypes.Edit:
        return (
          <EditInfoTab
            workspace={wrs}
            error={error}
            isRequesting={isRequesting}
            onChange={onChange}
            onSubmit={onUpdate}
            enableReset={
              workspace.name !== wrs.name ||
              workspace.description !== wrs.description
            }
            // disabled={true} // TODO: only allowed for owner & admin
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
