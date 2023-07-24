import { FC, useCallback, useState } from 'react';
import cx from 'classnames';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import {
  Button,
  Container,
  FormField,
  ProgressBar,
  DropdownMenu,
} from '@firecamp/ui';
import RolesCallout from '../RolesCallout';
import { _array, _misc } from '@firecamp/utils';
import { EUserRolesWorkspace } from '../../../../../types';
import { useWorkspaceStore } from '../../../../../store/workspace';
import platformContext from '../../../../../services/platform-context';

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

const InviteOrgMembers: FC<IProps> = ({
  state: member,
  members = [],
  isFetchingMembers = false,
  onChange,
}) => {
  const { inviteOrgMembers } = useWorkspaceStore.getState();
  const [isInvitingMembers, setInvitingFlag] = useState(false);
  const [isOpen, toggleOpen] = useState(false);
  const [rolePreview, toggleRolePreview] = useState(false);

  // send new / existing member invitation
  const sendInvitation = useCallback(() => {
    if (!member.id || !member.email || !member.role) return;
    setInvitingFlag(true);
    inviteOrgMembers(
      [{ id: member.id, name: member.name, email: member.email }],
      member.role
    ).finally(() => {
      setInvitingFlag(false);
    });
  }, [member]);

  const _role = RoleOptions.find((r) => r.id == member.role);
  return (
    <Container className="gap-3">
      <Container.Header className="text-base font-semibold leading-3 text-app-foreground-inactive p-6">
        Invite your team colleagues to join the workspace.
      </Container.Header>
      <Container.Body className="invisible-scrollbar w-[32rem] h-80">
        <FormField
          label="Invite member from your organization"
          className="relative"
        >
          <DropdownMenu
            onOpenChange={(v) => toggleOpen(v)}
            handler={() => (
              <div className="relative">
                <Button
                  text={member.name || 'Select member'}
                  classNames={{
                    inner: 'flex justify-between w-full',
                  }}
                  rightIcon={
                    <VscTriangleDown
                      size={12}
                      className={cx({ 'transform rotate-180': isOpen })}
                    />
                  }
                  disabled={members.length === 0}
                  outline
                  fullWidth
                  sm
                />
                <ProgressBar className="top-auto" active={isFetchingMembers} />
              </div>
            )}
            options={members}
            onSelect={(m) => onChange({ ...member, ...m })}
            classNames={{
              trigger: 'block',
              dropdown: '-mt-2 overflow-y-scroll invisible-scrollbar h-[200px]',
              item: '!px-4',
            }}
            width={512}
            sm
          />
        </FormField>
        <FormField label="Assign role for selected member">
          <DropdownMenu
            onOpenChange={(v) => toggleRolePreview(v)}
            handler={() => (
              <Button
                text={_role.name || 'Select role'}
                classNames={{
                  inner: 'flex justify-between w-full',
                }}
                rightIcon={
                  <VscTriangleDown
                    size={12}
                    className={cx({ 'transform rotate-180': rolePreview })}
                  />
                }
                outline
                fullWidth
                sm
              />
            )}
            options={RoleOptions}
            classNames={{
              trigger: 'block',
              dropdown: '-mt-2',
              item: '!px-4',
            }}
            onSelect={({ name, id }) => onChange({ ...member, role: id })}
            width={512}
            sm
          />
        </FormField>
        <RolesCallout role={_role.id} />
      </Container.Body>
      <Container.Footer className="flex items-center">
        <Button
          onClick={() => {
            platformContext.app.modals.openWorkspaceManagement();
          }}
          // classNames={{
          //   root: '!text-link hover:!text-link hover:underline'
          // }}
          text='Open Workspace Management'
          ghost
          xs
        />
          
        
        <Button
          text={'Send Invitation'}
          disabled={!member.name || !member.role || isInvitingMembers}
          onClick={sendInvitation}
          classNames={{
            root: 'ml-auto inline',
          }}
          primary
          xs
        />
      </Container.Footer>
    </Container>
  );
};

export default InviteOrgMembers;

type TMember = {
  id: string;
  name: string;
  email: string;
  role: EUserRolesWorkspace;
};
interface IProps {
  state: TMember;
  members: { id: string; name: string; email: string }[];
  isFetchingMembers: boolean;
  onChange: Function;
}
