import { useState } from 'react';
import cx from 'classnames';
import { MantineProvider } from '@mantine/core';

import { AiOutlineUserAdd } from '@react-icons/all-files/ai/AiOutlineUserAdd';
import { AiOutlineUserSwitch } from '@react-icons/all-files/ai/AiOutlineUserSwitch';
import { IoSendSharp } from '@react-icons/all-files/io5/IoSendSharp';
import { RiBracesLine } from '@react-icons/all-files/ri/RiBracesLine';
import { VscAccount } from '@react-icons/all-files/vsc/VscAccount';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import { VscArrowDown } from '@react-icons/all-files/vsc/VscArrowDown';
import { VscChevronRight } from '@react-icons/all-files/vsc/VscChevronRight';
import { VscEdit } from '@react-icons/all-files/vsc/VscEdit';
import { VscEllipsis } from '@react-icons/all-files/vsc/VscEllipsis';
import { VscFile } from '@react-icons/all-files/vsc/VscFile';
import { VscFolder } from '@react-icons/all-files/vsc/VscFolder';
import { VscGithubInverted } from '@react-icons/all-files/vsc/VscGithubInverted';
import { VscMultipleWindows } from '@react-icons/all-files/vsc/VscMultipleWindows';
import { VscOrganization } from '@react-icons/all-files/vsc/VscOrganization';
import { VscRemote } from '@react-icons/all-files/vsc/VscRemote';
import { VscSignIn } from '@react-icons/all-files/vsc/VscSignIn';
import { VscTrash } from '@react-icons/all-files/vsc/VscTrash';
import { VscTwitter } from '@react-icons/all-files/vsc/VscTwitter';
import { VscWindow } from '@react-icons/all-files/vsc/VscWindow';

import { Button, FcIconGetSquare, DropdownMenu } from '@firecamp/ui';
import StatusBar from '../status-bar/StatusBar';

enum EMenuOptions {
  Request = 'request',
  Collection = 'collection',
  Environment = 'environment',
  ImportCollection = 'import-collection',
  Workspace = 'workspace',
  Organization = 'organization',
  InviteMembers = 'invite-members',
  SwitchOrg = 'switch-org',
  SwitchWorkspace = 'switch-workspace',
}

export default {
  title: 'UI-Kit/Dropdown/MantineDDMenu',
  component: DropdownMenu,
};

const Template = ({ ...args }: any) => {
  return <DropdownMenu {...args} />;
  // return  <MantineProvider theme={{
  // components: {
  //   Menu: {
  //     styles: {
  //       dropdown: {
  //         border: '1px solid red'
  //       }
  //     }
  //   }
  // }
  // }} withGlobalStyles withNormalizeCSS>
  //   <DropdownMenu {...args} />
  // </MantineProvider>
};

export const Example = Template.bind({});
Example.args = {
  options: [
    {
      id: 'CreateNewHeader',
      name: 'Create New',
      isLabel: true,
    },
    {
      id: EMenuOptions.Request,
      name: 'Request',
      prefix: () => <FcIconGetSquare size={18} />,
      postfix: () => <span className="text-inputPlaceholder">⌘K</span>,
    },
    {
      id: EMenuOptions.Collection,
      name: 'Collection',
      prefix: () => <VscFolder size={18} />,
    },
    {
      id: EMenuOptions.Environment,
      name: 'Environment',
      prefix: () => <RiBracesLine size={18} />,
    },
    {
      id: EMenuOptions.ImportCollection,
      name: 'Import Collection',
      showSeparator: true,
      prefix: () => <VscArrowDown size={18} />,
    },
    {
      id: 'CreateNewByAdminHeader',
      name: 'Create New (By Admin)',
      isLabel: true,
    },

    {
      id: EMenuOptions.Workspace,
      name: 'Workspace',
      prefix: () => <VscWindow size={18} />,
    },
    {
      id: EMenuOptions.Organization,
      name: 'Organization',
      prefix: () => <VscOrganization size={18} />,
    },
    {
      id: EMenuOptions.InviteMembers,
      name: 'Invite Members',
      showSeparator: true,
      prefix: () => <AiOutlineUserAdd size={18} />,
    },
    {
      id: 'SwitchHeader',
      name: 'SWITCH',
      isLabel: true,
    },
    {
      id: EMenuOptions.SwitchOrg,
      name: 'Switch Organization',
      prefix: () => <AiOutlineUserSwitch size={18} />,
    },
    {
      id: EMenuOptions.SwitchWorkspace,
      name: 'Switch Workspace',
      prefix: () => <VscMultipleWindows size={18} />,
    },
  ],
  handleRenderer: () => (
    <Button text={'Create'} primary withCaret transparent ghost xs />
  ),
  classNames: {
    dropdown: 'pt-0 pb-2 -ml-[2px]',
    label: 'uppercase',
  },
  onSelect: (value: any) => console.log(`selected item :`, value),
};

