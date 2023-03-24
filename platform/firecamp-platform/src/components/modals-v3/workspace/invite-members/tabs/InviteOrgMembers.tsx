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
    id: 'selectRole',
    name: 'select role',
    disabled: true,
    className:
      '!pb-1 !pt-3 uppercase !text-xs font-medium leading-3 font-sans ',
  },
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
  sendInvitation = (_details, status) => {},
  invitingInProgress = false,
  isFetchingMembers = false,
}) => {
  const [user, setUser] = useState({ name: '', error: false });
  const [role, setRole] = useState({
    name: '',
    id: undefined,
    error: false,
  });

  const inviteMembers = () => {
    if (!user.name.length)
      return setUser((detail) => ({ ...detail, error: true }));
    if (!role.id) return setRole((detail) => ({ ...detail, error: true }));

    sendInvitation({ members: user.name, role: role.id }, true);
  };

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
                    { 'border-error': user.error }
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
            onSelect={(val) => setUser({ name: val.name, error: false })}
          />
        </FormGroup>
        <FormGroup label="Assign role for selected member">
          <DropdownV2
            handleRenderer={() => (
              <Button
                text={role.name || 'Select role'}
                className={cx(
                  'hover:!bg-focus1 border border-appBorder justify-between',
                  { 'border-error': role.error }
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
            onSelect={({ name, id }) => setRole({ name, id, error: false })}
          />
        </FormGroup>
      </Container.Body>
      <Container.Footer>
        <Button
          className="ml-auto"
          text={'Send Invitation'}
          disabled={user.error || role.error || invitingInProgress}
          onClick={inviteMembers}
          primary
          sm
        />
      </Container.Footer>
    </Container>
  );
};

export default InviteOrgMembers;
