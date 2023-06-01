import { FC, useEffect, useState } from 'react';
import { Modal, Button, ProgressBar, IModal } from '@firecamp/ui';
import { Rest } from '@firecamp/cloud-apis';
import platformContext from '../../../services/platform-context';
import { usePlatformStore } from '../../../store/platform';
import './workspace.scss';

const SwitchWorkspace: FC<IModal> = ({
  isOpen = false,
  onClose = () => {},
}) => {
  const { switchingOrg, unsetSwitchingOrg } = usePlatformStore((s) => ({
    unsetSwitchingOrg: s.unsetSwitchingOrg,
    switchingOrg: s.switchingOrg,
  }));
  const [isFetchingWrs, setFetchWrsFlag] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    if (!isOpen) return () => {};
    const orgId = localStorage.getItem('switchToOrg');
    setFetchWrsFlag(true);
    Rest.organization
      .getMyWorkspacesOfOrg(orgId || 'personal') //if not set org then fetch personal workspaces
      .then(({ data: _wrs = [] }) => {
        console.log(_wrs, 'response...');
        setWorkspaces(_wrs);
      })
      .finally(() => {
        setFetchWrsFlag(false);
      });

    return () => {
      // on modal close unset switching org
      unsetSwitchingOrg();
    };
  }, []);

  const switchToWrs = async (wrs: any) => {
    await platformContext.app.switchWorkspace(wrs);
    platformContext.app.modals.close();
  };

  const renderBody = (isFetchingFlag: boolean) => {
    switch (isFetchingFlag) {
      case true:
        return <FetchingWrs />;
      case false:
        if (!workspaces?.length) return <NoWrsFoundMessage close={onClose} />;
        else
          return (
            <>
              <div className="p-4">
                <div className="text-sm">
                  <label className="font-semibold text-appForegroundInActive block">
                    {switchingOrg?.name}
                  </label>
                  <label className="font-semibold text-appForeground uppercase block">
                    Please select workspace to switch
                  </label>
                  <span className="block font-normal text-appForegroundInActive">
                    A workspace lets you organize and collaborate on APIs .
                  </span>
                </div>
              </div>
              <div className="pl-4 pb-4 pr-2 overflow-auto visible-scrollbar h-80 mr-2">
                {workspaces.map((w) => (
                  <WorkspaceCard
                    key={w.__ref.id}
                    workspace={w}
                    onClick={(e) => {
                      e.preventDefault();
                      switchToWrs(w);
                    }}
                  />
                ))}
              </div>
            </>
          );
      default:
        return <></>;
    }
  };

  return (
    <>
      <Modal.Header className="with-divider">
        <div className="text-lg leading-5 p-4 flex items-center font-medium">
          Switch Workspace
        </div>
      </Modal.Header>
      <Modal.Body>
        <ProgressBar active={isFetchingWrs} />
        {renderBody(isFetchingWrs)}
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </>
  );
};

export default SwitchWorkspace;

const WorkspaceCard = ({ workspace, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="card relative flex items-center p-3 mb-2 text-base border border-appBorder cursor-pointer hover:border-focusBorder  after:absolute after:top-0 after:left-0 after:bottom-0 after:right-0 hover:after:bg-focusBorder after:opacity-10 "
    >
      <div className="z-10 w-full">
        <div className="flex border-b border-appBorder items-center">
          <div className="font-semibold flex-1 text-base">
            {workspace.name}
            <span className="text-appForegroundInActive font-normal block text-xs uppercase">
              Workspace
            </span>
          </div>
          <div className="cursor-pointer text-primaryColor font-semibold text-base action">
            Switch
          </div>
        </div>
        {/* <div className="flex mt-2">
          <div className="flex-1 text-base">
            Members-
            <span className="text-appForegroundInActive text-sm">
              {workspace?.members?.length}
            </span>
          </div> */}
        {/* <div className="ml-auto">
            <div className="flex text-xs">
              <div className="w-6 h-6 flex justify-center items-center border rounded-full bg-appBorder -ml-1">1</div>
              <div className="w-6 h-6 flex justify-center items-center border rounded-full bg-appBorder -ml-1">2</div>
              <div className="w-6 h-6 flex justify-center items-center border rounded-full bg-appBorder -ml-1">3</div>
              <div className="w-6 h-6 flex justify-center items-center border rounded-full bg-appBorder -ml-1">25+</div>
            </div>
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

const NoWrsFoundMessage = ({ close = () => {} }) => {
  return (
    <div className="p-8 flex flex-col justify-center items-center">
      <div className="text-sm max-w-xs mx-auto text-center px-10">
        <label className="font-semibold text-appForeground uppercase">
          No Workspaces Found
        </label>
        <span className="block font-normal text-appForegroundInActive">
          You're not belonging to any workspaces of this organization.
        </span>
      </div>
      <Button text="Close" sm primary onClick={close} />
    </div>
  );
};

const FetchingWrs = () => {
  return (
    <div className="p-8 flex flex-col justify-center items-center">
      <div className="text-sm max-w-xs mx-auto text-center px-10">
        <label className="font-semibold text-appForeground uppercase">
          Fetching Your Workspaces ...
        </label>
      </div>
    </div>
  );
};
