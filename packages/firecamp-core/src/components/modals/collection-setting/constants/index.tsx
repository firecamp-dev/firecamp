import { VscEdit } from '@react-icons/all-files/vsc/VscEdit';
import { VscJson } from '@react-icons/all-files/vsc/VscJson';
import { VscLock } from '@react-icons/all-files/vsc/VscLock';
import { VscTerminal } from '@react-icons/all-files/vsc/VscTerminal';
import { VscGraph } from '@react-icons/all-files/vsc/VscGraph';

import { ECollectionSettingTabs } from '../../../../constants';

export const collectionSettingTabs = [
  {
    id: ECollectionSettingTabs.SETTING,
    name: 'Edit',
    preComp: () => <VscEdit />,
  },
  {
    id: ECollectionSettingTabs.ENVIRONMENT,
    name: 'Environments',
    preComp: () => <VscJson />,
  },
  {
    id: ECollectionSettingTabs.AUTH,
    name: 'Auth',
    preComp: () => <VscLock />,
  },
  {
    id: ECollectionSettingTabs.SCRIPT,
    name: 'Scripts',
    preComp: () => <VscTerminal />,
  },
  {
    id: ECollectionSettingTabs.STATISTICS,
    name: 'Statistics',
    preComp: () => <VscGraph />,
  },
];
