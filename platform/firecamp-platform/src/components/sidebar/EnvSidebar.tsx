import { FC, useState, useEffect, useMemo, useRef } from 'react';
import { VscClose } from '@react-icons/all-files/vsc/VscClose';
import classnames from 'classnames';
import equal from 'deep-equal';
import shallow from 'zustand/shallow';
import {
  Resizable,
  Container,
  Editor,
  TabHeader,
  Button, 
} from '@firecamp/ui-kit';
import { EEditorLanguage, EEnvironmentScope, IEnvironment } from '@firecamp/types';

import EnvironmentDD from '../common/environment/environment-widget/EnvironmentDD';
import pltContext from '../../services/platform-context';
import { useEnvStore, IEnvironmentStore } from '../../store/environment';
import { useTabStore } from '../../store/tab';
import platformContext from '../../services/platform-context';

const EnvSidebar: FC<any> = ({ expanded }) => {
  const {
    activeTabWrsEnv,
    activeTabCollectionEnvs,

    toggleEnvSidebar,
  } = useEnvStore(
    (s: IEnvironmentStore) => ({
      activeTabWrsEnv: s.activeTabWrsEnv,
      activeTabCollectionEnvs: s.activeTabCollectionEnvs,
      toggleEnvSidebar: s.toggleEnvSidebar,
    }),
    shallow
  );

  console.log({
    activeTabWrsEnv,
    activeTabCollectionEnvs,
  })

  const { tab, activeTab } = useTabStore(
    (s: any) => ({
      tab: s.list[s.activeTab] || {},
      activeTab: s.activeTab,
    }),
    shallow
  );

  const [activeCollectionEnv, setActiveCollectionEnv] = useState('');

  /** if active tab change then set current active tab's envs in sidebar*/
  useEffect(() => {
    let collectionId = tab?.request?.__ref?.collectionId;
    // console.log({ collectionId });
    if (tab?.__meta?.isSaved && collectionId) {
      setActiveCollectionEnv(activeTabCollectionEnvs[collectionId] || '');
    } else {
      /** is request is not saved then don't set collection scoped env */
      setActiveCollectionEnv('');
    }
  }, [tab, activeTab, activeTabCollectionEnvs]);
  
  return (
    <Resizable
      width={'400'}
      height="100%"
      left={true}
      minWidth={'250'}
      maxWidth={'600'}
      className={classnames("!absolute border-l border-appBorder bg-activityBarBackground top-0 right-0 bottom-0 z-30 expandable-right-pane", {'expanded': expanded})}
    >
      <Container>
        <Container.Header className="flex !p-2 bg-focus1">
          <div className="flex-1 mr-2 text-base p-2 font-bold">Active Environments</div>
          <div
            className="ml-auto flex-none text-base flex justify-center items-center cursor-pointer"
            onClick={toggleEnvSidebar}
          >
            <VscClose size={16} />
          </div>
        </Container.Header>
        <Container.Body className="flex flex-col">
          {/* <EnvVarPreview
            key={`env-preview-${EEnvironmentScope.Workspace}`}
            scope={EEnvironmentScope.Workspace}
            activeEnvId={activeTabWrsEnv}
            activeTab={activeTab}
          /> */}
          {!!activeCollectionEnv ? (
            <EnvVarPreview
              key={`env-preview-${EEnvironmentScope.Collection}`}
              scope={EEnvironmentScope.Collection}
              activeEnvId={activeCollectionEnv}
              activeTab={activeTab}
              collectionId={tab?.request?.__ref?.collectionId}
            />
          ) :  <></>}
        </Container.Body>
        <Container.Footer className="text-sm !p-1 bg-focus3">
          <ol>
            <li>1. use variable with {'{{variableName}}'} </li>
            <li>
              2. If variables have the same name, the collection environment
              will take precedence over the workspace environment
            </li>
          </ol>
        </Container.Footer>
      </Container>
    </Resizable>
  );
};

const EnvSidebarContainer = ()=> {
  const {
    isEnvSidebarOpen
  } = useEnvStore(
    (s: IEnvironmentStore) => ({
      isEnvSidebarOpen: s.isEnvSidebarOpen
    }),
    shallow
  );
  if(!isEnvSidebarOpen) return <></>;
  return <EnvSidebar expanded={isEnvSidebarOpen}/>
}
export { EnvSidebar, EnvSidebarContainer };

