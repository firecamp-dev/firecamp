import { FC, useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Modal, Button, ProgressBar, IModal } from '@firecamp/ui';
import { Rest } from '@firecamp/cloud-apis';
import { usePlatformStore } from '../../../store/platform';
import platformContext from '../../../services/platform-context';

const SwitchOrg: FC<IModal> = ({ opened = false, onClose = () => {} }) => {
  const { setSwitchingOrg } = usePlatformStore((s) => ({
    setSwitchingOrg: s.setSwitchingOrg,
  }));
  const [isFetchingOrgs, setFetchOrgFlag] = useState(false);
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    if (!opened) return;
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
    localStorage.setItem('switchToOrg', org.__ref.id);
    platformContext.app.modals.openSwitchWorkspace();
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
              <div className="py-4">
                <div className="text-sm">
                  <label className="font-semibold text-app-foreground uppercase">
                    Please select organization to switch
                  </label>
                  <span className="block font-normal text-app-foreground-inactive">
                    Here is the list of organizations you belong to, after
                    selecting any one of them you'll be asked to choose the
                    workspace of that organization.
                  </span>
                </div>
              </div>
              <div className="pb-4 overflow-auto visible-scrollbar h-80">
                {orgs.map((org, i) => (
                  <div
                    className="card relative flex items-center p-2 mb-2 text-base font-semibold border border-app-border cursor-pointer hover:border-focusBorder after:absolute after:top-0 after:left-0 after:bottom-0 after:right-0 hover:after:bg-focusBorder after:opacity-10 "
                    key={org.__ref.id}
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
                    <ChevronRight
                      size={14}
                      className=" border-focusBorder action"
                    />
                  </div>
                ))}
              </div>
            </>
          );
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size={440}
      classNames={{ content: '!pb-6' }}
      title={
        <div className="text-lg leading-5 px-4 flex items-center font-medium">
          Switch Organization
        </div>
      }
    >
      <ProgressBar active={isFetchingOrgs} />
      {renderBody(isFetchingOrgs)}
    </Modal>
  );
};

export default SwitchOrg;

const NoOrgFoundMessage = () => {
  return (
    <div className="p-8 flex flex-col justify-center items-center">
      <div className="text-sm max-w-xs mx-auto text-center px-10">
        <label className="font-semibold text-app-foreground uppercase">
          No Organization Found
        </label>
        <span className="block font-normal text-app-foreground-inactive">
          You're not belonging to any organization yet.If you wish then you can
          create a new organization.
        </span>
      </div>
      <Button
        text="Create Organization"
        onClick={() => platformContext.platform.createOrganizationPrompt()}
        primary
        xs
      />
    </div>
  );
};

const FetchingOrgs = () => {
  return (
    <div className="p-8 flex flex-col justify-center items-center">
      <div className="text-sm max-w-xs mx-auto text-center px-10">
        <label className="font-semibold text-app-foreground uppercase">
          Fetching Your Organizations...
        </label>
      </div>
    </div>
  );
};
