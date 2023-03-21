import { FC, useRef, useState } from 'react';
import {
  Modal,
  IModal,
  Button,
  TabHeader,
  Dropdown,
  TTableApi,
  SecondaryTab,
  Editor,
  Notes,
} from '@firecamp/ui';
import { _array, _misc } from '@firecamp/utils';
import { EUserRolesWorkspace, ERegex } from '../../../types';
import './workspace.scss';

import { EEditorLanguage } from '@firecamp/types';

enum EInviteMemberTabs {
  NewMembers = 'new_members',
  ExistingMembers = 'existing_members',
}
const Invite: FC<IModal> = ({ isOpen = false, onClose = () => {} }) => {
  // const inviteUrl = "http://firecame.com/codebasics/invitemember";
  const [activeTab, setActiveTab] = useState<EInviteMemberTabs>(
    EInviteMemberTabs.NewMembers
  );

  const tabs = [
    { name: 'Invite New Members', id: EInviteMemberTabs.NewMembers },
    {
      name: "Invite Organization's Members",
      id: EInviteMemberTabs.ExistingMembers,
    },
  ];

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
            <InviteNewMembers />
          ) : (
            <InviteExistingMembers />
          )}
        </div>
      </Modal.Body>
    </>
  );
};
export default Invite;

const InviteNewMembers = () => {
  const [invalidEntries, setInvalidEntries] = useState([]);
  const tableApi = useRef<TTableApi>(null);

  return (
    <>
      <div className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
        {/* Send invitation to your team members to join the workspace */}
        Use comma separated name and email. use multiple lines to invite in
        bulk.
      </div>
      <div className="flex-1 overflow-auto mb-2 visible-scrollbar">
        <Notes
          description={`example:<br>
        --------
        <br>
        Alice, alice@me.com
        <br>
        Bobr, bobr@me,com
        <br>
        `}
        />
        <Editor
          value=""
          onChange={console.log}
          language={EEditorLanguage.Text}
          monacoOptions={{
            fontFamily: 'inter, System-ui'
          }}
        />
      </div>

      {invalidEntries?.length ? (
        <div className="mb-2 text-error">
          Invalid Emails
          <ul>
            {invalidEntries.map((e, i) => (
              <li key={i}>
                {e.index + 1}. {e.email}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <></>
      )}

      <TabHeader className="p-0">
        <TabHeader.Left>
          <div className="flex items-center">
            <RoleDD
              role={EUserRolesWorkspace.Collaborator}
              onSelect={console.log}
            />
          </div>
        </TabHeader.Left>
        <TabHeader.Right>
          <Button
            text="Send Invitation"
            primary
            sm
            onClick={() => onInviteMembers()}
          />
        </TabHeader.Right>
      </TabHeader>
    </>
  );
};

const RoleDD: FC<{
  role: EUserRolesWorkspace;
  onSelect: (role: EUserRolesWorkspace) => void;
}> = ({ role, onSelect }) => {
  const options = [
    {
      header: 'select role',
      list: [{ name: 'Admin' }, { name: 'Collaborator' }],
    },
  ];

  const _onSelect = (option, e) => {
    onSelect(
      option.name == 'Admin'
        ? EUserRolesWorkspace.Admin
        : EUserRolesWorkspace.Collaborator
    );
  };
  const roleText = role == EUserRolesWorkspace.Admin ? 'Admin' : 'Collaborator';
  return (
    <Dropdown>
      <Dropdown.Handler>
        <Button
          text={`Invite members as ${roleText}`}
          className="ml-2"
          transparent
          withCaret
          sm
        />
      </Dropdown.Handler>
      <Dropdown.Options
        options={options}
        selected={role == EUserRolesWorkspace.Owner ? 'Admin' : 'Collaborator'}
        onSelect={_onSelect}
      />
    </Dropdown>
  );
};

const InviteExistingMembers = () => {
  return <span>To be designed..</span>;
};