export const GlobalCreate = () => {
  const [selected, setSelected] = useState('');

  return (
    <DropdownMenu
      handleRenderer={() => (
        <Button
          text={selected || 'Create'}
          className="font-bold hover:!bg-focus1"
          withCaret
          transparent
          ghost
          xs
          primary
        />
      )}
      options={[
        {
          id: 'CreateNewHeader',
          name: 'Create New',
          isLabel: true,
        },
        {
          id: EMenuOptions.Request,
          name: 'Request',
          prefix: () => <FcIconGetSquare size={18} />,
          postfix: () => <span className="text-inputPlaceholder">⌘K</span>,
        },
        {
          id: EMenuOptions.Collection,
          name: 'Collection',
          prefix: () => <VscFolder size={18} />,
        },
        {
          id: EMenuOptions.Environment,
          name: 'Environment',
          prefix: () => <RiBracesLine size={18} />,
        },
        {
          id: EMenuOptions.ImportCollection,
          name: 'Import Collection',
          showSeparator: true,
          prefix: () => <VscArrowDown size={18} />,
        },
        {
          id: 'CreateNewByAdminHeader',
          name: 'Create New (By Admin)',
          isLabel: true,
        },

        {
          id: EMenuOptions.Workspace,
          name: 'Workspace',
          prefix: () => <VscWindow size={18} />,
        },
        {
          id: EMenuOptions.Organization,
          name: 'Organization',
          prefix: () => <VscOrganization size={18} />,
        },
        {
          id: EMenuOptions.InviteMembers,
          name: 'Invite Members',
          showSeparator: true,
          prefix: () => <AiOutlineUserAdd size={18} />,
        },
        {
          id: 'SwitchHeader',
          name: 'SWITCH',
          isLabel: true,
        },
        {
          id: EMenuOptions.SwitchOrg,
          name: 'Switch Organization',
          prefix: () => <AiOutlineUserSwitch size={18} />,
        },
        {
          id: EMenuOptions.SwitchWorkspace,
          name: 'Switch Workspace',
          prefix: () => <VscMultipleWindows size={18} />,
        },
      ]}
      onSelect={(value: any) => setSelected(value.name)}
      classNames={{
        dropdown: 'pt-0 pb-2 -ml-[2px]',
        label: 'uppercase',
      }}
    />
  );
};

export const HTTPMethod = () => {
  const [selected, setSelected] = useState('GET');

  return (
    <DropdownMenu
      handleRenderer={() => <Button text={selected} secondary withCaret sm />}
      selected={selected}
      options={[
        {
          id: 'GET',
          name: 'GET',
        },
        {
          id: 'POST',
          name: 'POST',
        },
        {
          id: 'PUT',
          name: 'PUT',
        },
        {
          id: 'DELETE',
          name: 'DELETE',
        },
        {
          id: 'PATCH',
          name: 'PATCH',
        },
        {
          id: 'HEAD',
          name: 'HEAD',
        },
        {
          id: 'OPTIONS',
          name: 'OPTIONS',
        },
        {
          id: 'PURGE',
          name: 'PURGE',
        },
        {
          id: 'LINK',
          name: 'LINK',
        },
        {
          id: 'UNLINK',
          name: 'UNLINK',
        },
      ]}
      onSelect={(value: any) => setSelected(value.name)}
      width={70}
      classNames={{
        dropdown: 'pt-0 pb-2 -mt-2',
        item: '!text-sm !py-1 !px-2 !leading-[18px]',
      }}
    />
  );
};

