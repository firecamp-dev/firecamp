import { useMemo } from 'react';
import { VscCode } from '@react-icons/all-files/vsc/VscCode';
import shallow from 'zustand/shallow';

import { ERequestPanelTabs } from '../../types';
import BodyTab from './tabs/BodyTab';
import HeadersTab from './tabs/HeadersTab';
import AuthTab from './tabs/AuthTab';
import ParamsTab from './tabs/ParamsTab';
import ConfigTab from './tabs/ConfigTab';

import {
  AvailableOnElectron,
  Container,
  Button,
  Tabs,
  ScriptsTabs,
} from '@firecamp/ui-kit';

import { IRestStore, useRestStore } from '../../store';
import { EFirecampAgent } from '@firecamp/types';
import { _misc } from '@firecamp/utils';

const RequestPanel = ({ tab, getFirecampAgent }) => {
  const {
    // headers,
    scripts,
    __meta: { inheritScripts },
    requestPanel,
    changeScripts,

    changeMeta,
    changeUiActiveTab,
    toggleOpenCodeSnippet,
  } = useRestStore(
    (s: IRestStore) => ({
      // headers: s.headers,
      scripts: s.request.scripts,
      __meta: s.request.__meta,
      requestPanel: s.ui.requestPanel,

      changeScripts: s.changeScripts,
      changeMeta: s.changeMeta,
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
        id: ERequestPanelTabs.Scripts,
        name: ERequestPanelTabs.Scripts,
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

  const _onSelectInheritScript = (
    type: string,
    inherit: boolean
  ): Promise<any> => {
    changeMeta({
      inherit_scripts: {
        ...inheritScripts,
        [type]: inherit,
      },
    });
    // todo: add code for inherit

    return Promise.resolve({});
  };

  const openParentScriptsModal = (): void => {};

  const _renderTab = () => {
    switch (activeTab) {
      case ERequestPanelTabs.Body:
        return <BodyTab />;
        break;
      case ERequestPanelTabs.Auths:
        return <AuthTab />;
        break;
      case ERequestPanelTabs.Headers:
        return <HeadersTab />;
        break;
      case ERequestPanelTabs.Params:
        return <ParamsTab />;
        break;
      case ERequestPanelTabs.Scripts:
        return (
          <ScriptsTabs
            id={tab?.id}
            scripts={scripts}
            onChangeScript={changeScripts}
            allowInherit={true}
            onClickInherit={_onSelectInheritScript}
            openParentScriptsModal={openParentScriptsModal}
            inheritScriptMessage={
              tab?.meta?.isSaved ? '' : 'Please save request first'
            }
            inheritScript={inheritScripts || {}}
          />
        );
        break;
      case ERequestPanelTabs.Config:
        if (
          _misc.firecampAgent() === EFirecampAgent.desktop ||
          getFirecampAgent() === EFirecampAgent.proxy
        ) {
          return <ConfigTab />;
        } else {
          return <AvailableOnElectron name="Request configuration" />;
        }
        break;
      default:
        return <BodyTab />;

        break;
    }
  };

  const _toggleCodeSnippet = () => {
    toggleOpenCodeSnippet();
  };

  return (
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
              secondary
              text="Code"
              transparent={true}
              ghost={true}
              iconLeft
              sm
              icon={<VscCode className="mr-2" size={12} />}
              // TODO: Add class for tabs-with-bottom-border-right-section
              onClick={_toggleCodeSnippet}
            />
          )}
        />
      </Container.Header>
      <Container.Body
        overflow={activeTab === ERequestPanelTabs.Scripts ? 'auto' : 'hidden'}
      >
        {_renderTab()}
      </Container.Body>
    </Container>
  );
};

export default RequestPanel;
