import { FC, useState } from 'react';
import {
  Input,
  TextArea,
  TabHeader,
  Button,
  Modal,
  IModal,
  SecondaryTab,
} from '@firecamp/ui';
import { _misc } from '@firecamp/utils';
import { VscEdit } from '@react-icons/all-files/vsc/VscEdit';

const OrgManagement: FC<IModal> = ({ isOpen = false, onClose = () => {} }) => {
  // let { create, checkNameAvailability } = useWorkspaceStore((s: IWorkspaceStore)=>({
  //   create: s.create,
  //   checkNameAvailability: s.checkNameAvailability
  // }))

  const tabs = [
    { name: 'Edit', id: 'edit' },
    { name: 'Members', id: 'members' },
    { name: 'Billing', id: 'billing' },
  ];
  let [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  const renderTab = (tabId: string) => {
    switch (tabId) {
      case 'edit':
        return <EditInfoTab />;
      case 'members':
        return <MembersTab />;
      case 'billing':
        return <BillingTab />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <Modal.Header>
        <div className="text-lg leading-5 px-6 py-4 flex items-center font-medium  border-b border-appBorder ">
          Organization Management
        </div>
      </Modal.Header>
      <Modal.Body>
        <SecondaryTab
          className="flex items-center p-4 pb-0"
          list={tabs}
          activeTab={'edit'}
          onSelect={setActiveTab}
        />
        {renderTab(activeTab)}
      </Modal.Body>
      <Modal.Footer className="!py-3 border-t border-appBorder ">
        <TabHeader>
          <TabHeader.Right>
            <Button
              text="Cancel"
              secondary
              transparent={true}
              sm
              onClick={(e) => onClose(e)}
              ghost={true}
            />
            <Button
              text={true ? 'Creating...' : 'Create'}
              primary
              sm
              onClick={() => {}}
              disabled={false}
            />
          </TabHeader.Right>
        </TabHeader>
      </Modal.Footer>
    </>
  );
};
export default OrgManagement;

const EditInfoTab: FC<any> = () => {
  let [org, setOrg] = useState({
    name: '',
    description: '',
  });

  return (
    <div className="p-6">
      <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
        ADD NEW WORKSPACE INFO
      </label>
      <div className="mt-8">
        <Input
          autoFocus={true}
          label="Name"
          placeholder="Organization name"
          name={'name'}
          value={org.name || ''}
          onChange={() => {}}
          onKeyDown={() => {}}
          onBlur={() => {}}
          disabled={true}
          iconPosition="right"
          icon={<VscEdit />}
          // error={error.name}
        />
        {/* {
          flag_wrsNameCheckInProgress === false && flag_isWrsNameAvailable === undefined 
            ? <Alert withBorder text="please type the workspace name to check its availability" info/>: <></>
        }
        {
          flag_wrsNameCheckInProgress === true? <Alert withBorder text={`checking workspace name availability - ${workspace?.name}`} warning/>: <></>
        }
        {
          flag_wrsNameCheckInProgress === false && flag_isWrsNameAvailable === true
            ? <Alert withBorder text={`the workspace name is available - ${workspace?.name}`} success/>: <></>
        }
        {
          flag_wrsNameCheckInProgress === false && flag_isWrsNameAvailable === false
            ? <Alert withBorder text={`the workspace name is not available - ${workspace?.name}`} error/>: <></>
        }
        {
          error.name?.length
            ? <Alert withBorder text={error.name} error/>: <></>
        } */}
      </div>

      <TextArea
        type="text"
        minHeight="200px"
        label="Description (optional)"
        labelClassName="fc-input-label"
        placeholder="Description"
        note="Markdown supported in description"
        name={'description'}
        value={org.description || ''}
        onChange={() => {}}
        disabled={true}
        iconPosition="right"
        icon={<VscEdit />}
      />
      {/* {error.global?.length ? (
        <TabHeader.Left>
          <div
            style={{
              fontSize: '12px',
              color: 'red' //'green'
            }}
          >
            {error.global}
          </div>
        </TabHeader.Left>
      ) : <></>} */}
    </div>
  );
};

const MembersTab = () => {
  return <div className="p-6"> Members Tab</div>;
};

const BillingTab = () => {
  return <div className="p-6"> Billing Tab</div>;
};
