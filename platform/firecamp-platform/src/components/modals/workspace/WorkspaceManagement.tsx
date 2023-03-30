import { FC, useEffect, useRef, useState } from 'react';
import {
  Input,
  TextArea,
  Container,
  TabHeader,
  Button,
  Modal,
  IModal,
  SecondaryTab,
  PrimitiveTable,
  TTableApi,
  ProgressBar,
  DropdownV2,
} from '@firecamp/ui';
import { _misc } from '@firecamp/utils';
import { Rest } from '@firecamp/cloud-apis';
import { VscTrash } from '@react-icons/all-files/vsc/VscTrash';
import { useWorkspaceStore, IWorkspaceStore } from '../../../store/workspace';
import { EUserRolesWorkspace } from '../../../types';
import platformContext from '../../../services/platform-context';
import './workspace.scss';

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
  const [error, setError] = useState({ name: '' });

  const tabs = [
    { name: 'Edit', id: ETabTypes.Edit },
    { name: 'Members', id: ETabTypes.Members },
  ];
  const [activeTab, setActiveTab] = useState<ETabTypes>(ETabTypes.Edit);

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
        return <MembersTab />;
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
        <Container className="with-divider">
          <Container.Body className="flex flex-col">
            <SecondaryTab
              className="flex items-center py-3 w-full"
              list={tabs}
              activeTab={activeTab}
              onSelect={(tabId: ETabTypes) => setActiveTab(tabId)}
            />
            {renderTab(activeTab)}
          </Container.Body>
        </Container>
      </Modal.Body>
    </>
  );
};

export default WorkspaceManagement;

const EditInfoTab: FC<any> = ({
  workspace,
  error,
  isRequesting,
  onSubmit,
  onChange,
  close,
}) => {
  return (
    <div className="p-6 flex-1 flex flex-col">
      <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
        UPDATE WORKSPACE INFO
      </label>
      <div className="mt-8">
        <Input
          autoFocus={true}
          label="Name"
          placeholder="Workspace name"
          name={'name'}
          defaultValue={workspace.name || ''}
          onChange={onChange}
          onKeyDown={() => {}}
          onBlur={() => {}}
          error={error.name}
          // error={error.name}
          // iconPosition="right"
          // icon={<VscEdit />}
        />
      </div>

      <TextArea
        type="text"
        minHeight="200px"
        label="Description (optional)"
        labelClassName="fc-input-label"
        placeholder="Description"
        note="Markdown supported in description"
        name={'description'}
        defaultValue={workspace.description || ''}
        onChange={onChange}
        // disabled={true}
        // iconPosition="right"
        // icon={<VscEdit />}
        className="mb-auto"
      />
      <TabHeader className="p-0">
        <TabHeader.Right>
          <Button
            text="Cancel"
            onClick={(e) => close(e)}
            transparent
            secondary
            ghost
            sm
          />
          <Button
            text={isRequesting ? 'Updating...' : 'Update'}
            onClick={onSubmit}
            disabled={isRequesting}
            primary
            sm
          />
        </TabHeader.Right>
      </TabHeader>
    </div>
  );
};

const columns = [
  { id: 'index', name: 'No.', key: 'index', width: '20px' },
  { id: 'name', name: 'Name', key: 'name', width: '100px' },
  {
    id: 'email',
    name: 'Email',
    key: 'email',
    resizeWithContainer: true,
    width: '180px',
  },
  { id: 'role', name: 'Role', key: 'role', width: '50px' },
  { id: 'action', name: '', key: '', width: '20px' },
];

