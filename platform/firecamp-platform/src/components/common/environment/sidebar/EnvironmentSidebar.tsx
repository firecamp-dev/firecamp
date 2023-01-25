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
import treeRenderer from './tree/itemRenderer';
import treeRenderer_ from './tree_/itemRenderer';
import platformContext from '../../../../services/platform-context';
import { useWorkspaceStore } from '../../../../store/workspace';
import { IEnvironmentStore, useEnvStore } from '../../../../store/environment';

const EnvironmentSidebar: FC<any> = () => {
  const treeRef = useRef();
  const {
    explorer: { collections },
  } = useWorkspaceStore((s) => ({ explorer: s.explorer }), shallow);
  const { envs } = useEnvStore.getState();
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

  return (
    <div className="w-full h-full flex flex-row explorer-wrapper">
      <Container>
        <ProgressBarContainer />
        <EnvironmentCollection />
        {envs?.length ? <CollectionScopedEnvCollection /> : <></>}
      </Container>
    </div>
  );
};

export default EnvironmentSidebar;

const ProgressBarContainer = () => {
  let { isProgressing } = useWorkspaceStore((s) => ({
    isProgressing: s.explorer.isProgressing,
  }));

  return <ProgressBar active={isProgressing} />;
};

const EnvironmentCollection = () => {
  const treeRef = useRef();
  const { envTdpInstance, registerTDP, unRegisterTDP } = useEnvStore(
    (s: IEnvironmentStore) => ({
      envTdpInstance: s.envTdpInstance,
      registerTDP: s.registerTDP_,
      unRegisterTDP: s.unRegisterTDP_,
    })
  );
  useEffect(() => {
    registerTDP();
    return () => unRegisterTDP();
  }, []);
  const openColEnv = () => {};
  const openCreateColEnv = () => {};
  const deleteEnv = () => {};

  if (!envTdpInstance) return <></>;
  return (
    <Pane
      expanded={true}
      bodyClassName={'!p-0'}
      headerTitleRenderer={() => {
        return <span className="font-bold">ENVIRONMENTS</span>;
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
            dataProvider={envTdpInstance}
            getItemTitle={(item) => item.data?.name}
            viewState={{}}
            renderItemArrow={treeRenderer_.renderItemArrow}
            // renderItemTitle={treeRenderer_.renderItemTitle}
            renderItem={(props) =>
              treeRenderer_.renderItem({
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
    />
  );
};

const CollectionScopedEnvCollection = () => {
  const treeRef = useRef();
  const { envTdpInstance, registerTDP, unRegisterTDP, deleteEnvironment } =
    useEnvStore((s: IEnvironmentStore) => ({
      envTdpInstance: s.colEnvTdpInstance,
      registerTDP: s.registerTDP,
      unRegisterTDP: s.unRegisterTDP,
      deleteEnvironment: s.deleteEnvironment,
    }));
  useEffect(() => {
    registerTDP();
    return () => unRegisterTDP();
  }, []);

  const openColEnv = (colId: string, envId: string) => {
    platformContext.app.modals.openManageEnvironemnt({
      scope: EEnvironmentScope.Collection,
      collectionId: colId,
      envId,
    });
  };

  const openCreateColEnv = () => {};

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

  if (!envTdpInstance) return <></>;
  return (
    <Pane
      expanded={false}
      bodyClassName={'!p-0'}
      headerTitleRenderer={() => {
        return <span className="font-bold">COLLECTION ENVIRONMENTS</span>;
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
          <>
            <span>
              The collection scoped environments are deprecated, you can see the
              collection environments here and create a new environment from it.
            </span>
            <UncontrolledTreeEnvironment
              dataProvider={envTdpInstance}
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
          </>
        );
      }}
    />
  );
};
