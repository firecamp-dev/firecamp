import { useCallback, useState } from 'react';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import cx from 'classnames';
import { Info } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  Container,
  Popover,
  ScrollArea,
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
  const [isOpen, toggleOpen] = useState(false);
  const { usersList, role } = state;

  const inviteMembers = useCallback(() => {
    setInvitingFlag(true);
    const { success, error } = validateMembersDetail(usersList);
    if (error?.length) {
      setError(error);
      setInvitingFlag(false);
    } else {
      inviteNonOrgMembers({ role, members: success }).finally(() => {
        //reset error & user listing after invite is sent
        setInvitingFlag(false);
        setError([]);
        onChange({ usersList: [{ name: '', email: '' }] });
      });
    }
  }, [usersList, role]);

  const _role = RoleOptions.find((r) => r.id == role);
  return (
    <Container className="gap-2 invisible-scrollbar">
      <Container.Header>
        <div className={'pb-6'}>
          <div className="relative flex">
            <label className="text-app-foreground text-sm mb-1 block">
              Invite members as
            </label>
            <Popover content={<RolesCallout role={_role.id} />}>
              <Popover.Handler className="!text-link hover:!text-link hover:underline cursor-pointer text-sm ml-1">
                <Info size={16} />
              </Popover.Handler>
            </Popover>
          </div>

          <DropdownMenu
            onOpenChange={(v) => toggleOpen(v)}
            handler={() => (
              <Button
                text={_role.name || 'Select role'}
                classNames={{
                  inner: 'flex justify-between w-full',
                }}
                rightIcon={
                  <VscTriangleDown
                    size={12}
                    className={cx({ 'transform rotate-180': isOpen })}
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
            onSelect={({ name, id }) => onChange({ role: id })}
            width={512}
            sm
          />
        </div>
      </Container.Header>
      <Container.Body className="invisible-scrollbar w-[32rem]">
        <ScrollArea>
          <InviteUsersForm
            error={error}
            usersList={usersList}
            onChange={(list) => onChange({ usersList: list })}
          />
        </ScrollArea>
      </Container.Body>
      <Container.Footer className="flex items-center">
        <Button
          onClick={() => {
            platformContext.app.modals.openWorkspaceManagement();
          }}
          text="Open Workspace Management"
          // classNames={{
          //   root: '!text-link hover:!text-link hover:underline'
          // }}
          ghost
          xs
        />
        <Button
          text={isInvitingMembers ? 'Sending invitation...' : 'Send Invitation'}
          classNames={{
            root: 'ml-auto',
          }}
          disabled={isInvitingMembers}
          onClick={inviteMembers}
          primary
          xs
        />
      </Container.Footer>
    </Container>
  );
};

export default InviteNonOrgMembers;

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
