import { FC, useEffect, useState } from 'react';
import {
  Container,
  Modal,
  IModal,
  SecondaryTab,
  ProgressBar,
  TabHeader,
  Button,
} from '@firecamp/ui';
import { _array, _misc } from '@firecamp/utils';
import { Rest } from '@firecamp/cloud-apis';
import { useWorkspaceStore, IWorkspaceStore } from '../../../store/workspace';
import platformContext from '../../../services/platform-context';
import './workspace.scss';
import EditInfoTab from './tabs/EditInfoTab';
import MembersTab from './tabs/MembersTab';

enum ETabTypes {
  Edit = 'edit',
  Members = 'members',
}
const WorkspaceManagement: FC<IModal> = ({
  isOpen = false,
  onClose = () => {},
}) => {
  let { workspace } = useWorkspaceStore((s: IWorkspaceStore) => ({
    workspace: s.workspace,
  }));

  const [wrs, setWrs] = useState(workspace);
  const [isRequesting, setIsRequesting] = useState(false);
  const [orgMembers, setOrgMembers] = useState([]);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);
  const [error, setError] = useState({ name: '' });
  const [activeTab, setActiveTab] = useState<ETabTypes>(ETabTypes.Edit);

  const tabs = [
    { name: 'Edit', id: ETabTypes.Edit },
    { name: 'Members', id: ETabTypes.Members },
  ];

  /** fetch org members to be invited on second tab activated, only fetch once */
  useEffect(() => {
    if (activeTab === ETabTypes.Members && orgMembers.length === 0) {
      setIsFetchingMembers(true);
      Rest.workspace
        .getMembers(workspace.__ref.id)
        .then((res) => res.data)
        .then(({ members = [], invited }) => {
          let memberList = members.map((m, i) => {
            return {
              id: m.__ref?.id ?? i,
              name: m.name || m.username,
              email: m.email,
              role: m.role,
            };
          });
          setOrgMembers(memberList);
        })
        .finally(() => setIsFetchingMembers(false));
    }
  }, [activeTab]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (error.name) setError({ name: '' });
    setWrs((w) => ({ ...w, [name]: value }));
  };

  const onUpdate = () => {
    if (isRequesting) return;
    const name = wrs.name.trim();
    if (!name || name.length < 3) {
      setError({ name: 'The workspace name must have minimum 4 characters' });
      return;
    }
    const _wrs = { name, description: wrs?.description?.trim() };

    // TODO: workspace  update API call
  };

  const renderTab = (tabId: string) => {
    // console.log(wrs, "wrs....")
    switch (tabId) {
      case 'edit':
        return (
          <EditInfoTab
            workspace={wrs}
            error={error}
            isRequesting={isRequesting}
            onChange={onChange}
            close={onClose}
            onSubmit={onUpdate}
          />
        );
      case 'members':
        return (
          <MembersTab
            members={orgMembers}
            isFetchingMembers={isFetchingMembers}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <Modal.Header className="with-divider">
        <div className="text-lg leading-5 px-6 py-4 flex items-center font-medium">
          Workspace Management
        </div>
      </Modal.Header>
      <Modal.Body>
        <ProgressBar active={isRequesting} />
        <Container>
          <Container.Header>
            <SecondaryTab
              className="flex items-center !pt-3 w-full"
              list={tabs}
              activeTab={activeTab}
              onSelect={(tabId: ETabTypes) => setActiveTab(tabId)}
            />
          </Container.Header>
          <Container.Body>{renderTab(activeTab)}</Container.Body>
        </Container>
      </Modal.Body>
    </>
  );
};

export default WorkspaceManagement;
