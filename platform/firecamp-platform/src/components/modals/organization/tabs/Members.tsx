import { FC, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import cx from 'classnames';
import {
  Button,
  Container,
  DropdownMenu,
  PrimitiveTable,
  TTableApi,
} from '@firecamp/ui';
import { _array } from '@firecamp/utils';
import { Rest } from '@firecamp/cloud-apis';
import platformContext from '../../../../services/platform-context';
import { EUserRolesWorkspace } from '../../../../types';
import { getFormalDate } from '../OrgManagement';

const columns = [
  { id: 'index', name: 'No.', key: 'index', width: '35px', fixedWidth: true },
  {
    id: 'name',
    name: 'Name',
    key: 'name',
    width: '100px',
    resizeWithContainer: true,
  },
  {
    id: 'role',
    name: 'Role',
    key: 'role',
    width: '100px',
    fixedWidth: true,
  },
  // {
  //   id: 'joinedAt',
  //   name: 'Joined Date',
  //   key: 'joinedAt',
  //   width: '130px',
  //   fixedWidth: true,
  // },
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

const Members = ({
  organizationId = '',
  members = [],
  updateMembers,
  isFetching = false,
}) => {
  const tableApi = useRef<TTableApi>(null);

  useEffect(() => {
    if (!_array.isEmpty(members)) {
      const memberList = members.map((m, i) => {
        return {
          id: m.id,
          name: m.username,
          role: m.role,
          joinedAt: getFormalDate(m.__ref.joinedAt),
        };
      });
      tableApi.current.initialize(memberList);
    }
  }, [members]);

  const onChangeRole = (row) => {
    platformContext.window.confirm({
      message: `Please confirm, You're assigning  ${row.role.name} role to ${row.name}, right?`,
      labels: {
        cancel: 'Cancel',
        confirm: 'Yes, change the role.',
      },
      onConfirm: () => {
        Rest.organization
          .changeMemberRole(organizationId, row.id, row.role.id)
          .then((res) => res.data)
          .then(({ error, message }) => {
            if (!error) {
              tableApi.current.setRow({ ...row, role: row.role.id });

              // update the member listing after update
              let Index = members.findIndex((m) => m.id == row.id);
              updateMembers([
                ...members.slice(0, Index),
                { ...members[Index], role: row.role.id },
                ...members.slice(Index + 1),
              ]);

              platformContext.app.notify.success(
                "The member's role has been changed successfully."
              );
            } else {
              platformContext.app.notify.alert(message);
            }
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
        return <div className="px-2 text-base"> {rowIndex + 1} </div>;
        break;
      case 'name':
      case 'joinedAt':
        return <div className="p-1 text-base">{cellValue}</div>;
        break;
      case 'role':
        return (
          <div className="p-1 text-center">
            {row.role === EUserRolesWorkspace.Owner ? (
              <div className="px-4 text-base text-selected-text">Owner</div>
            ) : (
              <RoleDD
                role={row.role}
                onSelect={(role) => onChangeRole({ ...row, role })}
              />
            )}
          </div>
        );
        break;
      default:
        return <></>;
    }
  };

  return (
    <Container className="gap-2 pt-2 !h-[80vh]">
      <Container.Body>
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
    </Container>
  );
};
export default Members;

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
            <ChevronDown
              size={12}
              className={cx({ 'transform rotate-180': isOpen })}
            />
          }
          compact
          ghost
          sm
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
