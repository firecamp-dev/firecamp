import { useEffect, useRef } from 'react';
import shallow from 'zustand/shallow';
import { VscNewFolder } from '@react-icons/all-files/vsc/VscNewFolder';
import { VscRefresh } from '@react-icons/all-files/vsc/VscRefresh';
import { Tree, UncontrolledTreeEnvironment } from '@firecamp/ui-kit/src/tree';
import { Pane, ToolBar, Empty } from '@firecamp/ui-kit';
import { TId } from '@firecamp/types';
import treeRenderer from './collection-tree/treeItemRenderer';
import { useStore, useStoreApi, IStore } from '../../../store';

const CollectionTab = () => {
  const {
    context,
    isRequestSaved,
    prepareCreateFolderPayload,
    onCreateFolder,
  } = useStore(
    (s: IStore) => ({
      isRequestSaved: s.runtime.isRequestSaved,
      context: s.context,
      prepareCreateFolderPayload: s.prepareCreateFolderPayload,
      onCreateFolder: s.onCreateFolder,
    }),
    shallow
  );

  const _createFolderPrompt = async (parentFolderId?: TId) => {
    if (typeof parentFolderId != 'string') parentFolderId = undefined;
    if (!isRequestSaved) {
      return context.app.notify.info(
        'Please save the websocket request first.'
      );
    }
    const _folder = prepareCreateFolderPayload('', parentFolderId);
    context.request.createRequestFolderPrompt(_folder).then(onCreateFolder);
  };

  return (
    <Pane
      expanded={true}
      bodyClassName={'!p-0'}
      headerTitleRenderer={() => {
        return <span>Message Collection</span>;
      }}
      headerActionRenderer={() => {
        return (
          <ToolBar>
            <div className="action">
              <VscRefresh size={14} className="cursor-pointer" />
            </div>
            <div>
              <VscNewFolder
                size={14}
                className="cursor-pointer"
                onClick={() => _createFolderPrompt()}
              />
            </div>
          </ToolBar>
        );
      }}
      bodyRenderer={({ expanded }) => {
        return <Collection openCreateFolderPrompt={_createFolderPrompt} />;
      }}
    />
  );
};
export default CollectionTab;

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
    // openPlayground,
    registerTDP,
    unRegisterTDP,
    deleteItem,
    isCollectionEmpty,
  } = useStoreApi().getState() as IStore;

  useEffect(() => {
    registerTDP();
    return unRegisterTDP;
  }, []);

  const openPlg = (plgId) => {
    // get a fresh copy of state
    // const item = items.find((i) => i.__ref.id == plgId);
    // console.log(item, 1100099);
    // openPlayground(plgId);
  };
  const deletePlg = (plgId: string) => {
    context.window
      .confirm({
        title: 'Are you sure to delete the playground?',
        texts: {
          btnConfirm: 'Yes, delete it.',
        },
      })
      .then((isConfirmed) => {
        if (isConfirmed) deleteItem(plgId);
      });
  };

  if (!tdpInstance) return <></>;
  return (
    <>
      {isCollectionEmpty() ? (
        <div className="items-center">
          <Empty
            title="No saved messages"
            message="This WebSocket request does not have any saved messages.."
          />
        </div>
      ) : (
        <></>
      )}

      {/* even if the collection is empty, the tree must be initialised with tdp.
        however it'll not show anything but when new item'll get added/created then tree will pop up the entry  */}
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
            openPlg,
            deletePlg,
            createFolder: openCreateFolderPrompt,
          })
        }
      >
        <Tree
          treeId="fc-environment-tree"
          rootItem="root"
          treeLabel="WebSocket Message Collection"
          ref={treeRef}
        />
      </UncontrolledTreeEnvironment>
    </>
  );
};
