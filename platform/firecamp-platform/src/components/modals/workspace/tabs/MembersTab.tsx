import { FC, useEffect, useRef, useState } from 'react';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import cx from 'classnames';
import { Trash2 } from 'lucide-react';
import {
  Button,
  Container,
  DropdownMenu,
  PrimitiveTable,
  ProgressBar,
  TTableApi,
} from '@firecamp/ui';
import { _array } from '@firecamp/utils';
import { Rest } from '@firecamp/cloud-apis';
import platformContext from '../../../../services/platform-context';
import { useWorkspaceStore } from '../../../../store/workspace';
import { EUserRolesWorkspace } from '../../../../types';

const columns = [
  { id: 'index', name: 'No.', key: 'index', width: '35px', fixedWidth: true },
  { id: 'name', name: 'Name', key: 'name', width: '100px' },
  {
    id: 'email',
    name: 'Email',
    key: 'email',
    resizeWithContainer: true,
    width: '180px',
  },
  { id: 'role', name: 'Role', key: 'role', width: '115px', fixedWidth: true },
  { id: 'action', name: '', key: '', width: '35px', fixedWidth: true },
];

const RoleOptions = [
  {
    id: EUserRolesWorkspace.Admin,
    name: 'Admin',
  },
  {
    id: EUserRolesWorkspace.Collaborator,
    name: 'Collaborator',
  },
];

const MembersTab = ({ members = [], isFetchingMembers = false }) => {
  const workspace = useWorkspaceStore.getState().workspace;
  const tableApi = useRef<TTableApi>(null);

  useEffect(() => {
    if (!_array.isEmpty(members)) {
      const memberList = members.map((m, i) => {
        return {
          id: m.id,
          name: m.name || m.username,
          email: m.email,
          role: m.role,
        };
      });
      tableApi.current.initialize(memberList);
    }
  }, [members]);

  const onRemoveMember = (row) => {
    platformContext.window.confirm({
      message: `You're sure to remove ${row.name} from the workspace?`,
      labels: {
        cancel: 'Cancel',
        confirm: 'Yes, remove the member.',
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
    });
  };

  const onChangeRole = (row) => {
    platformContext.window.confirm({
      message: `Please confirm, You're assigning  ${row.role.name} role to ${row.name}, right?`,
      labels: {
        cancel: 'Cancel',
        confirm: 'Yes, change the role.',
      },
      onConfirm: () => {
        Rest.workspace
          .changeMemberRole(workspace.__ref.id, row.id, row.role.id)
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
    });
  };

  const renderCell = (column, cellValue, rowIndex, row, tableApi, onChange) => {
    switch (column.id) {
      case 'index':
        return <div className="px-2"> {rowIndex + 1} </div>;
        break;
      case 'name':
        return <div className="p-1">{cellValue}</div>;
        break;
      case 'email':
        return <div className="p-1">{cellValue}</div>;
        break;
      case 'role':
        return (
          <div className="p-1 text-sm text-center">
            {row.role === EUserRolesWorkspace.Owner ? (
              <div className="px-4 text-selected-text">Owner</div>
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
          <div className={cx("px-2", {"hidden": row.role === EUserRolesWorkspace.Owner})}>
            <Trash2
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
    <Container className="gap-2 pt-2">
      <Container.Body className="visible-scrollbar">
        <ProgressBar active={isFetchingMembers} className={'top-auto'} />
        <PrimitiveTable
          classes={{
            container: 'h-full',
          }}
          columns={columns}
          rows={[]}
          showDefaultEmptyRows={false}
          renderColumn={(c) => c.name}
          renderCell={renderCell}
          onChange={console.log}
          onMount={(api) => (tableApi.current = api)}
        />
      </Container.Body>
      <Container.Footer className="px-3 h-[34px] flex items-center">
        <Button
          onClick={() => {
            platformContext.app.modals.openInviteMembers();
          }}
          text="Invite New Members"
          ghost
          xs
        />
      </Container.Footer>
    </Container>
  );
};
export default MembersTab;

const RoleDD: FC<{
  role: number;
  onSelect: (role: { name: string; id: number }) => void;
}> = ({ role, onSelect }) => {
  const [isOpen, toggleOpen] = useState(false);

  const _role = RoleOptions.find((r) => r.id == role);
  if (!_role) return <></>;

  return (
    <DropdownMenu
      onOpenChange={(v) => toggleOpen(v)}
      handler={() => (
        <Button
          text={_role.name}
          rightIcon={
            <VscTriangleDown
              size={12}
              className={cx({ 'transform rotate-180': isOpen })}
            />
          }
          ghost
          xs
        />
      )}
      options={RoleOptions}
      onSelect={onSelect}
      disabled={role === EUserRolesWorkspace.Owner}
      width={115}
      sm
    />
  );
};
