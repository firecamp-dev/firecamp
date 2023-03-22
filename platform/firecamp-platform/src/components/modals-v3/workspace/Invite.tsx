import { FC, useCallback, useState } from 'react';
import {
  Modal,
  IModal,
  Button,
  DropdownV2,
  SecondaryTab,
  Editor,
  Notes,
  Container,
  Popover,
} from '@firecamp/ui';
import { EEditorLanguage } from '@firecamp/types';
import { _array, _misc } from '@firecamp/utils';
import { EUserRolesWorkspace, ERegex } from '../../../types';
import './workspace.scss';
import { useWorkspaceStore } from '../../../store/workspace';

interface IMember {
  name: string;
  email: string;
}

enum EInviteMemberTabs {
  NewMembers = 'new_members',
  ExistingMembers = 'existing_members',
}
const Invite: FC<IModal> = ({ isOpen = false, onClose = () => {} }) => {
  const { inviteMembers } = useWorkspaceStore.getState();
  const [iInProgress, setIInProgress] = useState(false);
  const [newMemberEditorValue, setMemberNewEditorValue] = useState('');
  const [activeTab, setActiveTab] = useState<EInviteMemberTabs>(
    EInviteMemberTabs.NewMembers
  );
  const [selectedRole, updateSelectedRole] = useState(
    EUserRolesWorkspace.Collaborator
  );
  const tabs = [
    { name: 'Invite New Members', id: EInviteMemberTabs.NewMembers },
    {
      name: "Invite Organization's Members",
      id: EInviteMemberTabs.ExistingMembers,
    },
  ];

  const sendInvitation = (members) => {
    inviteMembers({ role: 2, members });
  };
  return (
    <>
      <Modal.Header className="border-b border-appBorder">
        <div className="text-lg leading-5 px-6 py-4 flex items-center font-medium">
          INVITE MEMBERS IN WORKSPACE
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="p-4 h-full flex flex-col">
          {/* <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
            use the link for add people in to workspace
          </label>
          <div className="flex border !border-inputBorder rounded-sm leading-5 outline-none placeholder-inputPlaceholder focus:bg-inputFocusBackground w-fit px-3 py-1 bg-focus1">
            <span className="block mr-2">
              http://firecame.com/codebasics/invitemember
            </span>
            <CopyButton text={inviteUrl} />
          </div>
          <div className="flex items-center text-appForegroundInActive my-5">
            <span>OR</span>
            <hr className="flex-1 ml-2"></hr>
          </div> */}

          <SecondaryTab
            className="flex items-center pb-6 -ml-2"
            list={tabs}
            activeTab={activeTab}
            onSelect={(tabId: EInviteMemberTabs) => setActiveTab(tabId)}
          />
          {activeTab == EInviteMemberTabs.NewMembers ? (
            <>
              <div className="flex items-center">
                <RoleDD
                  role={selectedRole}
                  onSelect={(val: any) => updateSelectedRole(val.name)}
                />
              </div>
              <InviteNewMembers
                value={newMemberEditorValue}
                onChange={setMemberNewEditorValue}
                invitingInProgress={iInProgress}
                sendInvitation={sendInvitation}
              />
            </>
          ) : (
            <InviteExistingMembers
              invitingInProgress={iInProgress}
              sendInvitation={sendInvitation}
            />
          )}
        </div>
      </Modal.Body>
    </>
  );
};
export default Invite;

