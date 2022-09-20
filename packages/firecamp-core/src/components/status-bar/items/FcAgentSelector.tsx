import { FC } from 'react';
import shallow from 'zustand/shallow';
import { VscInfo } from '@react-icons/all-files/vsc/VscInfo';
import cx from 'classnames';
import { EFirecampAgent } from '@firecamp/types';

import {
  Popover,
  Button,
  EButtonColor,
  EButtonSize,
  Checkbox,
  // SwitchButton,
} from '@firecamp/ui-kit';
import { IPlatformStore, usePlatformStore } from '../../../store/platform';

const agentNamesMap = {
  [EFirecampAgent.proxy]: 'Cloud Agent',
  [EFirecampAgent.extension]: 'Extension',
  [EFirecampAgent.web]: 'Browser Agent',
};

const FcAgentSelector: FC<any> = () => {
  let { agent, changeFirecampAgent } = usePlatformStore(
    (s: IPlatformStore) => ({
      agent: s.meta.agent,
      changeFirecampAgent: s.changeFirecampAgent,
    }),
    shallow
  );

  let _onSelectAgent = (firecampAgent: EFirecampAgent) => {
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
            description={`Send Rest requests via Firecamp's <a href="">secure cloud servers</a>.`}
            onSelect={() => _onSelectAgent(EFirecampAgent.proxy)}
          />

          <AgentItem
            name={agentNamesMap[EFirecampAgent.extension]}
            isSelected={agent == EFirecampAgent.extension}
            description={`Send Rest requests via Firecamp's browser extension.`}
            onSelect={() => _onSelectAgent(EFirecampAgent.extension)}
          >
            <Button
              text="Download Firecamp Extension"
              size={EButtonSize.Medium}
              color={EButtonColor.Primary}
              className="!w-full !min-w-full mt-2 mb-4"
            />
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
        <div className="flex items-center">
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
  onSelect = () => {},
}) => {
  return (
    <div
      className={cx(className, 'text-base text-appForeground flex items-start')}
    >
      <div className="pt-half" onClick={onSelect}>
        <Checkbox isChecked={isSelected} id={name} />
      </div>
      <div className="font-semibold ml-2">
        <label className="cursor-pointer" for={name}>
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
  description?: string;
  onSelect: () => void;
}
