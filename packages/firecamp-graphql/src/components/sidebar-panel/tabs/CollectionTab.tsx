import { useEffect, useRef } from 'react';
import { Pane, ToolBar, Empty } from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';
import { VscRefresh } from '@react-icons/all-files/vsc/VscRefresh';
import { Tree, UncontrolledTreeEnvironment } from '@firecamp/ui-kit/src/tree';
import treeRenderer from './collection-tree/treeItemRenderer';
import { IStore, useStore, useStoreApi } from '../../../store';

const CollectionTab = () => {
  return (
    <Pane
      expanded={true}
      bodyClassName={'!p-0'}
      headerTitleRenderer={() => {
        return <span>Playground Collection</span>;
      }}
      headerActionRenderer={() => {
        return (
          <ToolBar>
            <div className="action">
              <VscRefresh size={14} className="mr-2 cursor-pointer" />
            </div>
            {/* <div>
                <VscNewFolder size={14} className="cursor-pointer" />
              </div> */}
          </ToolBar>
        );
      }}
      bodyRenderer={({ expanded }) => {
        return <Colelction />;
      }}
    />
  );
};

export default CollectionTab;

const Colelction = () => {
  const treeRef = useRef();
  const { tdpInstance } = useStore(
    (s: IStore) => ({
      tdpInstance: s.collection.tdpInstance,
      __manualUpdates: ++s.collection.__manualUpdates,
    }),
    shallow
  );

  const {
    context,
    registerTDP,
    unRegisterTDP,
    isCollectionEmpty,
    openPlayground,
    deleteItem,
  } = useStoreApi().getState() as IStore;

  useEffect(() => {
    // console.log('rendering the collection');
    registerTDP();
    return unRegisterTDP;
  }, []);

  const openPlg = (plgId) => {
    openPlayground(plgId);
  };
  const deletePlg = (plgId: string) => {
    context.window
      .confirm({
        title: 'Are you sure to delete the playground?',
        texts: {
          btnConfirm: 'Yes, delete it.',
        },
      })
      .then((s) => {
        console.log(plgId, 'plgId...');
        deleteItem(plgId);
      });
  };

  if (!tdpInstance) return <></>;
  return (
    <>
      {isCollectionEmpty() ? (
        <div className="items-center">
          <Empty
            // icon={<VscFolder size="40" />}
            title="No saved playgrounds"
            message="This graphql request doesn't have any saved playgrounds.."
          />
        </div>
      ) : (
        <></>
      )}

      {/* even if the collection is empty, the tree must be initialised with tdp.
        however it'll not show anything but when new item'll get added/created then tree will pop up the entry  */}
      <UncontrolledTreeEnvironment
        canRename={false}
        canReorderItems={true}
        canDragAndDrop={true}
        canDropOnFolder={true}
        keyboardBindings={{
          renameItem: ['enter', 'f2'],
          abortRenameItem: ['esc'],
        }}
        dataProvider={tdpInstance}
        onStartRenamingItem={(a) => {
          // console.log(a, 'onStartRenamingItem');
        }}
        // onSelectItems={onSelectItems}
        getItemTitle={(item) => item.data?.name}
        viewState={{}}
        renderItemArrow={treeRenderer.renderItemArrow}
        renderItem={(props) =>
          treeRenderer.renderItem({ ...props, openPlg, deletePlg })
        }
      >
        <Tree
          treeId="fc-environment-tree"
          rootItem="root"
          treeLabel="GraphQL Playground Collection"
          ref={treeRef}
        />
      </UncontrolledTreeEnvironment>
    </>
  );
};
