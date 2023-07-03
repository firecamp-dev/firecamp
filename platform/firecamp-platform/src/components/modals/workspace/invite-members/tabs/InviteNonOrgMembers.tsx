import { FC, useCallback, useState } from 'react';
import {
  Button,
  DropdownMenu,
  Notes,
  Container,
  Popover,
  ScrollBar,
} from '@firecamp/ui';
import RolesCallout from '../RolesCallout';
import InviteUsersForm from '../InviteUsersForm';
import { _array, _misc } from '@firecamp/utils';
import { Regex } from '../../../../../constants';
import { EUserRolesWorkspace } from '../../../../../types';
import { useWorkspaceStore } from '../../../../../store/workspace';
import platformContext from '../../../../../services/platform-context';

interface IMember {
  name: string;
  email: string;
}
interface IMemberDetailError {
  name: string;
  email: string;
  message: string;
  index: number;
}

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

const InviteNonOrgMembers = ({ state, onChange }) => {
  const { inviteNonOrgMembers } = useWorkspaceStore.getState();
  const [error, setError] = useState<IMemberDetailError[]>([]);
  const [isInvitingMembers, setInvitingFlag] = useState(false);
  const { usersList, role } = state;

  const inviteMembers = useCallback(() => {
    const { success, error } = validateMembersDetail(usersList);
    if (error?.length) {
      setError(error);
      setInvitingFlag(false);
    } else {
      inviteNonOrgMembers({ role, members: success }).finally(() => {
        setInvitingFlag(false);
      });
    }
  }, [usersList, role]);

  const _role = RoleOptions.find((r) => r.id == role);
  return (
    <Container className="gap-2 invisible-scrollbar">
      <Container.Header>
        <RoleDD
          role={_role}
          onSelect={({ name, id }) => onChange({ role: id })}
        />
        <RolesCallout role={_role.id} />
      </Container.Header>
      <Container.Body className="invisible-scrollbar w-[32rem]">
        <ScrollBar className="!h-48 mr-1" transparent fullWidth>
          <InviteUsersForm
            error={error}
            usersList={usersList}
            onChange={(list) => onChange({ usersList: list })}
          />
        </ScrollBar>
      </Container.Body>
      <Container.Footer className="flex items-center">
        <a
          className="!text-link hover:!text-link hover:underline cursor-pointer text-sm px-2 pl-0"
          target="_blank"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            platformContext.app.modals.openWorkspaceManagement();
          }}
        >
          Open Workspace Management
        </a>
        <Button
          className="ml-auto"
          text={isInvitingMembers ? 'Sending invitation...' : 'Send Invitation'}
          disabled={isInvitingMembers}
          onClick={inviteMembers}
          primary
          sm
        />
      </Container.Footer>
    </Container>
  );
};

export default InviteNonOrgMembers;

const RoleDD: FC<{
  role: { name: string; id: number };
  onSelect: (role: { name: string; id: number }) => void;
}> = ({ role, onSelect }) => {
  const _onSelect = (option) => {
    onSelect({ name: option.name, id: option.id });
  };
  // const roleText = role == EUserRolesWorkspace.Admin ? 'Admin' : 'Collaborator';
  return (
    <div className="flex items-center pb-3">
      <div>
        <label className="text-base text-app-foreground">
          Invite members as{' '}
        </label>
        <DropdownMenu
          handleRenderer={() => (
            <Button
              text={role.name}
              className="font-bold hover:!bg-focus1"
              withCaret
              transparent
              ghost
              sm
            />
          )}
          options={RoleOptions}
          onSelect={_onSelect}
          width={100}
          sm
        />
      </div>

      <a
        href="#"
        className="!text-link hover:!text-link hover:underline cursor-pointer text-sm ml-auto"
        target="_blank"
      >
        learn more about roles
      </a>
    </div>
  );
};

interface IMemberParseResult {
  success: IMember[];
  error: IMemberDetailError[];
}

const validateMembersDetail = (
  list: Array<{ name: string; email: string }>
): IMemberParseResult => {
  const successResult: IMember[] = [];
  const errorResult: IMemberDetailError[] = [];
  const successEmails: Set<string> = new Set();

  list.forEach((member, index) => {
    const { name, email } = {
      name: member.name.trim(),
      email: member.email.trim(),
    };
    const emailValid = isValidEmail(email);

    if (name.length === 0 || !emailValid) {
      let errorIndex = index,
        nameError = '',
        emailError = '';

      if (name.length === 0) {
        nameError = `Please add name ${emailValid ? '' : ' & '} `;
        if (!emailValid)
          emailError = email?.length > 0 ? ' check email address ' : ' email ';
      } else {
        if (!emailValid)
          emailError =
            email?.length > 0
              ? ' Please check email address '
              : ' Please add email address';
      }

      errorResult.push({
        index: errorIndex,
        name,
        email,
        message: `${nameError} ${emailError} `,
      });
      return;
    }
    if (successEmails.has(email)) return;
    successEmails.add(email);
    successResult.push({ name, email });
  });
  const success = successResult.map((obj) => ({
    name: obj.name,
    email: obj.email,
  }));
  return { success, error: errorResult };
};

const isValidEmail = (email: string): boolean => {
  return Regex.Email.test(email);
};