export const BodyTab = () => {
  const [selected, setSelected] = useState('');

  return (
    <DropdownMenu
      handleRenderer={() => (
        <Button
          text={selected || 'None'}
          className="font-bold hover:!bg-focus1"
          withCaret
          transparent
          ghost
          xs
          primary
        />
      )}
      options={[
        {
          id: 'FormAndQueryHeader',
          name: 'Form and query',
          isLabel: true,
        },
        {
          name: 'Multipart',
          id: 'multipart/form-data',
        },
        {
          name: 'Form URL Encode',
          id: 'application/x-www-form-urlencoded',
        },
        {
          id: 'RawHeader',
          name: 'Raw',
          isLabel: true,
        },
        {
          name: 'Json',
          id: 'application/json',
        },
        {
          name: 'Xml',
          id: 'application/xml',
        },
        {
          name: 'Text',
          id: 'text',
        },
        {
          id: 'OthersHeader',
          name: 'Others',
          isLabel: true,
        },
        {
          name: 'Binary',
          id: 'binary',
        },
        {
          name: 'None',
          id: 'none',
        },
      ]}
      width={144}
      selected={selected}
      onSelect={(value: any) => setSelected(value.name)}
      classNames={{
        dropdown: 'pt-0 pb-2 -mt-2',
        label: 'uppercase pl-2 font-sans text-xs',
        item: '!px-4	!text-sm !leading-6',
      }}
    />
  );
};

export const EmitterBody = () => {
  const [selected, setSelected] = useState('Text');

  return (
    <DropdownMenu
      handleRenderer={() => (
        <Button
          text={selected || 'No Body'}
          className="hover:!bg-focus1"
          withCaret
          transparent
          ghost
          xs
          primary
        />
      )}
      options={[
        {
          id: 'Text',
          name: 'Text',
        },
        {
          id: 'Json',
          name: 'Json',
        },
        {
          id: 'Number',
          name: 'Number',
        },
        {
          id: 'Boolean',
          name: 'Boolean',
        },
        {
          id: 'NoBody',
          name: 'No body',
        },
      ]}
      width={144}
      onSelect={(value: any) => setSelected(value.name)}
      classNames={{
        dropdown:
          'shadow-modal-shadow shadow-[0_0_8px_2px_rgba(0,0,0,0.3)] border-focusBorder',
        item: '!px-2 !py-1 !text-sm !leading-[18px]',
      }}
    />
  );
};

export const Logs = () => {
  const [selected, setSelected] = useState('');

  return (
    <DropdownMenu
      handleRenderer={() => (
        <Button
          className="w-36 text-base"
          text={selected || 'select log type'}
          tooltip={selected ? `Log type: ${selected || ''}` : ''}
          secondary
          withCaret
          sm
        />
      )}
      options={[
        {
          id: 'system',
          name: 'System',
        },
        {
          id: 'send',
          name: 'Send',
        },
        {
          id: 'receive',
          name: 'Receive',
        },
      ]}
      onSelect={(value: any) => setSelected(value.name)}
      width={144}
      classNames={{
        dropdown:
          'shadow-modal-shadow shadow-[0_0_8px_2px_rgba(0,0,0,0.3)] -mt-2 !py-0',
        item: '!pl-2 !py-1 !pr-1 !text-sm !leading-4',
      }}
    />
  );
};

export const RequestStatusBar = () => {
  const [selected, setSelected] = useState('MyQuery');

  return (
    <div className="flex ml-auto mr-1">
      <DropdownMenu
        handleRenderer={() => (
          <Button
            text={selected}
            secondary
            withCaret
            xs
            className="leading-6 !rounded-br-none !rounded-tr-none"
          />
        )}
        options={[
          {
            id: 'my_query',
            name: 'MyQuery',
          },
          {
            id: 'my_query_1',
            name: 'MyQuery1',
          },
        ]}
        width={144}
        onSelect={(value: any) => setSelected(value.name)}
        classNames={{
          dropdown:
            'shadow-modal-shadow shadow-[0_0_8px_2px_rgba(0,0,0,0.3)] -mt-2 !py-0',
          item: '!pl-2 !py-1 !pr-1 !text-sm !leading-4',
        }}
      />
      <Button
        text=""
        primary
        sm
        icon={<IoSendSharp />}
        iconLeft
        onClick={() => {}}
        className="!rounded-bl-none !rounded-tl-none"
      />
    </div>
  );
};

