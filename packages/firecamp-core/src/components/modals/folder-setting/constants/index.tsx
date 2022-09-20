import { VscEdit } from '@react-icons/all-files/vsc/VscEdit';
import { VscLock } from '@react-icons/all-files/vsc/VscLock';
import { VscTerminal } from '@react-icons/all-files/vsc/VscTerminal';

import { EFolderSettingTabs } from '../../../../constants';

export const folderSettingTabs = [
  {
    id: EFolderSettingTabs.SETTING,
    name: 'Edit',
    preComp: () => <VscEdit />,
  },
  {
    id: EFolderSettingTabs.AUTH,
    name: 'Auth',
    preComp: () => <VscLock />,
  },
  {
    id: EFolderSettingTabs.SCRIPT,
    name: 'Scripts',
    preComp: () => <VscTerminal />,
  },
];
