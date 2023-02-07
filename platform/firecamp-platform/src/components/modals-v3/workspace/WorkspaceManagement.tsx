import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  Input,
  TextArea,
  Container,
  TabHeader,
  Button,
  Modal,
  IModal,
  Alert,
  SecondaryTab,
  PrimitiveTable,
  TTableApi,
  Dropdown,
  ProgressBar,
} from '@firecamp/ui-kit';
import { _misc } from '@firecamp/utils';
import { Rest } from '@firecamp/cloud-apis';
import { VscTrash } from '@react-icons/all-files/vsc/VscTrash';

import { EUserRolesWorkspace } from '../../../types';
import { useWorkspaceStore, IWorkspaceStore } from '../../../store/workspace';
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

  let [activeTab, setActiveTab] = useState<ETabTypes>(ETabTypes.Edit);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (error.name) setError({ name: '' });
    setWrs((w) => ({ ...w, [name]: value }));
  };

  const onUpdate = () => {
    if (isRequesting) return;
    const name = wrs.name.trim();
    if (!name || name.length < 3) {
      setError({ name: 'The worksapce name must have minimun 3 characters' });
      return;
    }
    const _wrs = { name, description: wrs?.description?.trim() };

    setIsRequesting(true);

    Rest.workspace.setTimeout(() => {
      setIsRequesting(false);
    }, 5000);
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
              className="flex items-center p-4 w-full pb-0"
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
            secondary
            transparent={true}
            sm
            onClick={(e) => close(e)}
            ghost={true}
          />
          <Button
            text={isRequesting ? 'Updating...' : 'Update'}
            primary
            sm
            onClick={onSubmit}
            disabled={isRequesting}
          />
        </TabHeader.Right>
      </TabHeader>
    </div>
  );
};

const columns = [
  { id: 'index', name: 'No.', key: 'index', width: '30px' },
  { id: 'name', name: 'Name', key: 'name', width: '250px' },
  { id: 'email', name: 'Email', key: 'email', width: '300px' },
  { id: 'role', name: 'Role', key: 'role' },
  { id: 'action', name: '', key: '', width: '50px' },
];

const MembersTab = () => {
  const [isRequesting, setIsRequesting] = useState(false);
  const workspace = useWorkspaceStore.getState().workspace;
  const tableApi = useRef<TTableApi>(null);

  useEffect(() => {
    setIsRequesting(true);
    Rest.workspace
      .getMembers(workspace.__ref.id)
      .then(({ data }) => {
        const members = data.members?.map((m) => {
          return {
            id: m.__ref.id,
            name: m.name || m.username,
            email: m.email,
            role: m.w_relation.role,
          };
        });
        tableApi.current.initialize(members);
      })
      .catch(console.log)
      .finally(() => setIsRequesting(false));
  }, []);

  const onRemoveMember = (row) => {
    const sureToRemove = confirm(
      'Are you sure to remove this user from the workspace?'
    );
    if (sureToRemove) {
      // TODO: add remove api
      tableApi.current.removeRow(row.id);
    }
    console.log(row);
  };

  const onChangeRole = (row) => {
    // TODO: call API
    // Rest.workspace.

    // console.log(row, "...")
    tableApi.current.setRow(row);
  };

  const renderCell = (column, cellValue, rowIndex, row, tableApi, onChange) => {
    switch (column.id) {
      case 'index':
        return <div className="px-2"> {rowIndex + 1} </div>;
        break;
      case 'name':
        // return value;
        return <div style={{ padding: 5 }}>{cellValue}</div>;
        break;
      case 'email':
        // return value;
        return <div style={{ padding: 5 }}>{cellValue}</div>;
        break;
      case 'role':
        return (
          <div style={{ padding: 5 }}>
            {row.role == 1 ? (
              'Owner'
            ) : (
              <RoleDD
                role={row.role}
                onSelect={(role) => onChangeRole({ ...row, role })}
              />
            )}
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

  return (
    <div className="p-6  flex-1 flex flex-col">
      <ProgressBar active={isRequesting} />
      <PrimitiveTable
        columns={columns}
        apiRef={tableApi}
        renderColumn={(c) => c.name}
        renderCell={renderCell}
        onChange={console.log}
        showDefaultEmptyRows={false}
      />

      <TabHeader>
        <TabHeader.Left>
          <Button
            text={'Invite Members'}
            primary
            sm
            onClick={() => platformContext.app.modals.openInviteMembers()}
          />
        </TabHeader.Left>
      </TabHeader>
    </div>
  );
};

const RoleDD: FC<{
  role: EUserRolesWorkspace;
  onSelect: (role: EUserRolesWorkspace) => void;
}> = ({ role, onSelect }) => {
  const options = [
    {
      header: 'select role',
      list: [{ name: 'Admin' }, { name: 'Collaborator' }],
    },
  ];

  const _onSelect = (option, e) => {
    onSelect(
      option.name == 'Admin'
        ? EUserRolesWorkspace.Admin
        : EUserRolesWorkspace.Collaborator
    );
  };
  return (
    <Dropdown>
      <Dropdown.Handler>
        <Button
          text={role == EUserRolesWorkspace.Admin ? 'Admin' : 'Collaborator'}
          sm
          ghost={true}
          transparent={true}
          withCaret={true}
          className="ml-2"
        />
      </Dropdown.Handler>
      <Dropdown.Options
        options={options}
        selected={role == EUserRolesWorkspace.Owner ? 'Admin' : 'Collaborator'}
        onSelect={_onSelect}
      />
    </Dropdown>
  );
};
