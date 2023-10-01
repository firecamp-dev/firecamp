import { useEffect, useRef } from 'react';
import { Pane, ToolBar, Empty } from '@firecamp/ui';
import { shallow } from 'zustand/shallow';
// import { RotateCw } from 'lucide-react';
import { Tree, UncontrolledTreeEnvironment } from '@firecamp/ui/src/tree';
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
              {/* <RotateCw size={14} className="mr-2 cursor-pointer" /> */}
            </div>
            {/* <div>
                <VscNewFolder size={14} className="cursor-pointer" />
              </div> */}
          </ToolBar>
        );
      }}
      bodyRenderer={({ expanded }) => {
        return <Collection />;
      }}
    />
  );
};

export default CollectionTab;

const Collection = () => {
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
        message: 'Are you sure to delete the playground?',
        labels: {
          confirm: 'Yes, delete it.',
        },
      })
      .then((s) => {
        // console.log(plgId, 'plgId...');
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

      {/* even if the collection is empty, the tree must be initialized with tdp.
        however it'll not show anything but when new items get added/created then tree will pop up the entry  */}
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
        // onSelectItems={(ids) => {}}
        getItemTitle={(item) => item.data?.name}
        viewState={{}}
        renderItemArrow={treeRenderer.renderItemArrow}
        renderItem={(props) =>
          treeRenderer.renderItem({
            ...props,
            openPlg,
            deletePlg,
          })
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
