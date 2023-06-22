import { FC, useEffect, useRef } from 'react';
import shallow from 'zustand/shallow';
import { VscAdd } from '@react-icons/all-files/vsc/VscAdd';
import { Tree, UncontrolledTreeEnvironment } from '@firecamp/ui/src/tree';
import { Notes, Button } from '@firecamp/ui';
import { EEnvironmentScope } from '@firecamp/types';
import { Container, ProgressBar, Pane, ToolBar } from '@firecamp/ui';
import treeRenderer from './tree/itemRenderer';
import treeRenderer_ from './tree_/itemRenderer';
import platformContext from '../../../../services/platform-context';
import { IEnvironmentStore, useEnvStore } from '../../../../store/environment';
import { VscJson } from '@react-icons/all-files/vsc/VscJson';
import { ETabEntityTypes } from '../../../tabs/types';
import { useTabStore } from '../../../../store/tab';

const EnvironmentSidebar: FC<any> = () => {
  const { envs } = useEnvStore.getState();
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
  const { isProgressing } = useEnvStore(
    (s) => ({
      isProgressing: s.isProgressing,
    }),
    shallow
  );
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
  const { createEnvironmentPrompt } = platformContext.platform;
  useEffect(() => {
    registerTDP();
    return () => unRegisterTDP();
  }, []);
  const openEnv = (env) => {
    openTab(env, { id: env.__ref.id, type: ETabEntityTypes.Environment });
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
            <div>
              <VscAdd
                className="cursor-pointer"
                size={16}
                onClick={() => createEnvironmentPrompt()}
              />
            </div>
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
    platformContext.app.modals.openCloneEnvironment({
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
              type="danger"
              description="
              The collection scoped environments are deprecated now, you can clone them
              from here to create a new environment for your own use."
            />
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
    <div className="rct-tree-item-li focus:rct-tree-item-li-focused border-b border-app-border">
      <div className="px-2 mt-5 mb-1 rct-tree-item-title-container focus:rct-tree-item-title-container-focused hover:rct-tree-item-title-container-focused !opacity-100 cursor-pointer">
        <VscJson className="flex-none" size={18} opacity={1} />
        <span className="w-full overflow-hidden text-ellipsis items-center block pl-1 text-base">
          {globalEnv?.name}
        </span>
        <div className="flex ml-auto rct-tree-item-li-action items-center">
          <Button
            text={'Open'}
            className="hover:!bg-focus2 ml-1 !text-app-foreground-inactive !py-0"
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
