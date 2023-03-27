import { FC, useCallback, useState } from 'react';
import {
  Button,
  DropdownV2,
  Editor,
  Notes,
  Container,
  Popover,
} from '@firecamp/ui';
import { EEditorLanguage } from '@firecamp/types';
import { _array, _misc } from '@firecamp/utils';
import { EUserRolesWorkspace } from '../../../../../types';
import { useWorkspaceStore } from '../../../../../store/workspace';

interface IMember {
  name: string;
  email: string;
}

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

const InviteNonOrgMembers = ({ state, onChange }) => {
  const { inviteNonOrgMembers } = useWorkspaceStore.getState();
  const [error, setError] = useState<IMember[]>([]);
  const [isInvitingMembers, setInvitingFlag] = useState(false);
  const { value, role } = state;

  const inviteMembers = useCallback(() => {
    const { success, error } = parseMembersFromEditorValue(value);
    console.log(success, error);
    if (error?.length) {
      setError(error);
      setInvitingFlag(false);
    } else {
      inviteNonOrgMembers({ role, members: success }).finally(() => {
        setInvitingFlag(false);
      });
    }
  }, [value, role]);

  const _role = RoleOptions.find((r) => r.id == role);
  return (
    <Container className="gap-2 invisible-scrollbar">
      <Container.Header>
        <RoleDD
          role={_role}
          onSelect={({ name, id }) => onChange({ role: id })}
        />
        <div className="text-sm font-semibold leading-3 text-appForegroundInActive">
          Use comma separated name and email. use multiple lines to invite in
          bulk.
          <Popover
            content={
              <Notes
                description={`Alice, alice@me.com <br> Bobr, bobr@me.com <br>`}
              />
            }
          >
            <Popover.Handler className="!text-link hover:!text-link hover:underline cursor-pointer text-sm ">
              See Example
            </Popover.Handler>
          </Popover>
        </div>
      </Container.Header>
      <Container.Body className="invisible-scrollbar w-[32rem]">
        <Editor
          className="border border-appBorder h-80"
          value={value}
          onChange={(e) => onChange({ value: e.target.value })}
          language={EEditorLanguage.Text}
          monacoOptions={{
            fontFamily: 'inter, System-ui',
          }}
        />

        {error?.length ? (
          <ul className="text-error border px-2">
            The following email address(es) are not valid
            {error.map((e, i) => (
              <li key={i}>
                {i + 1}. {e.email}
                {i + 1 !== error.length ? ', ' : ''}
              </li>
            ))}
          </ul>
        ) : (
          <></>
        )}
      </Container.Body>
      <Container.Footer>
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
        <label className="text-base text-appForeground">
          Invite members as{' '}
        </label>

        <DropdownV2
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
          displayDefaultOptionClassName={2}
          optionContainerClassName={'w-36 bg-popoverBackground z-[1000]'}
          options={RoleOptions}
          onSelect={_onSelect}
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
  error: IMember[];
}

const parseMembersFromEditorValue = (value: string): IMemberParseResult => {
  const inputLines = value.trim().split('\n');
  const successResult: IMember[] = [];
  const errorResult: IMember[] = [];
  const successEmails: Set<string> = new Set();

  inputLines.forEach((line) => {
    const [name, email] = line.split(',').map((s) => s.trim());
    if (!isValidEmail(email)) {
      errorResult.push({ name, email });
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
  // TODO: use standard email validation regex here
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
