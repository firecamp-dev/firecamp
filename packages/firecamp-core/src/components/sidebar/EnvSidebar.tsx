import { FC, useState, useEffect, useMemo } from 'react';
import { VscClose } from '@react-icons/all-files/vsc/VscClose';
import {
  Resizable,
  Container,
  MultiLineIFE,
  TabHeader,
  Button,
 
  
} from '@firecamp/ui-kit';
import equal from 'deep-equal';
import shallow from 'zustand/shallow';
import { EEnvironmentScope } from '@firecamp/types';

import { useEnvStore, IEnvironmentStore } from '../../store/environment';
import EnvironmentDD from '../common/environment/environment-widget/EnvironmentDD';
import { useTabStore } from '../../store/tab';
import * as platformContext from '../../services/platform-context';
import classnames from 'classnames';

const EnvSidebar: FC<any> = (expanded) => {
  let {
    is_env_sidebar_open,
    active_tab_wrs_env,
    active_tab_collection_envs,

    toggleEnvSidebar,
  } = useEnvStore(
    (s: IEnvironmentStore) => ({
      is_env_sidebar_open: s.is_env_sidebar_open,

      active_tab_wrs_env: s.active_tab_wrs_env,
      active_tab_collection_envs: s.active_tab_collection_envs,
      toggleEnvSidebar: s.toggleEnvSidebar,
    }),
    shallow
  );

  let { tab, activeTab } = useTabStore(
    (s: any) => ({
      tab: s.list?.find((t) => t.id === s.activeTab) || {},
      activeTab: s.activeTab,
    }),
    shallow
  );

  let [activeCollectionEnv, setActiveCollectionEnv] = useState('');

  useEffect(() => {
    let collection_id = tab?.request?._meta?.collection_id;
    // console.log({ collection_id });

    if (tab && tab?.meta?.isSaved && collection_id) {
      setActiveCollectionEnv(active_tab_collection_envs[collection_id] || '');
    } else {
      setActiveCollectionEnv('');
    }
  }, [tab, activeTab, active_tab_collection_envs]);

  // console.log({ activeCollectionEnv });
  if (!is_env_sidebar_open) return <></>;

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
          <div className="flex-1 mr-2 text-base p-2">Active Environments</div>
          <div
            className="ml-auto flex-none text-base flex justify-center items-center cursor-pointer"
            onClick={toggleEnvSidebar}
          >
            <VscClose size={16} />
          </div>
        </Container.Header>
        <Container.Body className="flex flex-col">
          <EnvVarPreview
            key={`env-preview-${EEnvironmentScope.Workspace}`}
            scope={EEnvironmentScope.Workspace}
            activeEnvId={active_tab_wrs_env}
            activeTab={activeTab}
          />
          {!!activeCollectionEnv ? (
            <EnvVarPreview
              key={`env-preview-${EEnvironmentScope.Collection}`}
              scope={EEnvironmentScope.Collection}
              activeEnvId={activeCollectionEnv}
              activeTab={activeTab}
              collectionId={tab?.request?._meta?.collection_id}
            />
          ) : (
            ''
          )}
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

export { EnvSidebar };

const EnvVarPreview: FC<IEnvVarPreview> = ({
  activeEnvId = '',
  collectionId = '',
  scope = EEnvironmentScope.Workspace,
  activeTab = '',
}) => {
  let {
    getWorkspaceEnvs,
    getCollectionEnvs,
    setWorkspaceEnvVariable,
    setCollectionEnvVariable,
    setWorkspaceActiveEnv,
    setCollectionActiveEnv,
  } = useEnvStore(
    (s) => ({
      getWorkspaceEnvs: s.getWorkspaceEnvs,
      getCollectionEnvs: s.getCollectionEnvs,
      setWorkspaceEnvVariable: s.setWorkspaceEnvVariable,
      setCollectionEnvVariable: s.setCollectionEnvVariable,
      setWorkspaceActiveEnv: s.setWorkspaceActiveEnv,
      setCollectionActiveEnv: s.setCollectionActiveEnv,
    }),
    shallow
  );

  let envs = useMemo(
    () =>
      scope == EEnvironmentScope.Workspace
        ? getWorkspaceEnvs()
        : getCollectionEnvs(collectionId),
    [activeEnvId, collectionId, activeTab]
  );

  // console.log({ activeEnvId, collectionId, activeTab, scope, envs });

  let [variables, setVariables] = useState<string>('');
  let [isVarUpdated, setIsVarUpdated] = useState(false);

  const onChangeVariable = (variables: string) => {
    setVariables(variables); // even if the payload is not a JSON, still it needs to be render in Editor
  };

  useEffect(() => {
    try {
      let envVariables = envs?.find(
        (env) => env?._meta?.id === activeEnvId
      )?.variables;

      let variablesString = JSON.stringify(envVariables || {}, null, 2);

      if (variablesString !== variables) {
        // console.log({ variablesString })
        setVariables(variablesString);
      }
    } catch (error) {
      console.log({ error });
    }
  }, [envs, activeEnvId, collectionId, activeTab]);

  useEffect(() => {
    let previousVariables =
      envs?.find((env) => env?._meta?.id === activeEnvId)?.variables || {};
    try {
      let vars = JSON.parse(variables || '{}');
      let isNotSamevariables = !equal(vars, previousVariables);

      if (isNotSamevariables !== isVarUpdated) {
        setIsVarUpdated(isNotSamevariables);
      }
    } catch (e) {
      console.log({ e });
      if (!isVarUpdated) {
        setIsVarUpdated(false);
      }
    }
  }, [variables, envs]);

  const onUndoChanges = () => {
    let envVariables = envs?.find(
      (env) => env?._meta?.id === activeEnvId
    )?.variables;
    let variablesString = JSON.stringify(envVariables || {}, null, 2);
    setVariables(variablesString);
  };

  const onUpdate = () => {
    try {
      let variablesObject = JSON.parse(variables);

      // console.log({ scope, variablesObject });

      if (scope == EEnvironmentScope.Workspace) {
        // console.log({ variables, variablesObject });

        setWorkspaceEnvVariable(activeEnvId, variablesObject);
      } else {
        setCollectionEnvVariable(collectionId, activeEnvId, variablesObject);
      }

      //todo: fetch server response here and show loader and success notification
      setIsVarUpdated(false);

      emitUpdates();
    } catch (error) {
      console.log({ error });
    }
  };

  const capitalize = (scope: string) => {
    let text =
      scope === EEnvironmentScope.Workspace ? 'Workspace' : 'Collection';
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const _setActiveEnv = (envId) => {
    if (scope === EEnvironmentScope.Workspace) {
      setWorkspaceActiveEnv(envId);
    } else {
      setCollectionActiveEnv(collectionId, envId);
    }
    emitUpdates();
  };

  const emitUpdates = () => {
    // get environment changes and emit to request tab
    platformContext.environment.getAndEmitPlatformVariables();
  };

  return (
    <div className="flex-1">
      <div className="border-b border-t border-appBorder flex">
        <TabHeader className="height-ex-small">
          <TabHeader.Left className="font-base font-bold">
            {`${capitalize(scope)} Environments`}
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
        {/* <div className="flex-1 mr-2 text-base"> {`${scope} Environments`}</div> */}
        {/* <div className="ml-auto flex-none text-base"> Dropdown </div> */}
      </div>
      <div style={{ height: 'calc(50vh - 100px)' }}>
        <MultiLineIFE
          autoFocus={true}
          language="json"
          value={variables}
          placeholder="{ variableKey: variableValue}"
          onChange={(e) => {
            onChangeVariable(e.target.value);
          }}
          onCtrlS={
            () => {}
            /* _onUpdate */
          }
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
                primary
                transparent={true}
                sm
                disabled={!isVarUpdated}
                onClick={onUndoChanges}
              />
              <Button
                text={'Update'}
                primary
                sm
                disabled={!isVarUpdated}
                onClick={onUpdate}
              />
            </TabHeader.Right>
          </TabHeader>
        ) : (
          <></>
        )}
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
