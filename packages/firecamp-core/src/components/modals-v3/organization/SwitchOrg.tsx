import { FC, useEffect, useState } from 'react';
import {
  Modal,
  Button,
  EButtonSize,
  EButtonColor,
  ProgressBar,
  IModal,
} from '@firecamp/ui-kit';
import { Rest } from '@firecamp/cloud-apis';
import { VscChevronRight } from '@react-icons/all-files/vsc/VscChevronRight';

import AppService from '../../../services/app';
import { usePlatformStore } from '../../../store/platform';

const SwitchOrg: FC<IModal> = ({ isOpen = false, onClose = () => {} }) => {
  const { setSwitchingOrg } = usePlatformStore((s) => ({
    setSwitchingOrg: s.setSwitchingOrg,
  }));
  const [isFetchingOrgs, setFetchOrgFlag] = useState(false);
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    setFetchOrgFlag(true);
    Rest.organization
      .getMyOrganizations()
      .then(({ data: _orgs = [] }) => {
        console.log(_orgs, 'response...');
        setOrgs(_orgs);
      })
      .finally(() => {
        setFetchOrgFlag(false);
      });
  }, []);

  const switchOrg = (org) => {
    localStorage.setItem('switch_to_org', org._meta.id);
    AppService.modals.openSwitchWorkspace();
    setSwitchingOrg(org);
  };

  const renderBody = (isFetchingFlag: boolean) => {
    switch (isFetchingFlag) {
      case true:
        return <FetchingOrgs />;
      case false:
        if (!orgs?.length) return <NoOrgFoundMessage />;
        else
          return (
            <>
              <div className="p-4">
                <div className="text-sm">
                  <label className="font-semibold text-appForeground uppercase">
                    Please select organization to switch
                  </label>
                  <span className="block font-normal text-appForegroundInActive">
                    Here is the list of organizations you belong to, after
                    selecting any one of them you'll be asked to choose the
                    workspace of that organization.
                  </span>
                </div>
              </div>
              <div className="pl-4 pb-4 pr-2  overflow-auto visible-scrollbar h-80 mr-2">
                {orgs.map((org, i) => (
                  <div
                    className="card relative flex items-center p-2 mb-2 text-base font-semibold border border-appBorder cursor-pointer hover:border-focusBorder  after:content-['_↗']  after:absolute after:top-0 after:left-0 after:bottom-0 after:right-0 hover:after:bg-focusBorder after:opacity-10 "
                    key={org._meta.id}
                  >
                    <a
                      className="z-10 flex-1"
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        switchOrg(org);
                      }}
                    >
                      {' '}
                      {`${i + 1}. ${org.name}`}{' '}
                    </a>
                    <VscChevronRight
                      size={14}
                      className="text-focusBorder bg-focusBorder border-focusBorder action"
                    />
                  </div>
                ))}
              </div>
            </>
          );
    }
  };

  return (
    <>
      <Modal.Header className="with-divider">
        <div className="text-lg leading-5 p-4 flex items-center font-medium">
          Switch Organization
        </div>
      </Modal.Header>
      <Modal.Body>
        <ProgressBar active={isFetchingOrgs} />
        {renderBody(isFetchingOrgs)}
      </Modal.Body>
    </>
  );
};

export default SwitchOrg;

const NoOrgFoundMessage = () => {
  return (
    <div className="p-8 h-36 flex flex-col justify-center items-center">
      <div className="text-sm max-w-xs mx-auto text-center px-10 pt-4">
        <label className="font-semibold text-appForeground uppercase">
          No Organization Found
        </label>
        <span className="block font-normal text-appForegroundInActive">
          You're not belonging to any organization yet.If you wish then you can
          create a new organization.
        </span>
      </div>
      <Button
        text="Create Organization"
        sm
        primary
        onClick={() => AppService.modals.openCreateOrg()}
      />
    </div>
  );
};

const FetchingOrgs = () => {
  return (
    <div className="p-8 h-36 flex flex-col justify-center items-center">
      <div className="text-sm max-w-xs mx-auto text-center px-10 pt-4">
        <label className="font-semibold text-appForeground uppercase">
          Fetching Your Organizations...
        </label>
      </div>
    </div>
  );
};
