import { useEffect, useRef } from 'react';
import { Pane, ToolBar, Empty,  } from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';
import { VscNewFolder } from '@react-icons/all-files/vsc/VscNewFolder';
import { VscRefresh } from '@react-icons/all-files/vsc/VscRefresh';
import { Tree, UncontrolledTreeEnvironment } from '@firecamp/ui-kit/src/tree';

import treeRenderer from './collection-tree/treeItemRenderer';
import { CollectionTreeDataProvider } from './collection-tree/CollectionDataProvider';
import {
  IGraphQLStore,
  useGraphQLStore,
  useGraphQLStoreApi,
} from '../../../store';

const CollectionTab = () => {
  const treeRef = useRef();
  const { folders, items } = useGraphQLStore(
    (s: IGraphQLStore) => ({
      folders: s.collection.folders,
      items: s.collection.items,
    }),
    shallow
  );
  const { context, registerTDP, unRegisterTDP, openPlayground, deleteItem } =
    useGraphQLStoreApi().getState() as IGraphQLStore;

  const dataProvider = useRef(new CollectionTreeDataProvider(folders, items));

  useEffect(() => {
    registerTDP(dataProvider.current);
    return unRegisterTDP;
  }, []);

  const openPlg = (plgId) => {
    // get a freh copy of state
    const item = items.find((i) => i.__ref.id == plgId);
    console.log(item, 1100099);
    openPlayground(item);
  };
  const deletePlg = (plgId: string) => {
    context.appService.notify.confirm(
      'Are you sure to delete the playground?',
      (s) => {
        console.log(plgId, 'plgId...');
        deleteItem(plgId);
      },
      console.log,
      {
        labels: {
          confirm: 'Need your confirmation.',
          confirmOk: 'Yes, delete it.',
        },
      }
    );
  };

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
        if (!folders?.length && !items?.length) {
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

        return (
          <UncontrolledTreeEnvironment
            canRename={true}
            canReorderItems={true}
            canDragAndDrop={true}
            canDropOnFolder={true}
            keyboardBindings={{
              renameItem: ['enter', 'f2'],
              abortRenameItem: ['esc'],
            }}
            dataProvider={dataProvider.current}
            onStartRenamingItem={(a) => {
              console.log(a, 'onStartRenamingItem');
            }}
            // onSelectItems={onSelectItems}
            getItemTitle={(item) => item.data.name}
            viewState={{}}
            renderItemArrow={treeRenderer.renderItemArrow}
            renderItem={(props) =>
              treeRenderer.renderItem({ ...props, openPlg, deletePlg })
            }
          >
            <Tree
              treeId="fc-environment-tree"
              rootItem="root"
              treeLabel="Firecamp Environment Management"
              ref={treeRef}
            />
          </UncontrolledTreeEnvironment>
        );
      }}
    />
  );
};

export default CollectionTab;
