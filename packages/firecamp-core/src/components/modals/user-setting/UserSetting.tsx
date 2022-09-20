import { FC, useState } from 'react';
import { Modal, Tabs, Container } from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';

import Header from './Header';
import Body from './body/Body';

import './UserSetting.sass';

import { EUserSettingTabs } from '../../../constants';
import { userSettingTabs } from './constants';

import { useUserStore } from '../../../store/user';

const UserSetting: FC<IUserSetting> = ({
  isOpen = false,
  activeTab: propActiveMenu = '',
  onClose = () => {},
}) => {
  const user = useUserStore((s) => s.user, shallow);

  let [activeTab, setActiveTab] = useState(
    propActiveMenu || EUserSettingTabs.MY_ACCOUNT
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <Header name={user.name} title={user.email} />
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Container.Header className="z-20">
            <Tabs
              list={userSettingTabs}
              activeTab={activeTab}
              onSelect={setActiveTab}
            />
          </Container.Header>
          <Container.Body>
            <Body user={user} activeTab={activeTab} onClose={onClose} />
          </Container.Body>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default UserSetting;

interface IUserSetting {
  isOpen: boolean;
  activeTab: string;
  onClose: () => any;
}
