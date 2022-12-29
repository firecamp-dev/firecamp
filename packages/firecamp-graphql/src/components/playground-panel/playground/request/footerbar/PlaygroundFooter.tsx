import { useState } from 'react';
import { Container, Resizable, SecondaryTab } from '@firecamp/ui-kit';
import { VscChevronDown } from '@react-icons/all-files/vsc/VscChevronDown';

import Variables from './Variables';
import Files from './Files';
import classnames from 'classnames';

const PlaygroundFooter = () => {
  const [tabs, setTabs] = useState([
    { id: 'variables', name: 'Variables' },
    { id: 'files', name: 'Files' },
  ]);
  const [activeTab, onSelect] = useState('variables');
  const [showFooter, toggleFooter] = useState(true);

  const _renderTab = (tab: string) => {
    switch (tab) {
      case 'variables':
        return <Variables />;
      case 'files':
        return <Files />;
      default:
        return <></>;
    }
  };

  const _onSelectTab = (tab) => {
    if (!showFooter) toggleFooter(true);
    onSelect(tab);
  };

  return (
    <Resizable
      top={true}
      width="100%"
      height="100%"
      minHeight={100}
      maxHeight={300}
      className={!showFooter ? 'collapsed' : ''}
    >
      <Container>
        <Container.Header className="z-20">
          {/* <Tabs
            list={tabs}
            activeTab={activeTab}
            onSelect={_onSelectTab}
            // tabsClassName="tabs-with-bottom-border-left-section"
            postComp={_ => (
              <CollapsedButton toggleFooter={() => toggleFooter(!showFooter)} />
            )}
          /> */}

          <SecondaryTab
            className="flex items-center ml-2"
            list={tabs}
            activeTab={activeTab}
            onSelect={_onSelectTab}
            // onSelect={(tabId: EInviteMemberTabs)=> setActiveTab(tabId)}
          />
        </Container.Header>
        <Container.Body
          className={classnames('fc-collapsable h-full', {
            hidden: !showFooter,
          })}
        >
          {_renderTab(activeTab)}
        </Container.Body>
      </Container>
    </Resizable>
  );
};

const CollapsedButton = ({ toggleFooter }) => {
  return (
    <div className="btn-collapse" onClick={() => toggleFooter()}>
      <VscChevronDown size="20" />
    </div>
  );
};
export default PlaygroundFooter;
