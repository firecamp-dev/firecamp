import { useState } from 'react';
import cx from 'classnames';
import {
  Button,
  DropdownV2,
  Container,
  FormGroup,
  ProgressBar,
} from '@firecamp/ui';
import { _array, _misc } from '@firecamp/utils';
import { EUserRolesWorkspace } from '../../../../../types';

const RoleOptions = [
  {
    id: EUserRolesWorkspace.Admin,
    name: 'Admin',
    className:
      'px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none',
  },
  {
    id: EUserRolesWorkspace.Collaborator,
    name: 'Collaborator',
    className:
      'px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none',
  },
];

const InviteOrgMembers = ({
  members = [],
  sendInvitation = (member) => {},
  isInvitingMembers = false,
  isFetchingMembers = false,
}) => {
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    role: EUserRolesWorkspace.Collaborator,
  });

  const inviteMember = () => {
    if (!user.id || !user.email || !user.role) return;
    sendInvitation(user);
  };

  const role = RoleOptions.find((r) => r.id == user.role);
  return (
    <Container className="gap-2">
      <Container.Header className="text-base font-semibold leading-3 text-appForegroundInActive p-6">
        Invite your team colleagues to join the workspace.
      </Container.Header>
      <Container.Body className="invisible-scrollbar w-[32rem] h-80">
        <FormGroup
          label="Invite member from your organization"
          className="relative"
        >
          <DropdownV2
            handleRenderer={() => (
              <div className="relative">
                <Button
                  text={user.name || 'Select member'}
                  className={cx(
                    'hover:!bg-focus1 border border-appBorder justify-between',
                    { 'border-error': !user.name }
                  )}
                  disabled={members.length === 0}
                  transparent
                  withCaret
                  fullWidth
                  ghost
                  md
                />
                <ProgressBar className="top-auto" active={isFetchingMembers} />
              </div>
            )}
            displayDefaultOptionClassName={2}
            className="block"
            optionContainerClassName={
              'w-[32rem] bg-popoverBackground z-[1000] -mt-1'
            }
            option={members}
            onSelect={(member) =>
              setUser((u) => ({
                ...u,
                id: member.id,
                name: member.name,
                email: member.email,
              }))
            }
          />
        </FormGroup>
        <FormGroup label="Assign role for selected member">
          <DropdownV2
            handleRenderer={() => (
              <Button
                text={role.name || 'Select role'}
                className={cx(
                  'hover:!bg-focus1 border border-appBorder justify-between'
                )}
                withCaret
                transparent
                fullWidth
                ghost
                md
              />
            )}
            displayDefaultOptionClassName={2}
            optionContainerClassName={
              'w-[32rem] bg-popoverBackground z-[1000] -mt-1'
            }
            option={RoleOptions.slice(1)}
            className="block"
            onSelect={({ name, id }) => setUser((u) => ({ ...u, role: id }))}
          />
        </FormGroup>
      </Container.Body>
      <Container.Footer>
        <Button
          className="ml-auto"
          text={'Send Invitation'}
          disabled={!user.name || !user.role || isInvitingMembers}
          onClick={inviteMember}
          primary
          sm
        />
      </Container.Footer>
    </Container>
  );
};

export default InviteOrgMembers;
