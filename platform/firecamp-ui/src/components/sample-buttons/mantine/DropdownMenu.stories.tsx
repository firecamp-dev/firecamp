import { RiBracesLine } from '@react-icons/all-files/ri/RiBracesLine';
import { VscArrowDown } from '@react-icons/all-files/vsc/VscArrowDown';
import { VscFolder } from '@react-icons/all-files/vsc/VscFolder';
import { VscOrganization } from '@react-icons/all-files/vsc/VscOrganization';
import { AiOutlineUserAdd } from '@react-icons/all-files/ai/AiOutlineUserAdd';
import { AiOutlineUserSwitch } from '@react-icons/all-files/ai/AiOutlineUserSwitch';
import { VscMultipleWindows } from '@react-icons/all-files/vsc/VscMultipleWindows';
import { VscWindow } from '@react-icons/all-files/vsc/VscWindow';
import { Button, FcIconGetSquare } from '@firecamp/ui';
import DropdownMenu from './DropdownMenu';

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
const options = [
  {
    id: 'CreateNewHeader',
    name: 'Create New',
    disabled: true,
    isLabel: true,
  },
  {
    id: EMenuOptions.Request,
    name: 'Request',
    prefix: () => <FcIconGetSquare className="mr-2" size={16} />,
    postfix: () => (
      <span className="ml-auto text-inputPlaceholder pl-2">⌘K</span>
    ),
  },
  {
    id: EMenuOptions.Collection,
    name: 'Collection',
    prefix: () => <VscFolder className="mr-2" size={16} />,
  },
  {
    id: EMenuOptions.Environment,
    name: 'Environment',
    prefix: () => <RiBracesLine className="mr-2" size={16} />,
  },
  {
    id: EMenuOptions.ImportCollection,
    name: 'Import Collection',
    showSeparator: true,
    prefix: () => <VscArrowDown className="mr-2" size={16} />,
  },
  {
    id: 'CreateNewByAdminHeader',
    name: 'Create New (By Admin)',
    disabled: true,
    isLabel: true,
  },

  {
    id: EMenuOptions.Workspace,
    name: 'Workspace',
    prefix: () => <VscWindow className="mr-2" size={16} />,
  },
  {
    id: EMenuOptions.Organization,
    name: 'Organization',
    prefix: () => <VscOrganization className="mr-2" size={16} />,
  },
  {
    id: EMenuOptions.InviteMembers,
    name: 'Invite Members',
    showSeparator: true,
    prefix: () => <AiOutlineUserAdd className="mr-2" size={16} />,
  },
  {
    id: 'SwitchHeader',
    name: 'SWITCH',
    disabled: true,
    isLabel: true,
  },
  {
    id: EMenuOptions.SwitchOrg,
    name: 'Switch Organization',
    prefix: () => <AiOutlineUserSwitch className="mr-2" size={16} />,
  },
  {
    id: EMenuOptions.SwitchWorkspace,
    name: 'Switch Workspace',
    prefix: () => <VscMultipleWindows className="mr-2" size={16} />,
  },
];

export default {
  title: 'Sample/DropdownMenu',
  component: DropdownMenu,
};

const Template = ({ ...args }: any) => {
  return <DropdownMenu {...args} />;
};

export const Example = Template.bind({});
Example.args = {
  options,
  handleRenderer: () => (
    <Button text={'Create'} primary withCaret transparent ghost xs />
  ),
  classNames: {
    label: 'text-activityBarInactiveForeground',
    item: 'text-appForeground',
  },
};
