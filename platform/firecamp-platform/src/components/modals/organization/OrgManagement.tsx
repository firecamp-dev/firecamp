import { FC, useEffect, useState } from 'react';
import { Rest } from '@firecamp/cloud-apis';
import { _misc } from '@firecamp/utils';
import { IModal, SecondaryTab, Drawer } from '@firecamp/ui';
import Members from './tabs/Members';
import BillingTab from './tabs/Billing';
import Workspaces from './tabs/Workspaces';
import { usePlatformStore } from '../../../store/platform';

enum ETabTypes {
  Workspaces = 'workspaces',
  Members = 'members',
  Billing = 'billing',
}
const tabs = [
  { name: 'Workspaces', id: ETabTypes.Workspaces },
  { name: 'Members', id: ETabTypes.Members },
  { name: 'Billing', id: ETabTypes.Billing },
];

// to convert date into readable date
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

  const { organization } = usePlatformStore((s) => ({
    organization: s.organization,
  }));

  // getting organization's workspaces / members listing once
  useEffect(() => {
    if (activeTab === ETabTypes.Workspaces && workspaces.length === 0) {
      setIsFetching(true);

      Rest.organization
        .getMyWorkspacesOfOrg(organization.__ref.id)
        .then((res) => res.data)
        .then((list) => {
          updateWorkspaces(list);
        })
        .finally(() => setIsFetching(false));
    } else if (activeTab === ETabTypes.Members && members.length === 0) {
      setIsFetching(true);

      Rest.organization
        .getMembers(organization.__ref.id)
        .then((res) => res.data)
        .then((list) => {
          updateMembers(list);
        })
        .finally(() => setIsFetching(false));
    }
  }, [activeTab]);

  const renderTab = (tabId: string) => {
    switch (tabId) {
      case ETabTypes.Workspaces:
        return <Workspaces workspaces={workspaces} isFetching={isFetching} />;
      case ETabTypes.Members:
        return <Members members={members} isFetching={isFetching} />;
      case ETabTypes.Billing:
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
