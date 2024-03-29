import { useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { FolderPlus, RotateCw } from 'lucide-react';
import { Tree, UncontrolledTreeEnvironment } from '@firecamp/ui/src/tree';
import { Pane, ToolBar, Empty } from '@firecamp/ui';
import { IStore, useStore, useStoreApi } from '../../../../store';
import treeRenderer from './treeItemRenderer';

const CollectionPane = () => {
  const { promptCreateFolder } = useStoreApi().getState() as IStore;
  return (
    <Pane
      expanded={true}
      bodyClassName={'!p-0'}
      headerTitleRenderer={() => {
        return <span>EMITTER COLLECTION</span>;
      }}
      headerActionRenderer={() => {
        return (
          <ToolBar>
            <div className="action">
              {/* <RotateCw size={14} className="mr-2 cursor-pointer" /> */}
            </div>
            <div>
              <FolderPlus
                size={14}
                className="cursor-pointer"
                onClick={() => promptCreateFolder()}
              />
            </div>
          </ToolBar>
        );
      }}
      bodyRenderer={({ expanded }) => {
        return <Collection openCreateFolderPrompt={promptCreateFolder} />;
      }}
    />
  );
};
export default CollectionPane;

const Collection = ({ openCreateFolderPrompt }) => {
  const treeRef = useRef();
  const { context, tdpInstance } = useStore(
    (s: IStore) => ({
      context: s.context,
      tdpInstance: s.collection.tdpInstance,
      __manualUpdates: s.collection.__manualUpdates,
    }),
    shallow
  );
  const {
    openEmitterInPlayground,
    registerTDP,
    unRegisterTDP,
    deleteFolder,
    deleteItem,
    isCollectionEmpty,
  } = useStoreApi().getState() as IStore;

  // console.log(items, 'items...');

  useEffect(() => {
    registerTDP();
    return unRegisterTDP;
  }, []);

  const _deleteFolder = (id: string) => {
    context.window
      .confirm({
        message: 'Are you sure to delete the Folder?',
        labels: { confirm: 'Yes, delete it.', },
      })
      .then((yes) => {
        if (yes) deleteFolder(id);
      });
  };

  const deleteEmitter = (emtId: string) => {
    context.window
      .confirm({
        message: 'Are you sure to delete the emitter?',
        labels: { confirm: 'Yes, delete it.', },
      })
      .then((yes) => {
        if (yes) deleteItem(emtId);
      });
  };

  if (!tdpInstance) return <></>;
  const isEmpty = isCollectionEmpty();
  return (
    <>
      {isEmpty ? (
        <div className="items-center">
          <Empty
            // icon={<VscFolder size="40" />}
            title="No saved emitters"
            message="This Socket.io request does not have any saved emitters.."
          />
        </div>
      ) : (
        <></>
      )}
      <UncontrolledTreeEnvironment
        canRename={true}
        canReorderItems={true}
        canDragAndDrop={true}
        canDropOnFolder={true}
        keyboardBindings={{
          renameItem: ['enter', 'f2'],
          abortRenameItem: ['esc'],
        }}
        dataProvider={tdpInstance}
        onStartRenamingItem={(a) => {
          console.log(a, 'onStartRenamingItem');
        }}
        // onSelectItems={onSelectItems}
        getItemTitle={(item) => item.data?.name}
        viewState={{}}
        renderItemArrow={treeRenderer.renderItemArrow}
        renderItem={(props) =>
          treeRenderer.renderItem({
            ...props,
            openEmitterInPlg: openEmitterInPlayground,
            deleteFolder: _deleteFolder,
            deleteEmitter,
            createFolder: openCreateFolderPrompt,
          })
        }
      >
        <Tree
          treeId="fc-emitter-collection-tree"
          rootItem="root"
          treeLabel="SocketIO Emitter Collection"
          ref={treeRef}
        />
      </UncontrolledTreeEnvironment>
    </>
  );
};
