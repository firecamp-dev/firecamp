import { FC, useState } from 'react';
import { Drawer, IModal, SecondaryTab } from '@firecamp/ui';
import ChangePassword from './ChangePassword';
import UpdateProfile from './UpdateProfile';
const tabs = [
  { name: 'Profile', id: 'profile' },
  { name: 'Change Password', id: 'password' },
];
const ProfileManagement: FC<IModal> = ({ opened, onClose }) => {
  let [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  const renderTab = (tabId: string) => {
    switch (tabId) {
      case 'profile':
        return <UpdateProfile />;
      case 'password':
        return <ChangePassword />;
      default:
        return <></>;
    }
  };
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      size={600}
      // classNames={{
      //   body: 'h-[80vh]',
      // }}
      title={
        <div className="text-lg leading-5 px-6 flex items-center font-medium">
          Profile Management
        </div>
      }
    >
      <SecondaryTab
        className="py-4"
        list={tabs}
        activeTab={activeTab}
        onSelect={setActiveTab}
      />
      {renderTab(activeTab)}
    </Drawer>
  );
};
export default ProfileManagement;