export const FooterStatusBar = () => {
  const [selected, setSelected] = useState('My workspace');
  const [userSelected, setUserSelected] = useState('Guest');

  return (
    <StatusBar className="border-t focus-outer2 mt-[50%]">
      <StatusBar.PrimaryRegion>
        <div
          tabIndex={1}
          className="bg-primaryColor text-primaryColor-text w-fit px-3 flex items-center"
          id={'status-bar-firecamp-version'}
          data-tip={`Firecamp`}
        >
          <VscRemote size={12} />
          <span className="pl-1">Firecamp</span>
        </div>
        <div className="bg-focus3 flex items-center px-3">
          <VscAccount size={16} className="mr-1" />

          <DropdownMenu
            handleRenderer={() => (
              <span className="pl-1 cursor-pointer">{userSelected}</span>
            )}
            options={[
              {
                id: 'heading',
                name: 'Guest',
                isLabel: true,
                postfix: () => (
                  <>
                    <br />
                    <div
                      className={
                        'text-sm font-light leading-3 text-app-foreground-inactive'
                      }
                    >
                      User
                    </div>
                  </>
                ),
              },
              {
                id: 'sign_in',
                name: 'Sign in',
                postfix: () => (
                  <div className={'ml-2 leading-3 text-primaryColor'}>
                    <VscSignIn size={20} />
                  </div>
                ),
              },
              {
                id: 'create_account',
                name: 'Create an account',
                postfix: () => (
                  <div className={'ml-2 leading-3 text-primaryColor'}>
                    <VscAccount size={20} />
                  </div>
                ),
              },
            ]}
            width={150}
            onSelect={(value) => setUserSelected(value.name)}
            classNames={{
              dropdown: '!pt-0 mt-2 min-w-fit	border-focusBorder',
              label:
                'flex items-center text-app-foreground px-2 !pt-[0.2rem] !pb-2 !px-3 !block !text-base font-medium leading-6 !opacity-100 !bg-focus2 ',
              item: '!text-sm !py-1 !px-3 !leading-6',
            }}
          />
          <VscChevronRight size={14} className="mt-0.5" />

          <DropdownMenu
            handleRenderer={() => (
              <span className="pl-1 cursor-pointer">{selected}</span>
            )}
            options={[
              {
                id: 'heading',
                name: 'FC Team',
                isLabel: true,
                postfix: () => (
                  <>
                    <br />
                    <div
                      className={
                        'text-sm font-light leading-3 text-app-foreground-inactive'
                      }
                    >
                      Workspace
                    </div>
                  </>
                ),
              },

              {
                id: 'workspace_mgmt',
                name: 'Workspace Management',
                postfix: () => (
                  <div className={'ml-2 leading-3'}>
                    <VscAdd size={14} strokeWidth={1.5} />
                  </div>
                ),
              },
              {
                id: 'invite_member',
                name: 'Invite Members',
                postfix: () => (
                  <div className={'ml-2 leading-3'}>
                    <VscAdd size={14} strokeWidth={1.5} />
                  </div>
                ),
              },
              {
                id: 'switch_workspace',
                name: 'Switch to Workspace',

                postfix: () => (
                  <div className={'ml-2 leading-3 text-primaryColor'}>
                    <VscRemote size={14} strokeWidth={1.5} />
                  </div>
                ),
              },
              {
                id: 'switch_org',
                name: 'Switch to Org',

                postfix: () => (
                  <div className={'ml-2 leading-3 text-primaryColor'}>
                    <VscRemote size={14} strokeWidth={1.5} />
                  </div>
                ),
              },
            ]}
            onSelect={(value) => setSelected(value.name)}
            width={180}
            classNames={{
              dropdown: '!pt-0 mt-2',
              label:
                'flex items-center text-app-foreground px-2 !pt-[0.2rem] !pb-2 !px-3 !block !text-base font-medium leading-6 !opacity-100 !bg-focus2 ',
              item: '!text-sm !py-1 !px-3 !leading-6',
            }}
          />
        </div>
      </StatusBar.PrimaryRegion>
      <StatusBar.SecondaryRegion>
        <div className="flex items-center">
          <a className="flex items-center pr-2 " href="#">
            <VscTwitter
              size={12}
              className="text-statusBar-foreground hover:text-statusBar-foreground-active"
            />
          </a>
          <a className="flex items-center pr-2" href="#">
            <VscGithubInverted
              size={12}
              className="text-statusBar-foreground hover:text-statusBar-foreground-active"
            />
          </a>
          <a className="flex items-center pr-2" href="#">
            <VscFile
              size={12}
              className="text-statusBar-foreground hover:text-statusBar-foreground-active"
            />
          </a>
        </div>
      </StatusBar.SecondaryRegion>
    </StatusBar>
  );
};

