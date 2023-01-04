import { IoPersonOutline } from '@react-icons/all-files/io5/IoPersonOutline';
import { IoNotificationsOutline } from '@react-icons/all-files/io5/IoNotificationsOutline';

import { EUserSettingTabs } from '../../../../constants';

export const userSettingTabs = [
  {
    id: EUserSettingTabs.MY_ACCOUNT,
    name: 'My Account',
    preComp: () => <IoPersonOutline />,
  },
  {
    id: EUserSettingTabs.MY_NOTIFICATIONS,
    name: 'Notification',
    preComp: () => <IoNotificationsOutline />,
  },
  /* {
      id:EUserSettingTabs.CREDITS,
      name: "Credits",
    }*/
];
