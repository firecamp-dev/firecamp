import { FC } from 'react';
import { Column } from '@firecamp/ui';

import MyAccount from './user/MyAccount';
import Notification from './notification/Notification';
import { EUserSettingTabs } from '../../../../constants';

const Body: FC<IBody> = ({ user = {}, activeTab = '', onClose = () => {} }) => {
  const _renderBody = () => {
    // console.log(`workspace`, workspace);
    switch (activeTab) {
      case EUserSettingTabs.MY_ACCOUNT:
        return <MyAccount user={user} onClose={onClose} />;
        break;
      case EUserSettingTabs.MY_NOTIFICATIONS:
        return <Notification />;
        break;
      case EUserSettingTabs.CREDITS:
        return <div>CREDITS body</div>;
        break;
      default:
        return <MyAccount onClose={onClose} />;
    }
  };

  return <Column>{_renderBody()}</Column>;
};

export default Body;

interface IBody {
  user: any;
  activeTab: string;
  onClose: Function;
}
