import { FC } from 'react';
import cx from 'classnames';
import { Info } from 'lucide-react';
import { EFirecampAgent } from '@firecamp/types';
import { shallow } from 'zustand/shallow';
import {
  Popover,
  Button,
  Checkbox,
  // SwitchButton,
} from '@firecamp/ui';
import { IPlatformStore, usePlatformStore } from '../../../store/platform';

const agentNamesMap = {
  [EFirecampAgent.Cloud]: 'Cloud Agent',
  [EFirecampAgent.Extension]: 'Extension Agent',
  [EFirecampAgent.Web]: 'Browser Agent',
};

const FcAgentSelector: FC<any> = () => {
  const {
    agent,
    isExtAgentInstalled,
    changeFirecampAgent,
    checkExtAgentInstalled,
  } = usePlatformStore(
    (s: IPlatformStore) => ({
      agent: s.__meta.agent,
      isExtAgentInstalled: s.__meta.isExtAgentInstalled,
      changeFirecampAgent: s.changeFirecampAgent,
      checkExtAgentInstalled: s.checkExtAgentInstalled,
    }),
    shallow
  );

  const _onSelectAgent = (firecampAgent: EFirecampAgent) => {
    changeFirecampAgent(firecampAgent);
  };

  return (
    <Popover
      className="border border-app-border"
      content={
        <div className="p-6 w-96">
          <div className="text-base text-app-foreground mb-4">
            Select Firecamp Agent
          </div>

          {/* TODO: Enable auto select option in future, temporarily commenting it. */}
          {/* <div className="mb-4 text-base text-app-foreground flex items-start">
              <div className="mr-2 font-semibold">Auto Select
                <span className="block text-app-foreground-inactive font-normal leading-5 mt-1">Firecamp will automatically select the best agent for your request</span>
              </div>
              <div>
              <SwitchButton checked={false} onChange={()=> {}}/>
              </div>
            </div> */}
          <hr />

          <AgentItem
            name={agentNamesMap[EFirecampAgent.Cloud]}
            isSelected={agent == EFirecampAgent.Cloud}
            className={`mt-4 mb-2`}
            description={`Send rest requests via Firecamp's <a href="">secure cloud servers</a>.`}
            onSelect={() => _onSelectAgent(EFirecampAgent.Cloud)}
          />

          <AgentItem
            name={agentNamesMap[EFirecampAgent.Web]}
            isSelected={agent == EFirecampAgent.Web}
            description={`Sending your requests through your browser comes with <a href="#">limitations</a>`}
            onSelect={() => _onSelectAgent(EFirecampAgent.Web)}
          />

          <AgentItem
            name={`${agentNamesMap[EFirecampAgent.Extension]} (Coming Soon...)`}
            className={`mb-2`}
            isSelected={agent == EFirecampAgent.Extension}
            disabled={!isExtAgentInstalled}
            description={`Send rest requests via Firecamp's browser extension.`}
            onSelect={() => _onSelectAgent(EFirecampAgent.Extension)}
          >
            {/* {
              !isExtAgentInstalled
                ? (
                  <Button
                    text="Download Firecamp Extension"
                    className="!w-full !min-w-full mt-2 mb-4"
                    primary
                    sm
                  />
                ) : <></>
            } */}
          </AgentItem>
        </div>
      }
    >
      <Popover.Handler>
        <div
          className="flex items-center w-28	"
          onClick={() => checkExtAgentInstalled()}
        >
          <Info size={14} className="mr-1 text-primaryColor" />
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
  disabled = false,
  onSelect = () => {},
}) => {
  return (
    <div
      className={cx(
        className,
        'text-base text-app-foreground flex items-start'
      )}
    >
      <div className="pt-half" onClick={onSelect}>
        <Checkbox
          checked={isSelected}
          id={name}
          disabled={disabled}
          classNames={{ root: 'mr-2' }}
        />
      </div>
      <div className="font-semibold ml-2">
        <label className="cursor-pointer" htmlFor={name}>
          {name}
        </label>
        <span
          className="block text-app-foreground-inactive font-normal leading-5 mt-1"
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
  disabled?: boolean;
  description?: string;
  onSelect: () => void;
}
