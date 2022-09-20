import { FC, useEffect } from 'react';
import classnames from 'classnames';
import { Column, Row, RootContainer } from '@firecamp/ui-kit';
import _cloneDeep from 'lodash/cloneDeep';
import shallow from 'zustand/shallow';
import { _object } from '@firecamp/utils';
import { EEnvironmentScope, ERequestTypes, TId } from '@firecamp/types';
import { _misc } from '@firecamp/utils';

import Home from './home/Home';
import TabBody from './TabBody';
import { useTabStore } from '../../store/tab';
import { useEnvStore, IEnvironmentStore } from '../../store/environment';
import { ITab, ITabFns } from './types/tab';
import TabHeaderContainer from './header/TabHeaderContainer';
import { ITabMeta } from './types/tab';

const Tabs: FC<any> = () => {
  let { tabs, activeTab, tabFns } = useTabStore(
    (s: any) => ({
      tabs: s.list,
      activeTab: s.activeTab,

      tabFns: {
        reorder: s.reorder,
        open: s.open,
        close: s.close,
        update: s.update,
      },
    }),
    shallow
  );

  let { toggleEnvSidebar, setWorkspaceActiveEnv, setCollectionActiveEnv } =
    useEnvStore(
      (s: IEnvironmentStore) => ({
        toggleEnvSidebar: s.toggleEnvSidebar,
        setWorkspaceActiveEnv: s.setWorkspaceActiveEnv,
        setCollectionActiveEnv: s.setCollectionActiveEnv,
      }),
      shallow
    );

  /**
   * Close environment side bar if no tab is open
   */
  useEffect(() => {
    if (!tabs.length) {
      let isEnvSidebarOpen = useEnvStore.getState().is_env_sidebar_open;

      // check if open env side bar
      if (isEnvSidebarOpen) {
        toggleEnvSidebar();
      }
    }
  }, [tabs]);

  let _tabFns: ITabFns = {
    setActive: (tabId) => {
      tabFns.update.activeTab(tabId);
    },

    open: (tabType: string, subType: string) => {
      if (!tabType) {
        if (tabs?.length === 0) tabType = ERequestTypes.Rest;
        else {
          let tab;
          if ((activeTab || activeTab) === 'home') {
            tab = tabs?.[tabs?.length - 1];
          } else {
            tab = (tabs || []).find((tab) => tab.id === activeTab || activeTab);
          }
          tabType = tab?.type;
          subType = tab?.subType;
        }
      }
      if (tabType) tabFns.open.new(tabType, true, subType);
    },

    close: (e: any, tabId: string, doSave: boolean) => {
      if (e) e?.stopPropagation();
      // console.log(tabId, doSave)
      if (doSave) {
        //Todo: this is hack for now, we should close it by redux or calling func
        document.getElementById(`save-request-${tabId}`).click(); //click on Save button programmatically
      }

      tabFns.close.active(tabId);
    },
    reorder: (dragIndex: number, hoverIndex: number) => {
      tabFns.reorder(dragIndex, hoverIndex);
    },

    closeAll: (e) => {
      if (e) e?.preventDefault();
      tabFns.close.all();
    },
    closeAllSaved: (e) => {
      if (e) e?.preventDefault();
      tabFns.close.allSaved();
    },
    closeAllFresh: (e) => {
      if (e) e?.preventDefault();
      tabFns.close.allFresh();
    },
    closeAllExceptActive: (e) => {
      if (e) e?.preventDefault();
      tabFns.close.allExceptActive();
    },
    save: () => {
      document.getElementById(`save-request-${activeTab}`).click();
    },
    updateMeta: (tabId: TId, meta: ITabMeta) => {
      // console.log({ tabId, meta });

      tabFns.update.meta(tabId, meta);
    },
    updateRootKeys: (tabId: TId, updatedTab: Partial<ITab>) => {
      tabFns.update.rootKeys(tabId, updatedTab);
    },
  };

  let _setActiveEnvironments = (requestEnvMeta: {
    activeEnvironments: {
      [EEnvironmentScope.Workspace]: TId;
      [EEnvironmentScope.Collection]?: TId;
    };
    collection_id?: TId;
  }) => {
    // console.log({ requestEnvMeta });

    if ('activeEnvironments' in requestEnvMeta) {
      if (requestEnvMeta.activeEnvironments) {
        if (requestEnvMeta.activeEnvironments[EEnvironmentScope.Workspace]) {
          // Change workspace selected environment
          let currentWrsSelectedEnv = useEnvStore.getState().active_tab_wrs_env,
            updatedActiveWrsEnv =
              requestEnvMeta.activeEnvironments[EEnvironmentScope.Workspace];

          // console.log({ currentWrsSelectedEnv, updatedActiveWrsEnv });

          if (
            updatedActiveWrsEnv &&
            updatedActiveWrsEnv !== currentWrsSelectedEnv
          ) {
            setWorkspaceActiveEnv(updatedActiveWrsEnv);
          }
        }
        // Change collection selected environment
        if (
          requestEnvMeta.collection_id &&
          requestEnvMeta.activeEnvironments[EEnvironmentScope.Collection]
        ) {
          let collection_id = requestEnvMeta.collection_id;

          let currentCollectionSelectedEnv =
              useEnvStore.getState().active_tab_collection_envs?.[
                collection_id
              ],
            updatedActiveCollectionEnv =
              requestEnvMeta.activeEnvironments[EEnvironmentScope.Collection];
          if (
            updatedActiveCollectionEnv &&
            updatedActiveCollectionEnv !== currentCollectionSelectedEnv
          ) {
            setCollectionActiveEnv(collection_id, updatedActiveCollectionEnv);
          }
        }
      }
    }
  };

  return (
    <RootContainer className="fc-tabs">
      <Row className="flex-col fc-h-screen" overflow="hidden">
        <TabHeaderContainer
          tabs={tabs}
          activeTab={activeTab}
          _tabFns={_tabFns}
        />

        <Column flex={1} className="visible-scrollbar" overflow="auto">
          <div
            className={classnames(
              'fc-container fc-h-full invisible-scrollbar tab-content'
            )}
          >
            <div
              className={classnames('tab-pane', {
                active: activeTab == 'home',
              })}
            >
              <Home />
            </div>
            {tabs.map((t, i) => (
              <div
                className={classnames('tab-pane', {
                  active: activeTab == t.id,
                })}
                key={t.id}
              >
                <TabBody
                  tabObj={t}
                  index={i}
                  key={t.id}
                  tabFns={_tabFns}
                  toggleEnvSidebar={toggleEnvSidebar}
                  activeTab={activeTab}
                  setActiveEnvironments={_setActiveEnvironments}
                />
              </div>
            ))}
          </div>
        </Column>
      </Row>
    </RootContainer>
  );
};

export default Tabs;
