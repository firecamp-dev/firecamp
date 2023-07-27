import { FC, useEffect, useState } from 'react';
import { Rest } from '@firecamp/cloud-apis';
import { _misc } from '@firecamp/utils';
import { IModal, SecondaryTab, Drawer, ProgressBar } from '@firecamp/ui';
import EditOrganization from './tabs/EditOrganization';
import Members from './tabs/Members';
import BillingTab from './tabs/Billing';
import Workspaces from './tabs/Workspaces';
import { usePlatformStore } from '../../../store/platform';
import platformContext from '../../../services/platform-context';

enum ETabTypes {
  Overview = 'overview',
  Workspaces = 'workspaces',
  Members = 'members',
  Billing = 'billing',
}
const tabs = [
  { name: 'Overview', id: ETabTypes.Overview },
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
  const { organization, setOrg } = usePlatformStore((s) => ({
    organization: s.organization,
    setOrg: s.setOrg,
  }));

  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const [isFetching, setIsFetching] = useState(false);
  const [workspaces, updateWorkspaces] = useState([]);
  const [members, updateMembers] = useState([]);

  const [org, updOrg] = useState(organization);
  const [error, setError] = useState({ name: '' });
  const [isRequesting, setIsRequesting] = useState(false);

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

  const onChange = (e, reset) => {
    if (reset) {
      updOrg(organization);
      if (error.name) setError({ name: '' });
    } else {
      const { name, value } = e.target;
      if (error.name) setError({ name: '' });
      updOrg((o) => ({ ...o, [name]: value }));
    }
  };

  const onUpdate = () => {
    if (isRequesting) return;
    const name = org.name.trim();
    const description = org.description?.trim();
    if (!name || name.length < 6) {
      setError({
        name: 'The organization name must have minimum 6 characters',
      });
      return;
    }
    if (
      organization.name === org.name &&
      organization.description === org.description
    )
      return;

    const _org: { name?: string; description?: string } = {};
    if (organization.name !== name) {
      _org.name = name;
    }
    if (organization.description !== description) {
      _org.description = description;
    }

    setIsRequesting(true);
    Rest.organization
      .update(organization.__ref.id, _org)
      .then((res) => res.data)
      .then(({ error, message }) => {
        if (!error) {
          platformContext.app.notify.success(
            "The organization's detail has been updated successfully."
          );
          setOrg({ ...organization, ..._org });
        } else {
          platformContext.app.notify.alert(message);
        }
      })
      .catch((e) => {
        platformContext.app.notify.alert(e.response?.data.message || e.message);
      })
      .finally(() => {
        setIsRequesting(false);
      });
  };

  const renderTab = (tabId: string) => {
    switch (tabId) {
      case ETabTypes.Overview:
        return (
          <EditOrganization
            organization={org}
            error={error}
            isRequesting={isRequesting}
            onSubmit={onUpdate}
            onChange={onChange}
            enableReset={
              organization.name !== org.name ||
              organization.description !== org.description
            }
            // disabled={true} // TODO: only allow owner
          />
        );
      case ETabTypes.Workspaces:
        return <Workspaces workspaces={workspaces} isFetching={isFetching} />;
      case ETabTypes.Members:
        return (
          <Members
            members={members}
            updateMembers={updateMembers}
            isFetching={isFetching}
            organizationId={organization.__ref.id}
          />
        );
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
      <ProgressBar active={isFetching} />
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