const RoleOptions = [
  {
    id: 'RoleHeader',
    name: 'SELECT ROLE',
    disabled: true,
    headerList: [
      {
        id: EUserRolesWorkspace.Owner,
        name: 'Owner',
      },
      {
        id: EUserRolesWorkspace.Admin,
        name: 'Admin',
      },
      {
        id: EUserRolesWorkspace.Collaborator,
        name: 'Collaborator',
      },
    ],
  },
];
const MembersTab = () => {
  const [isRequesting, setIsRequesting] = useState(false);
  const workspace = useWorkspaceStore.getState().workspace;
  const tableApi = useRef<TTableApi>(null);

  useEffect(() => {
    setIsRequesting(true);
    Rest.workspace
      .getMembers(workspace.__ref.id)
      .then((res) => res.data)
      .then(({ members = [], invited }) => {
        members.map((m, i) => {
          return {
            id: m.__ref?.id ?? i,
            name: m.name || m.username,
            email: m.email,
            role: m.role,
          };
        });
        tableApi.current.initialize([
          ...members,
          {
            email: 'charmi@jsbot.io',
            id: 'OQDf0vmSCk-gTs39sQ6by',
            name: 'Charmi',
            role: 1,
          },
          {
            email: 'dnishchit1@gmail.com',
            id: 'OQDf0vmSCk-gTs39sQ6by1',
            name: 'nishchit14',
            role: 2,
          },
        ]);
      })
      .catch(console.log)
      .finally(() => setIsRequesting(false));
  }, []);

  const onRemoveMember = (row) => {
    platformContext.window.confirm({
      title: `You're sure to remove ${row.role.name} from the workspace?`,
      message: '',
      texts: {
        btnCancel: 'Cancel',
        btnConfirm: 'Yes, remove the member.',
      },
      onConfirm: () => {
        Rest.workspace
          .removeMember(workspace.__ref.id, row.id)
          .then(() => {
            tableApi.current.removeRow(row.id);
            platformContext.app.notify.success(
              'The member has been removed successfully.'
            );
          })
          .catch((e) => {
            platformContext.app.notify.alert(
              e.response?.data.message || e.message
            );
          });
      },
      onCancel: () => {},
      onClose: () => {},
    });
  };

  const onChangeRole = (row) => {
    platformContext.window.confirm({
      title: `Please conform, You're assigning  ${row.role.name} role to ${row.name}, right?`,
      message: '',
      texts: {
        btnCancel: 'Cancel',
        btnConfirm: 'Yes, change the role.',
      },
      onConfirm: () => {
        Rest.workspace
          .changeMemberRole(workspace.__ref.id, row.id, row.role)
          .then(() => {
            tableApi.current.setRow({ ...row, role: row.role.id });
            platformContext.app.notify.success(
              "The member's role has been changed successfully."
            );
          })
          .catch((e) => {
            platformContext.app.notify.alert(
              e.response?.data.message || e.message
            );
          });
      },
      onCancel: () => {},
      onClose: () => {},
    });
  };

  const renderCell = (column, cellValue, rowIndex, row, tableApi, onChange) => {
    switch (column.id) {
      case 'index':
        return <div className="px-2"> {rowIndex + 1} </div>;
        break;
      case 'name':
        // return value;
        return <div style={{ padding: 4 }}>{cellValue}</div>;
        break;
      case 'email':
        // return value;
        return <div style={{ padding: 4 }}>{cellValue}</div>;
        break;
      case 'role':
        return (
          <div style={{ padding: 4 }}>
            <RoleDD
              role={row.role}
              onSelect={(role) => onChangeRole({ ...row, role })}
            />
          </div>
        );
        break;
      case 'action':
        return (
          <div className="px-2">
            <VscTrash
              size={14}
              className="text-error cursor-pointer"
              onClick={() => onRemoveMember(row)}
            />
          </div>
        );
        break;
      default:
        return column.key;
    }
  };

  if (isRequesting) <ProgressBar active={isRequesting} />;
  return (
    <Container className="gap-2">
      <Container.Body className="pt-2">
        <PrimitiveTable
          classes={{ table: '!m-0' }}
          columns={columns}
          rows={[]}
          showDefaultEmptyRows={false}
          renderColumn={(c) => c.name}
          renderCell={renderCell}
          onChange={console.log}
          onMount={(api) => (tableApi.current = api)}
        />
      </Container.Body>
      <Container.Footer>
        <Button
          text={'Invite new member'}
          onClick={() => platformContext.app.modals.openInviteMembers()}
          className="ml-auto"
          primary
          sm
        />
      </Container.Footer>
    </Container>
  );
};

const RoleDD: FC<{
  role: number;
  onSelect: (role: { name: string; id: number }) => void;
}> = ({ role, onSelect }) => {
  const _role = RoleOptions[0].headerList.find((r) => r.id == role);

  return (
    <DropdownV2
      handleRenderer={() => (
        <Button
          text={_role.name}
          className="hover:!bg-focus1 ml-2"
          withCaret
          transparent
          ghost
          sm
        />
      )}
      disabled={role === EUserRolesWorkspace.Owner}
      classes={{
        options: 'w-36 bg-popoverBackground z-[1000]',
        header:
          '!pb-1 !pt-3 !px-5 !text-xs text-activityBarInactiveForeground font-medium relative font-sans leading-3',
        headerListItem:
          'py-1 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-4 focus-visible:!shadow-none',
      }}
      options={RoleOptions}
      onSelect={onSelect}
    />
  );
};