const InviteNewMembers = ({
  value,
  onChange = (_) => {},
  sendInvitation = (_) => {},
  invitingInProgress = false,
}) => {
  const [error, setError] = useState<IMember[]>([]);

  const inviteMembers = useCallback(() => {
    const { success, error } = parseMembersFromEditorValue(value);
    console.log(success, error);
    if (error?.length) {
      setError(error);
    } else {
      sendInvitation(success);
    }
  }, [value]);

  return (
    <Container className="gap-2">
      <Container.Header className="text-sm font-semibold leading-3 text-appForegroundInActive">
        {/* Send invitation to your team members to join the workspace */}
        Use comma separated name and email. use multiple lines to invite in
        bulk.{' '}
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
      </Container.Header>
      <Container.Body className="invisible-scrollbar w-[32rem]">
        <Editor
          className="border border-appBorder h-80"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          language={EEditorLanguage.Text}
          monacoOptions={{
            fontFamily: 'inter, System-ui',
          }}
        />

        {error?.length ? (
          <div className="mb-2 text-error">
            Invalid Emails
            <ul>
              {error.map((e, i) => (
                <li key={i}>
                  {i + 1}. {e.email}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <></>
        )}
      </Container.Body>
      <Container.Footer>
        <Button
          className="ml-auto"
          text={
            invitingInProgress ? 'Sending invitation...' : 'Send Invitation'
          }
          disabled={invitingInProgress}
          onClick={inviteMembers}
          primary
          sm
        />
      </Container.Footer>
    </Container>
  );
};

const RoleOptions = [
  {
    id: 'selectRole',
    name: 'select role',
    disabled: true,
    className:
      '!pb-1 !pt-3 uppercase !text-xs font-medium leading-3 font-sans ',
  },
  {
    id: 'Admin',
    name: 'Admin',
    className:
      'px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none',
  },
  {
    id: 'Collaborator',
    name: 'Collaborator',
    className:
      'px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none',
  },
];
const RoleDD: FC<{
  role: EUserRolesWorkspace;
  onSelect: (role: EUserRolesWorkspace) => void;
}> = ({ role, onSelect }) => {
  const _onSelect = (option, e) => {
    onSelect(
      option == 'Admin'
        ? EUserRolesWorkspace.Admin
        : EUserRolesWorkspace.Collaborator
    );
  };
  const roleText = role == EUserRolesWorkspace.Admin ? 'Admin' : 'Collaborator';
  return (
    <>
      <div className="pb-3">
        <label className="text-base">Invite members as </label>

        <DropdownV2
          handleRenderer={() => (
            <Button
              text={roleText}
              className="font-bold hover:!bg-focus1"
              withCaret
              transparent
              ghost
              sm
            />
          )}
          displayDefaultOptionClassName={2}
          optionContainerClassName={'w-36 bg-popoverBackground z-[1000]'}
          option={RoleOptions}
          onSelect={_onSelect}
        />
      </div>

      <a
        href="/"
        className="!text-link hover:!text-link hover:underline cursor-pointer text-sm ml-auto pb-3"
        target="_blank"
      >
        learn more
      </a>
    </>
  );
};

const InviteExistingMembers = ({
  sendInvitation = (_) => {},
  invitingInProgress = false,
}) => {
  const [user, updateUser] = useState();
  const [role, updateRole] = useState();
  const UserOptions = [
    {
      id: 1,
      name: 'User 1',
      className:
        'px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none',
    },
    {
      id: 2,
      name: 'User 2',
      className:
        'px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none',
    },
    {
      id: 3,
      name: 'User 3',
      className:
        'px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none',
    },
    {
      id: 4,
      name: 'User 4',
      className:
        'px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none',
    },
  ];

  const inviteMembers = () => {
    console.log(`send existing member invitation`, { user, role });
    // sendInvitation({user, role});
  };

  return (
    <Container className="gap-2">
      <Container.Header className="text-sm font-semibold leading-3 text-appForegroundInActive">
        Send invitation to your team members to join the workspace
      </Container.Header>
      <Container.Body className="invisible-scrollbar w-[32rem] h-80">
        <div className="flex justify-between pb-3">
          <label className="text-base">Select User</label>
          <DropdownV2
            handleRenderer={() => (
              <Button
                text={user || 'Select User'}
                className="font-bold hover:!bg-focus1"
                withCaret
                transparent
                ghost
                sm
              />
            )}
            displayDefaultOptionClassName={2}
            optionContainerClassName={'w-36 bg-popoverBackground z-[1000]'}
            option={UserOptions}
            onSelect={(val) => updateUser(val.name)}
          />
        </div>

        <div className="flex justify-between pb-3">
          <label className="text-base">Select Role </label>
          <DropdownV2
            handleRenderer={() => (
              <Button
                text={role || 'Select role'}
                className="font-bold hover:!bg-focus1"
                withCaret
                transparent
                ghost
                sm
              />
            )}
            displayDefaultOptionClassName={2}
            optionContainerClassName={'w-36 bg-popoverBackground z-[1000]'}
            option={RoleOptions.slice(1)}
            onSelect={(val) => updateRole(val.name)}
          />
        </div>
      </Container.Body>
      <Container.Footer>
        <Button
          className="ml-auto"
          text={'Send Invitation'}
          disabled={invitingInProgress}
          onClick={inviteMembers}
          primary
          sm
        />
      </Container.Footer>
    </Container>
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
