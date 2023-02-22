import { FC, useEffect, useRef } from 'react';
import shallow from 'zustand/shallow';
import { Tree, UncontrolledTreeEnvironment } from '@firecamp/ui-kit/src/tree';
import { Notes, Button } from '@firecamp/ui-kit';
import { EEnvironmentScope } from '@firecamp/types';
import {
  Container,
  ProgressBar,
  Pane,
  ToolBar,
} from '@firecamp/ui-kit';
import treeRenderer from './tree/itemRenderer';
import treeRenderer_ from './tree_/itemRenderer';
import platformContext from '../../../../services/platform-context';
import { useWorkspaceStore } from '../../../../store/workspace';
import { IEnvironmentStore, useEnvStore } from '../../../../store/environment';
import { VscJson } from '@react-icons/all-files/vsc/VscJson';
import { ETabEntityTypes } from '../../../tabs/types';
import { useTabStore } from '../../../../store/tab';

const EnvironmentSidebar: FC<any> = () => {

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
  const { open: openTab } = useTabStore.getState();
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
  const openEnv = (env) => {
    openTab(
      env,
      { id: env.__ref.id, type: ETabEntityTypes.Environment }
    );
  };
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
          <div>
            <Globals />
            <UncontrolledTreeEnvironment
              dataProvider={envTdpInstance}
              getItemTitle={(item) => item.data?.name}
              viewState={{}}
              renderItemArrow={treeRenderer_.renderItemArrow}
              // renderItemTitle={treeRenderer_.renderItemTitle}
              renderItem={(props) =>
                treeRenderer_.renderItem({
                  ...props,
                  openEnv: openEnv,
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
          </div>
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
            <Notes
              description="
              The collection scoped environments are deprecated, you can see the
              collection environments here and create a new environment from it."
            />
            <div className="text-sm !m-2 p-2 bg-focus1 !text-appForegroundInActive">
              The collection scoped environments are deprecated, you can see the
              collection environments here and create a new environment from it.
            </div>
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

const Globals = () => {
  const globalEnv = useEnvStore((s) => s.globalEnv, shallow);
  const { open: openTab } = useTabStore.getState();
  const openEnv = (env) => {
    openTab(
      { ...env },
      { id: env.__ref.id, type: ETabEntityTypes.Environment }
    );
  };
  return (
    <div className="rct-tree-item-li focus:rct-tree-item-li-focused border-b border-appBorder">
      <div className="px-2 mt-5 mb-1 rct-tree-item-title-container focus:rct-tree-item-title-container-focused hover:rct-tree-item-title-container-focused !opacity-100 cursor-pointer">
        <VscJson className="flex-none" size={18} opacity={1} />
        <span className="w-full overflow-hidden overflow-ellipsis items-center block pl-1 text-base">
          {globalEnv?.name}
        </span>
        <div className="flex ml-auto rct-tree-item-li-action items-center">
          <Button
            text={'Open'}
            className="hover:!bg-focus2 ml-1 !text-appForegroundInActive !py-0"
            onClick={() => openEnv(globalEnv)}
            transparent
            secondary
            ghost
            sm
          />
        </div>
      </div>
    </div>
  );
};
