import { FC, useEffect, useRef } from 'react';
import shallow from 'zustand/shallow';

import { Tree, UncontrolledTreeEnvironment } from '@firecamp/ui-kit/src/tree';
import { EEnvironmentScope } from '@firecamp/types';
import {
  Container,
  ProgressBar,
  TabHeader,
  Pane,
  ToolBar,
} from '@firecamp/ui-kit';

import { useWorkspaceStore } from '../../../store/workspace';
import treeRenderer from './treeItemRenderer';
import {
  WrsEnvDataProvider,
  CollectionEnvDataProvider,
} from './treeDataProvider';
import { useEnvStore } from '../../../store/environment';
import platformContext from '../../../services/platform-context';

const Environment: FC<any> = () => {
  const treeRef = useRef();
  const {
    workspace,
    explorer: { collections },
  } = useWorkspaceStore(
    (s) => ({ workspace: s.workspace, explorer: s.explorer }),
    shallow
  );
  const { envs, deleteEnvironment, registerTDP, unRegisterTDP } = useEnvStore(
    (s) => ({
      envs: s.envs,
      deleteEnvironment: s.deleteEnvironment,
      registerTDP: s.registerTDP,
      unRegisterTDP: s.unRegisterTDP,
    }),
    shallow
  );

  const wrsEnvDataProvider = useRef(new WrsEnvDataProvider(workspace));
  const colEnvDataProvider = useRef(new CollectionEnvDataProvider(collections));

  //effect: register and unregister col/wrs env's treeDataProvider instance
  useEffect(() => {
    registerTDP(wrsEnvDataProvider.current, colEnvDataProvider.current);
    return unRegisterTDP;
  }, []);

  const openCreateWrsEnv = (wrsId: string) => {
    platformContext.app.modals.openCreateEnvironment({
      scope: EEnvironmentScope.Workspace,
    });
  };

  const openWrsEnv = (wrsId: string, envId: string) => {
    platformContext.app.modals.openManageEnvironemnt({
      scope: EEnvironmentScope.Workspace,
      workspaceId: wrsId,
      envId,
    });
  };

  const openCreateColEnv = (colId: string) => {
    platformContext.app.modals.openCreateEnvironment({
      scope: EEnvironmentScope.Collection,
      collectionId: colId,
    });
  };

  const openColEnv = (colId: string, envId: string) => {
    platformContext.app.modals.openManageEnvironemnt({
      scope: EEnvironmentScope.Collection,
      collectionId: colId,
      envId,
    });
  };

  const deleteEnv = (envId: string) => {
    platformContext.window
      .confirm({
        title: 'Are you sure to delete the environment?',
        texts: {
          btnConfirm: 'Yes, delete it.',
        },
      })
      .then(() => {
        deleteEnvironment(envId)
          .then((r) => {
            return r;
          })
          .catch((e) => {
            platformContext.app.notify.alert(
              e.response?.data?.message || e.message
            );
          });
      });
  };

  return (
    <div className="w-full h-full flex flex-row explorer-wrapper">
      <Container>
        <ProgressBarContainer />
        {/* <Pane
          expanded={true}
          height="200px"
          bodyClassName={'!p-0'}
          headerTitleRenderer={() => {
            return <span>Scope: Workspace</span>;
          }}
          headerActionRenderer={() => {
            return (
              <ToolBar>
                
              </ToolBar>
            );
          }}
          bodyRenderer={({ expanded }) => {
            return (
              <UncontrolledTreeEnvironment
                dataProvider={wrsEnvDataProvider.current}
                getItemTitle={(item) => item.data?.name}
                viewState={{}}
                renderItemArrow={treeRenderer.renderItemArrow}
                // renderItemTitle={treeRenderer.renderItemTitle}
                renderItem={(props) =>
                  treeRenderer.renderItem({
                    ...props,
                    openEnv: openWrsEnv,
                    openCreateEnv: openCreateWrsEnv,
                    deleteEnv,
                  })
                }
              >
                <Tree
                  treeId="tree-1"
                  rootItem="root"
                  treeLabel="Tree Example"
                />
              </UncontrolledTreeEnvironment>
            );
          }}
        ></Pane> */}

        <Pane
          expanded={true}
          bodyClassName={'!p-0'}
          headerTitleRenderer={() => {
            return <span>Scope: Collection</span>;
          }}
          headerActionRenderer={() => {
            return (
              <ToolBar>
                {/* <div>
                  <VscRefresh className="cursor-pointer" size={16} onClick={()=> {}}/>
                </div>
                <div>
                  <VscNewFolder className="cursor-pointer" size={16} onClick={()=>{}}/>
                </div> */}
              </ToolBar>
            );
          }}
          bodyRenderer={({ expanded }) => {
            return (
              <UncontrolledTreeEnvironment
                dataProvider={colEnvDataProvider.current}
                getItemTitle={(item) => item.data?.name}
                viewState={{}}
                renderItemArrow={treeRenderer.renderItemArrow}
                // renderItemTitle={treeRenderer.renderItemTitle}
                renderItem={(props) =>
                  treeRenderer.renderItem({
                    ...props,
                    openEnv: openColEnv,
                    openCreateEnv: openCreateColEnv,
                    deleteEnv,
                  })
                }
              >
                <Tree
                  treeId="tree-1"
                  rootItem="root"
                  treeLabel="Tree Example"
                  ref={treeRef}
                />
              </UncontrolledTreeEnvironment>
            );
          }}
        ></Pane>
      </Container>
    </div>
  );
};

export default Environment;

const ProgressBarContainer = () => {
  let { isProgressing } = useWorkspaceStore((s) => ({
    isProgressing: s.explorer.isProgressing,
  }));

  return <ProgressBar active={isProgressing} />;
};
