import { FC } from 'react';
import cx from 'classnames';
import { VscInfo } from '@react-icons/all-files/vsc/VscInfo';
import { EFirecampAgent } from '@firecamp/types';
import shallow from 'zustand/shallow';

import {
  Popover,
  Button,
 
  
  Checkbox,
  // SwitchButton,
} from '@firecamp/ui-kit';
import { IPlatformStore, usePlatformStore } from '../../../store/platform';

const agentNamesMap = {
  [EFirecampAgent.proxy]: 'Cloud Agent',
  [EFirecampAgent.extension]: 'Extension Agent',
  [EFirecampAgent.web]: 'Browser Agent',
};

const FcAgentSelector: FC<any> = () => {
  
  const { agent, isExtAgentInstalled, changeFirecampAgent, checkExtAgentIntalled } = usePlatformStore(
    (s: IPlatformStore) => ({
      agent: s.meta.agent,
      isExtAgentInstalled: s.meta.isExtAgentInstalled,
      changeFirecampAgent: s.changeFirecampAgent,
      checkExtAgentIntalled: s.checkExtAgentIntalled
    }),
    shallow
  );

  const _onSelectAgent = (firecampAgent: EFirecampAgent) => {
    changeFirecampAgent(firecampAgent);
  };

  return (
    <Popover
      content={
        <div className="p-6 w-96">
          <div className="text-base text-appForeground mb-4">
            Select Firecamp Agent
          </div>

          {/* TODO: Enable auto select option in future, temporarily commenting it. */}
          {/* <div className="mb-4 text-base text-appForeground flex items-start">
              <div className="mr-2 font-semibold">Auto Select
                <span className="block text-appForegroundInActive font-normal leading-5 mt-1">Firecamp will automatically select the best agent for your request</span>
              </div>
              <div>
              <SwitchButton checked={false} onChange={()=> {}}/>
              </div>
            </div> */}
          <hr />

          <AgentItem
            name={agentNamesMap[EFirecampAgent.proxy]}
            isSelected={agent == EFirecampAgent.proxy}
            className={`mt-4 mb-2`}
            description={`Send rest requests via Firecamp's <a href="">secure cloud servers</a>.`}
            onSelect={() => _onSelectAgent(EFirecampAgent.proxy)}
          />

          <AgentItem
            name={agentNamesMap[EFirecampAgent.extension]}
            className={`mb-2`}
            isSelected={agent == EFirecampAgent.extension}
            disabled={!isExtAgentInstalled}
            description={`Send rest requests via Firecamp's browser extension.`}
            onSelect={() => _onSelectAgent(EFirecampAgent.extension)}
          >
            {
              !isExtAgentInstalled
                ? (
                  <Button
                    text="Download Firecamp Extension"
                    md
                    primary
                    className="!w-full !min-w-full mt-2 mb-4"
                  />
                ) : <></>
            }
          </AgentItem>

          <AgentItem
            name={agentNamesMap[EFirecampAgent.web]}
            isSelected={agent == EFirecampAgent.web}
            description={`Sending your requests through your browser comes with <a href="#">limitations</a>`}
            onSelect={() => _onSelectAgent(EFirecampAgent.web)}
          />
        </div>
      }
    >
      <Popover.Handler>
        <div className="flex items-center" onClick={()=> checkExtAgentIntalled()}>
          <VscInfo size={14} className="mr-1 text-primaryColor" />
          {agentNamesMap[agent]}
        </div>
      </Popover.Handler>
    </Popover>
  );
};

export { FcAgentSelector };

const AgentItem: FC<IAgentItem> = ({
  name,
  children,
  className,
  description,
  isSelected,
  disabled= false,
  onSelect = () => {},
}) => {
  return (
    <div
      className={cx(className, 'text-base text-appForeground flex items-start')}
    >
      <div className="pt-half" onClick={onSelect}>
        <Checkbox isChecked={isSelected} id={name} disabled={disabled}/>
      </div>
      <div className="font-semibold ml-2">
        <label className="cursor-pointer" htmlFor={name}>
          {name}
        </label>
        <span
          className="block text-appForegroundInActive font-normal leading-5 mt-1"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {children}
      </div>
    </div>
  );
};

interface IAgentItem {
  name: string;
  className?: string;
  isSelected: boolean;
  disabled?: boolean,
  description?: string;
  onSelect: () => void;
}
