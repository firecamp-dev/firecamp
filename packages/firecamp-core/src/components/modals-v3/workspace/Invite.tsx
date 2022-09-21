import { FC, useRef, useState } from 'react';
import {
  Modal,
  IModal,
  Button,
 
  
  Container,
  TabHeader,
  CopyButton,
  Input,
  EButtonIconPosition,
  Dropdown,
  PrimaryTable,
  TTableApi,
  SecondaryTab,
} from '@firecamp/ui-kit';
// import { VscOrganization } from '@react-icons/all-files/vsc/VscOrganization';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import { VscTrash } from '@react-icons/all-files/vsc/VscTrash';
import { _array, _misc } from '@firecamp/utils';
import { EUserRolesWorkspace, ERegex } from '../../../types';

import './workspace.scss';

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
    { name: 'NEW MEMBERS', id: EInviteMemberTabs.NewMembers },
    { name: 'EXISTING MEMBERS', id: EInviteMemberTabs.ExistingMembers },
  ];

  return (
    <>
      <Modal.Header>
        <div className="text-lg leading-5 px-6 py-4 flex items-center font-medium">
          Invite people to Organization
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="p-6 h-full flex flex-col">
          {/* <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
                        use the link for add people in to workspace
                    </label>
                    <div className="flex border !border-inputBorder rounded-sm leading-5 outline-none placeholder-inputPlaceholder focus:bg-inputFocusBackground w-fit px-3 py-1 bg-focus1">
                        <span className="block mr-2">http://firecame.com/codebasics/invitemember</span>
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

  const columns = [
    { id: 'index', name: 'No.', key: 'index', width: '30px' },
    { id: 'name', name: 'Name', key: 'name', width: '250px' },
    { id: 'email', name: 'Email', key: 'email', width: '300px' },
    { id: 'role', name: 'Role', key: 'role' },
    { id: 'action', name: '', key: '', width: '30px' },
  ];

  const onInviteMembers = () => {
    setInvalidEntries([]);

    console.log(tableApi.current.getRows(), 'tableApi.current.getRows()');
    let members = tableApi.current
      .getRows()
      .map((m) => ({ ...m, name: m.name?.trim, email: m.email?.trim() }));
    members = members.filter((r) => !!r.email && !!r.role); // remove empty rows

    //validate emails of members
    const invalidMembers = members.reduce((pv, cv, i) => {
      console.log(cv);
      if (!String(cv.email).toLowerCase().match(ERegex.Email)) {
        return [...pv, { index: i, ...cv }];
      }
      return pv;
    }, []);

    if (invalidMembers?.length) {
      console.log(invalidMembers, 'invalidMembers');
      setInvalidEntries(invalidMembers);
      return;
    }

    //TOdo: call API here
    console.log(members);
  };

  const onChangeRole = (row) => {
    // TODO: call API
    // Rest.workspace.

    console.log(row, '...');
    tableApi.current.setRow(row);
  };

  const renderCell = (column, cellValue, rowIndex, row, tableApi, onChange) => {
    switch (column.id) {
      case 'index':
        return <div className="px-2"> {rowIndex + 1} </div>;
        break;
      case 'name':
        // return value;
        return (
          <Input
            wrapperClassName="!mb-0"
            className="!border-transparent !bg-transparent"
            value={cellValue}
            onChange={(e: any) => onChange(column.key, e.target.value, e)}
          />
        );
        break;
      case 'email':
        // return value;
        return (
          <Input
            type="email"
            wrapperClassName="!mb-0"
            className="!border-transparent !bg-transparent"
            value={cellValue}
            onChange={(e: any) => onChange(column.key, e.target.value, e)}
          />
        );
        break;
      case 'role':
        return (
          <div style={{ padding: 5 }}>
            {row.role == 1 ? (
              'Owner'
            ) : (
              <RoleDD
                role={row.role}
                onSelect={(role) => onChangeRole({ ...row, role })}
              />
            )}
          </div>
        );
        break;
      case 'action':
        return (
          <div className="px-2">
            <VscTrash
              size={14}
              className="text-error cursor-pointer"
              onClick={(e) => tableApi?.removeRow(row.id)}
            />
          </div>
        );
        break;
      default:
        return column.key;
    }
  };

  return (
    <>
      <div className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
        Send invitation to your team members to join the workspace
      </div>
      <div className="flex-1 overflow-auto mb-2 visible-scrollbar">
        <PrimaryTable
          apiRef={tableApi}
          columns={columns}
          renderColumn={(c) => c.name}
          defaultRow={{
            name: '',
            email: '',
            role: EUserRolesWorkspace.Collaborator,
          }}
          renderCell={renderCell}
          onChange={console.log}
          onLoad={(tApi) => {}}
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
            <Button
              text="Add Single"
              secondary
              sm
              icon={<VscAdd size={16} />}
              iconLeft
              className="mr-2"
              onClick={(e) => {
                console.log(tableApi);
                tableApi.current?.addRow();
              }}
            />

            {/* TODO: implement bulk add later */}
            {/* <Button
                            text='Add in Bulk'
                            secondary
                            sm
                            icon={<VscOrganization size={16} />}
                            iconPosition = {EButtonIconPosition.Left}
                        /> */}
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
  return (
    <Dropdown>
      <Dropdown.Handler>
        <Button
          text={role == EUserRolesWorkspace.Admin ? 'Admin' : 'Collaborator'}
          sm
          ghost={true}
          transparent={true}
          withCaret={true}
          className="ml-2"
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
