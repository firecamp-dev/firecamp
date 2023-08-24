import { FC } from 'react';
import { VscRemote } from '@react-icons/all-files/vsc/VscRemote';
import { EFirecampAgent } from '@firecamp/types';
import { StatusBar } from '@firecamp/ui';
import { _misc } from '@firecamp/utils';

import SwitchWorkspacePanel from './SwitchWorkspacePanel';
import { FcAgentSelector } from './items/FcAgentSelector';
import { DDMenuContainer } from './items/DDMenuContainer';
import { MetaBar } from './items/MetaBar';

const firecampAgent: EFirecampAgent = _misc.firecampAgent();

const StatusBarContainer: FC<any> = ({ className = '' }) => {
  return (
    <StatusBar className={className} id={'firecamp-status-bar'}>
      <SwitchWorkspacePanel />
      <StatusBar.PrimaryRegion id={'firecamp-status-bar-primary-region'}>
        <div
          tabIndex={1}
          className="bg-primaryColor text-primaryColor-text w-fit px-3 flex items-center"
          id={'status-bar-firecamp-version'}
          data-tip={`Firecamp`}
        >
          <VscRemote size={12} />
          <span className="pl-1">Firecamp</span>
        </div>
        <DDMenuContainer />
      </StatusBar.PrimaryRegion>
      <StatusBar.SecondaryRegion id={'firecamp-status-bar-secondary-region'}>
        {firecampAgent === EFirecampAgent.Web && (
          <div className="pr-3">
            <FcAgentSelector />
          </div>
        )}
        <MetaBar />
        <div className="">
          <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/firecamp-dev/firecamp?style=for-the-badge&logo=github&label=Star%20Us&color=%23ddd&cacheSeconds=300" />
        </div>
      </StatusBar.SecondaryRegion>
    </StatusBar>
  );
};

export default StatusBarContainer;