const EnvVarPreview: FC<IEnvVarPreview> = ({
  scope = EEnvironmentScope.Workspace,
  activeEnvId = '',
  collectionId = '',
  activeTab = '',
}) => {
  const {
    updateEnvironment,
    getWorkspaceEnvs,
    getCollectionEnvs,
    setEnvVariables,
    setWorkspaceActiveEnv,
    setCollectionActiveEnv,
  } = useEnvStore(
    (s) => ({
      updateEnvironment: s.updateEnvironment,
      getWorkspaceEnvs: s.getWorkspaceEnvs,
      getCollectionEnvs: s.getCollectionEnvs,
      setEnvVariables: s.setEnvVariables,
      setWorkspaceActiveEnv: s.setWorkspaceActiveEnv,
      setCollectionActiveEnv: s.setCollectionActiveEnv,
    }),
    shallow
  );

  const envs = useMemo(
    () =>
      scope == EEnvironmentScope.Workspace
        ? getWorkspaceEnvs()
        : getCollectionEnvs(collectionId),
    [activeEnvId, collectionId, activeTab]
  );

  // console.log({ activeEnvId, collectionId, activeTab, scope, envs });

  const activeEnv = useRef<IEnvironment>(envs.find((env) => env.__ref.id === activeEnvId));
  const [ variables, setVariables ] = useState<string>('');
  const [ isVarUpdated, setIsVarUpdated ] = useState<boolean>(false);

  // if env/variables change from outer side then update them into the currently opened sidebar
  useEffect(() => {
    activeEnv.current = envs.find((env) => env.__ref.id === activeEnvId);
    try {
      if(!activeEnv.current) return;
      const variablesString = JSON.stringify(activeEnv.current.variables || {}, null, 2);

      if (variablesString !== variables) {
        // console.log({ variablesString })
        setVariables(variablesString);
      }
    } catch (error) {
      console.log({ error });
    }
  }, [envs, activeEnvId, collectionId, activeTab]);

  /** if variables changed then show save/undo buttons */
  useEffect(() => {
    try {
      const vars = JSON.parse(variables || '{}');
      const isEqual = equal(vars, activeEnv.current.variables);
      setIsVarUpdated(!isEqual);
    } catch (e) {
      console.log({ e });
    }
  }, [variables, envs]);

  const onChangeVariable = (variables: string) => {
    setVariables(variables); // even if the payload is not a JSON, still it needs to be render in Editor
  };

  const onUndoChanges = () => {
    let variablesString = JSON.stringify(activeEnv.current.variables || {}, null, 2);
    setVariables(variablesString);
  };

  const onUpdate = async () => {
    let vars ={};
    try {
      vars = JSON.parse(variables);
    }
    catch (e) {
      platformContext.app.notify.alert("The variables are not valid JSON.")
    }

    /** update env vars */
    await updateEnvironment(activeEnvId, { variables: vars });
    setIsVarUpdated(false);
    
    // get environment changes and emit to request tab
    pltContext.environment.setVarsToProvidersAndEmitEnvsToTab();
  };

  const _setActiveEnv = (envId) => {
    if (scope === EEnvironmentScope.Workspace) {
      setWorkspaceActiveEnv(envId);
    } else {
      setCollectionActiveEnv(collectionId, envId);
    }
    // get environment changes and emit to request tab
    pltContext.environment.setVarsToProvidersAndEmitEnvsToTab();
  };

  return (
    <div className="flex-1">
      <div className="border-b border-t border-appBorder flex">
        <TabHeader className="height-ex-small">
          <TabHeader.Left className="text-base font-normal">
            Scope: {scope == EEnvironmentScope.Workspace? "Workspace": "Collection"}
          </TabHeader.Left>
          <TabHeader.Right className="env-popover-nested">
            <EnvironmentDD
              key={`${scope}-env-dd-${activeEnvId}`}
              activeEnv={activeEnvId}
              environments={envs}
              onChange={_setActiveEnv}
              scope={scope}
              collectionId={collectionId}
            />
          </TabHeader.Right>
        </TabHeader>
      </div>
      <div style={{ height: 'calc(50vh - 100px)' }}>
        <Editor
          autoFocus={true}
          language={EEditorLanguage.Json}
          value={variables}
          placeholder="{ variableKey: variableValue}"
          onChange={(e) => {
            onChangeVariable(e.target.value);
          }}
          onCtrlS={onUpdate}
          controlsConfig={{
            show: true,
          }}
          monacoOptions={{
            wordWrap: 'off',
          }}
        />
      </div>

      <div>
        {isVarUpdated === true ? (
          <TabHeader>
            <TabHeader.Right>
              <Button
                text={'Undo Changes'}
                onClick={onUndoChanges}
                disabled={!isVarUpdated}
                primary
                transparent
                sm
              />
              <Button
                text={'Update'}
                onClick={onUpdate}
                disabled={!isVarUpdated}
                primary
                sm
              />
            </TabHeader.Right>
          </TabHeader>
        ) : <></>}
      </div>
    </div>
  );
};

interface IEnvVarPreview {
  activeEnvId: string;
  collectionId?: string;
  scope: EEnvironmentScope;
  activeTab?: string;
}
