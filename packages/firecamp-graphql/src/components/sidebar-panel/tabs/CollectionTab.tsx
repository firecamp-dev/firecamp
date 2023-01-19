import { useEffect, useRef } from 'react';
import { Pane, ToolBar, Empty } from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';
import { VscRefresh } from '@react-icons/all-files/vsc/VscRefresh';
import { Tree, UncontrolledTreeEnvironment } from '@firecamp/ui-kit/src/tree';
import treeRenderer from './collection-tree/treeItemRenderer';
import { IStore, useStore, useStoreApi } from '../../../store';

const CollectionTab = () => {
  const { isCollectionEmpty } = useStore(
    (s: IStore) => ({
      isCollectionEmpty:
        !s.collection.folders?.length && !s.collection.items?.length,
    }),
    shallow
  );
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
        if (isCollectionEmpty) {
          return (
            <div className="items-center">
              <Empty
                // icon={<VscFolder size="40" />}
                title="No saved playgrounds"
                message="This graphql request doesn't have any saved playgrounds.."
              />
            </div>
          );
        }
        return <PlgColelction />;
      }}
    />
  );
};

export default CollectionTab;

const PlgColelction = () => {
  const treeRef = useRef();
  const { tdpInstance } = useStore(
    (s: IStore) => ({
      tdpInstance: s.collection.tdpInstance,
    }),
    shallow
  );
  const { context, registerTDP, unRegisterTDP, openPlayground, deleteItem } =
    useStoreApi().getState() as IStore;

  useEffect(() => {
    registerTDP();
    // console.log('rendering the collection');
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
  );
};
