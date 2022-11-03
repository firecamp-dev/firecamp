import { useState } from 'react';
import { Container, Resizable, SecondaryTab, Tabs } from '@firecamp/ui-kit';
// import equal from 'deep-equal';
import { VscChevronDown } from '@react-icons/all-files/vsc/VscChevronDown';

import Variables from './Variables';
import Files from './Files';
import classnames from 'classnames';

const PlaygroundFooter = () => {
  let [tabs, setTabs] = useState([
    { id: 'variables', name: 'Variables' },
    { id: 'files', name: 'Files' },
  ]);
  let [activeTab, onSelect] = useState('variables');
  let [showFooter, toggleFooter] = useState(true);

  let _renderTab = (tab) => {
    switch (tab) {
      case 'variables':
        return <Variables />;
        break;
      case 'files':
        return <Files />;
        break;
    }
  };

  let _onSelectTab = (tab) => {
    // console.log(`tab`, tab, showFooter);
    if (!showFooter) toggleFooter(true);
    onSelect(tab);
  };

  return (
    <Resizable
      top={true}
      width="100%"
      height="152px"
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