export const SidebarCollectionOption = () => {
  const [selected, setSelected] = useState('MyQuery');
  return (
    <DropdownMenu
      handleRenderer={() => <VscEllipsis className="cursor-pointer" />}
      options={[
        {
          prefix: () => <VscEdit size={14} />,
          name: 'Rename',
        },
        {
          prefix: () => <VscTrash size={14} />,
          name: 'Delete',
        },
      ]}
      width={144}
      onSelect={(value: any) => setSelected(value.name)}
      classNames={{
        dropdown:
          'shadow-modal-shadow shadow-[0_0_8px_2px_rgba(0,0,0,0.3)] border-focusBorder',
        item: '!px-2 !py-1 !text-sm !leading-[18px]',
      }}
    />
  );
};

export const EnvCollectionOption = () => {
  const [isOpen, toggleOpen] = useState(false);
  const [selected, setSelected] = useState('No Environment');
  return (
    <DropdownMenu
      onOpenChange={(v) => toggleOpen(v)}
      handleRenderer={() => (
        <Button
          text={selected}
          className={cx('!text-info', {
            open: isOpen,
          })}
          withCaret
          transparent
          ghost
          xs
        />
      )}
      selected={selected || ''}
      options={[
        {
          name: 'Select Environment',
          isLabel: true,
        },
        {
          id: null,
          name: 'No Environment',
        },
        {
          id: 'VWB-N5kGUZisROfbKwyHo',
          name: 'testing',
          showSeparator: true,
        },
        {
          name: 'Create New',
          isLabel: true,
        },
        {
          id: 'fc-new-environment',
          name: 'Create New Environment',
        },
      ]}
      onSelect={(v) => setSelected(v.name)}
      classNames={{
        dropdown: '!pt-0 !pb-2 border-focusBorder',
        label: 'uppercase font-sans',
        item: '!py-1 !text-sm !leading-[18px]',
      }}
    />
  );
};

export const MemberRoleSelection = () => {
  const [selected, setSelected] = useState('Owner');
  const [btnDisable, setBtnDisable] = useState(false);

  return (
    <div className="flex justify-between">
      <DropdownMenu
        handleRenderer={() => (
          <Button
            text={selected}
            className="hover:!bg-focus1"
            withCaret
            transparent
            ghost
            sm
          />
        )}
        classNames={{
          dropdown: '!py-0',
          label: 'uppercase font-sans !text-start',
          item: '!px-2 !text-sm !leading-[18px]',
        }}
        options={[
          { name: 'SELECT ROLE', isLabel: true },
          {
            name: 'Owner',
          },
          {
            name: 'Admin',
          },
          {
            name: 'Collaborator',
          },
        ]}
        onSelect={(v) => setSelected(v.name)}
        width={144}
        disabled={btnDisable}
      />
      <Button
        text={
          btnDisable
            ? 'Enable Dropdown Selection'
            : 'Disable Dropdown Selection'
        }
        onClick={() => setBtnDisable((v) => !v)}
      />
    </div>
  );
};
