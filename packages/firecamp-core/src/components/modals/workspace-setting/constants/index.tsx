import { VscEdit } from '@react-icons/all-files/vsc/VscEdit';
import { VscJson } from '@react-icons/all-files/vsc/VscJson';
import { VscGraph } from '@react-icons/all-files/vsc/VscGraph';
import { BiImport } from '@react-icons/all-files/bi/BiImport';

import { EWorkspaceSettingTabs } from '../../../../constants';

export let workspaceSettingTabs = [
  {
    id: EWorkspaceSettingTabs.SETTING,
    name: 'Edit',
    preComp: () => <VscEdit />,
  },
  {
    id: EWorkspaceSettingTabs.ENVIRONMENT,
    name: 'Environments',
    preComp: () => <VscJson />,
  },
  {
    id: EWorkspaceSettingTabs.STATISTICS,
    name: 'Statistics',
    preComp: () => <VscGraph />,
  },
  {
    id: EWorkspaceSettingTabs.IMPORT,
    name: 'Import',
    preComp: () => <BiImport />,
  },
];
