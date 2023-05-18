import { FC, useState } from 'react';
import { VscSearch } from '@react-icons/all-files/vsc/VscSearch';
import { VscClose } from '@react-icons/all-files/vsc/VscClose';
import { Button, Input } from '@firecamp/ui';
import './SwitchWorkspacePanel.scss';

const SwitchWorkspacePanel: FC<any> = ({ className = '' }) => {
  let [isPanelOpen, togglePanel] = useState(false);

  if (!isPanelOpen) return <></>;
  return (
    <div className="absolute left-0 right-0 bottom-6 bg-app-background-secondary p-4 border-t border-appBorder">
      <VscClose
        size={20}
        strokeWidth={1}
        className="absolute right-3 top-3 cursor-pointer"
        onClick={() => togglePanel(!isPanelOpen)}
      />
      <div className=" text-base font-bold text-appForegroundActive mb-3">
        Organization workspace
      </div>
      <div className="mb-4 w-60">
        <Input
          placeholder="Search"
          icon={<VscSearch title="Account" size={16} />}
          iconPosition="left"
        />
      </div>
      <div className="workspace-wrapper flex overflow-auto flex-nowrap custom-scrollbar">
        <WorkspaceCard />
        <WorkspaceCard />
        <WorkspaceCard />
        <WorkspaceCard />
        <WorkspaceCard />
        <WorkspaceCard />
        <WorkspaceCard />
        <WorkspaceCard />
        <WorkspaceCard />
        <WorkspaceCard />
        <WorkspaceCard />
        <WorkspaceCard />
      </div>
    </div>
  );
};

export default SwitchWorkspacePanel;

const WorkspaceCard: FC<any> = () => {
  return (
    <div className="workpsace-card relative flex cursor-pointer flex-col border border-appBorder ml-2 mr-2 first:ml-0 last:mr-0">
      <div className="border-b border-appBorder flex flex-row p-2 pb-4">
        <div>
          <span className="block text-base text-app-foreground font-semibold whitespace-pre leading-5">
            16 Pixel
          </span>
          <span className="block text-sm text-appForegroundInActive font-normal leading-3">
            Workspace
          </span>
        </div>
        <div className="ml-auto workpsace-card-action">
          <Button text="Switch" primary xs transparent={true} ghost={true} />
        </div>
      </div>
      <div className="flex flex-row p-2">
        <label className="mr-4">Members</label>
        <div className="flex ml-auto">
          <div>
            <div
              data-tip="Tooltip text"
              data-for="1"
              className="w-6 h-6 border border-appForegroundInActive text-app-foreground bg-appBorder text-xs flex justify-center items-center rounded-full -ml-2"
            >
              M
            </div>
          </div>
          <div>
            <div
              data-tip="Tooltip text"
              data-for="2"
              className="w-6 h-6 border border-appForegroundInActive text-app-foreground bg-appBorder text-xs flex justify-center items-center rounded-full -ml-2"
            >
              M
            </div>
          </div>
          <div>
            <div
              data-tip="Tooltip text"
              data-for="3"
              className="w-6 h-6 border border-appForegroundInActive text-app-foreground bg-appBorder text-xs flex justify-center items-center rounded-full -ml-2"
            >
              M
            </div>
          </div>
          <div>
            <div
              data-tip="Tooltip text"
              data-for="4"
              className="w-6 h-6 border border-appForegroundInActive text-app-foreground bg-appBorder text-xs flex justify-center items-center rounded-full -ml-2"
            >
              M
            </div>
          </div>
          <div
            data-tip="Tooltip text"
            data-for="5"
            className="w-6 h-6 border border-app-foreground text-primaryColorText bg-primaryColor text-xs flex justify-center items-center rounded-full -ml-2"
          >
            +25
          </div>
        </div>
      </div>
    </div>
  );
};
