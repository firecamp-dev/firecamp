import { FC, useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
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
  FormGroup,
} from '@firecamp/ui';
import { Rest } from '@firecamp/cloud-apis';
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

const DUMMY_USER_DATA = [
  {
    id: 1,
    name: 'Shreya',
  },
  {
    id: 2,
    name: 'Nishchit',
  },
  {
    id: 3,
    name: 'Radhika',
  },
  {
    id: 4,
    name: 'Charmi',
  },
];

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

const Invite: FC<IModal> = ({ isOpen = false, onClose = () => {} }) => {
  const { inviteMembers } = useWorkspaceStore.getState();
  const [iInProgress, setIInProgress] = useState(false);
  const [newMemberEditorValue, setMemberNewEditorValue] = useState('');
  const [activeTab, setActiveTab] = useState<EInviteMemberTabs>(
    EInviteMemberTabs.NewMembers
  );
  const [selectedRole, updateSelectedRole] = useState({
    name: 'Collaborator',
    id: EUserRolesWorkspace.Collaborator,
  });

  const [isRequesting, setIsRequesting] = useState(false);
  const [existingMemberList, updateExistingMemberList] = useState([]);

  const tabs = [
    { name: 'Invite New Members', id: EInviteMemberTabs.NewMembers },
    {
      name: "Invite Organization's Members",
      id: EInviteMemberTabs.ExistingMembers,
    },
  ];

  useEffect(() => {
    if (
      activeTab === EInviteMemberTabs.ExistingMembers &&
      existingMemberList.length === 0
    ) {
      // setIsRequesting(true);
      // Rest.organization.getMembers(orgId).then((data) => {
      console.log(`api will be called...`);
      const members = DUMMY_USER_DATA.map((m) => {
        return {
          id: m.id,
          name: m.name,
          className:
            ' px-4 text-sm hover:!bg-focus1 focus-visible:!bg-focus1 leading-6 focus-visible:!shadow-none',
        };
      });
      updateExistingMemberList(members);
      // }).catch(console.log)
      //   .finally(() => setIsRequesting(false));
    }
  }, [activeTab]);

  // send new / existing member invitation
  const sendInvitation = (mDetails, eMember = false) => {
    if (eMember) return console.log(`invite existing member`, mDetails);

    console.log(`invite new member`, mDetails); //{members, role}
    // inviteMembers({ role: 2, members });
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
          <SecondaryTab
            className="flex items-center pb-6 -ml-2"
            list={tabs}
            activeTab={activeTab}
            onSelect={(tabId: EInviteMemberTabs) => setActiveTab(tabId)}
          />
          {activeTab == EInviteMemberTabs.NewMembers ? (
            <InviteNewMembers
              value={newMemberEditorValue}
              onChange={setMemberNewEditorValue}
              memberRole={selectedRole}
              updateMemberRole={updateSelectedRole}
              invitingInProgress={iInProgress}
              sendInvitation={sendInvitation}
            />
          ) : (
            <InviteExistingMembers
              memberList={existingMemberList}
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
  memberRole,
  updateMemberRole = (_) => {},
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
      sendInvitation({ members: success, role: memberRole.id });
    }
  }, [value, memberRole]);

  return (
    <Container className="gap-2 invisible-scrollbar">
      <Container.Header>
        <RoleDD
          role={memberRole.name}
          onSelect={({ name, id }) => updateMemberRole({ name, id })}
        />
        <div className="text-sm font-semibold leading-3 text-appForegroundInActive">
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
        </div>
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

const RoleDD: FC<{
  role: string;
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
              text={role}
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
        className="!text-link hover:!text-link hover:underline cursor-pointer text-sm ml-auto"
        target="_blank"
      >
        learn more
      </a>
    </div>
  );
};

const InviteExistingMembers = ({
  memberList = [],
  sendInvitation = (_details, status) => {},
  invitingInProgress = false,
}) => {
  const [user, updateUser] = useState({ name: '', error: false });
  const [role, updateRole] = useState({
    name: '',
    id: undefined,
    error: false,
  });

  const inviteMembers = () => {
    if (!user.name.length)
      return updateUser((detail) => ({ ...detail, error: true }));
    if (!role.id) return updateRole((detail) => ({ ...detail, error: true }));

    sendInvitation({ members: user.name, role: role.id }, true);
  };

  return (
    <Container className="gap-2">
      <Container.Header className="text-base font-semibold leading-3 text-appForegroundInActive p-6">
        Invite your team colleagues to join the workspace.
      </Container.Header>
      <Container.Body className="invisible-scrollbar w-[32rem] h-80">
        <FormGroup label="Invite members from your organisation">
          <DropdownV2
            handleRenderer={() => (
              <Button
                text={user.name || 'Select member'}
                className={cx(
                  'hover:!bg-focus1 border border-appBorder justify-between',
                  { 'border-error': user.error }
                )}
                withCaret
                transparent
                ghost
                md
                fullWidth
                disabled={memberList.length === 0}
              />
            )}
            displayDefaultOptionClassName={2}
            className="block"
            optionContainerClassName={
              'w-[32rem] bg-popoverBackground z-[1000] -mt-1'
            }
            option={memberList}
            onSelect={(val) => updateUser({ name: val.name, error: false })}
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
            onSelect={({ name, id }) => updateRole({ name, id, error: false })}
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
