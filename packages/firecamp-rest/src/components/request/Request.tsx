import { useMemo } from 'react';
import { VscCode } from '@react-icons/all-files/vsc/VscCode';
import shallow from 'zustand/shallow';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  preScriptSnippets,
  postScriptSnippets,
} from '@firecamp/rest-executor/dist/esm/script-runner/snippets';
import {
  AvailableOnElectron,
  Button,
  Column,
  Container,
  ScriptsTabs,
  Tabs,
} from '@firecamp/ui-kit';
import { EFirecampAgent } from '@firecamp/types';
import { _misc } from '@firecamp/utils';

import BodyTab from './tabs/BodyTab';
import HeadersTab from './tabs/HeadersTab';
import AuthTab from './tabs/AuthTab';
import ParamsTab from './tabs/ParamsTab';
import ConfigTab from './tabs/ConfigTab';
import { IStore, useStore } from '../../store';
import { ERequestPanelTabs } from '../../types';

const Request = ({ tab }) => {
  useHotkeys(`cmd+h`, (k, e) => console.log('This is the cmd+h', k, e));
  const {
    scripts,
    requestPanel,
    changeScripts,
    changeUiActiveTab,
    toggleOpenCodeSnippet,
  } = useStore(
    (s: IStore) => ({
      scripts: s.request.scripts,
      requestPanel: s.ui.requestPanel,
      changeScripts: s.changeScripts,
      changeUiActiveTab: s.changeUiActiveTab,
      toggleOpenCodeSnippet: s.toggleOpenCodeSnippet,
    }),
    shallow
  );
  const { activeTab } = requestPanel;
  const tabs = useMemo(
    () => [
      {
        id: ERequestPanelTabs.Body,
        name: ERequestPanelTabs.Body,
        dotIndicator: requestPanel.hasBody,
      },
      {
        id: ERequestPanelTabs.Auths,
        name: ERequestPanelTabs.Auths,
        dotIndicator: requestPanel.hasAuth,
      },
      {
        id: ERequestPanelTabs.Headers,
        name: ERequestPanelTabs.Headers,
        count: requestPanel.headers,
      },
      {
        id: ERequestPanelTabs.Params,
        name: ERequestPanelTabs.Params,
        count: requestPanel.params,
      },
      {
        id: ERequestPanelTabs.PrePostScripts,
        name: ERequestPanelTabs.PrePostScripts,
        dotIndicator: requestPanel.hasScripts,
      },
      {
        id: ERequestPanelTabs.Config,
        name: ERequestPanelTabs.Config,
        dotIndicator: requestPanel.hasConfig,
      },
    ],
    [requestPanel]
  );

  const _renderTab = () => {
    switch (activeTab) {
      case ERequestPanelTabs.Body:
        return <BodyTab />;
      case ERequestPanelTabs.Auths:
        return <AuthTab />;
      case ERequestPanelTabs.Headers:
        return <HeadersTab />;
      case ERequestPanelTabs.Params:
        return <ParamsTab />;
      case ERequestPanelTabs.PrePostScripts:
        console.log(scripts, 'scripts in request');
        return (
          <ScriptsTabs
            id={tab?.id}
            scripts={scripts}
            allowInherit={false}
            inheritScriptMessage={
              tab?.__meta?.isSaved ? '' : 'Please save request first'
            }
            snippets={{
              pre: preScriptSnippets,
              post: postScriptSnippets,
            }}
            onChangeScript={changeScripts}
          />
        );
      case ERequestPanelTabs.Config:
        if (
          _misc.firecampAgent() === EFirecampAgent.Desktop
          // || context.getFirecampAgent() === EFirecampAgent.Cloud
        ) {
          return <ConfigTab />;
        } else {
          return <AvailableOnElectron name="Request configuration" />;
        }
      default:
        return <></>;
    }
  };

  const _toggleCodeSnippet = () => {
    toggleOpenCodeSnippet();
  };

  return (
    <Column
      height={'100%'}
      flex={1}
      minWidth="20%"
      maxWidth={'80%'}
      overflow="visible"
      width={'50%'}
    >
      <Container>
        <Container.Header className="z-20">
          <Tabs
            list={tabs}
            activeTab={activeTab}
            onSelect={(tab: string) => {
              // console.log(tab, 'tab...');
              changeUiActiveTab(tab);
            }}
            /* tabsClassName={
            'tabs-with-bottom-border-left-section  scrollable invisible-scrollbar'
          }
          navItemClassName={
            activeTab === 'body' ? ' primary-tab-with-attached-statusbar' : ''
          } */
            postComp={() => (
              <Button
                icon={<VscCode className="mr-2" size={12} />}
                // TODO: Add class for tabs-with-bottom-border-right-section
                onClick={_toggleCodeSnippet}
                secondary
                text="Code"
                transparent={true}
                ghost={true}
                iconLeft
                sm
              />
            )}
          />
        </Container.Header>
        <Container.Body
          overflow={
            activeTab === ERequestPanelTabs.PrePostScripts ? 'auto' : 'hidden'
          }
        >
          {_renderTab()}
        </Container.Body>
      </Container>
    </Column>
  );
};

export default Request;
