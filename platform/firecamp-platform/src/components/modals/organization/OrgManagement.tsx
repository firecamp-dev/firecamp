import { FC, useEffect, useState } from 'react';
import { IModal, SecondaryTab, Drawer } from '@firecamp/ui';
import { _misc } from '@firecamp/utils';
import Members from './tabs/Members';
import BillingTab from './tabs/Billing';
import Workspaces from './tabs/Workspaces';
import { Rest } from '@firecamp/cloud-apis';

const tabs = [
  { name: 'Workspaces', id: 'workspaces' },
  { name: 'Members', id: 'members' },
  { name: 'Billing', id: 'billing' },
];

export const getFormalDate = (convertDate: string) => {
  let date = new Date(convertDate);
  if (date.toString() === 'Invalid Date') return 'N/A';

  let dateString = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  return dateString;
};

const OrgManagement: FC<IModal> = ({ opened = false, onClose = () => {} }) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const [isFetching, setIsFetching] = useState(false);
  const [workspaces, updateWorkspaces] = useState([]);
  const [members, updateMembers] = useState([]);

  // getting workspaces
  useEffect(() => {
    setIsFetching(true);

    // Rest.organization.getMyWorkspacesOfOrg()

    setTimeout(() => {
      
      
      setIsFetching(false);
    }, 5000);
  }, []);

  const renderTab = (tabId: string) => {
    switch (tabId) {
      case 'workspaces':
        return <Workspaces workspaces={workspaces} isFetching={isFetching} />;
      case 'members':
        return <Members members={members} isFetching={isFetching} />;
      case 'billing':
        return <BillingTab />;
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
        <div className="text-lg leading-5 px-3 flex items-center font-medium">
          Organization Management
        </div>
      }
    >
      <SecondaryTab
        className="pt-4"
        list={tabs}
        activeTab={activeTab}
        onSelect={setActiveTab}
      />
      {renderTab(activeTab)}
    </Drawer>
  );
};
export default OrgManagement;
