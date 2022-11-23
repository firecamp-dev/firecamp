import { useRef } from 'react';
import { Pane, ToolBar, Empty } from '@firecamp/ui-kit';
import shallow from 'zustand/shallow';
// import { VscNewFolder } from '@react-icons/all-files/vsc/VscNewFolder';
import { VscRefresh } from '@react-icons/all-files/vsc/VscRefresh';
import { Tree, UncontrolledTreeEnvironment } from '@firecamp/ui-kit/src/tree';

import treeRenderer from './collection-tree/treeItemRenderer';
import { CollectionTreeDataProvider } from './collection-tree/CollectionDataProvider';
import {
  IWebsocketStore,
  useWebsocketStore,
  useWebsocketStoreApi,
} from '../../../store';

const CollectionTab = () => {
  let treeRef = useRef();

  const { folders = [], items = [] } = useWebsocketStore(
    (s: IWebsocketStore) => ({
      folders: s.collection.folders,
      items: s.collection.items,
    }),
    shallow
  );
  let {
    context,
    // registerTDP,
    // unRegisterTDP,
    openPlayground,
    deleteItem,
  } = useWebsocketStoreApi().getState() as IWebsocketStore;

  // console.log(items, 'items...');

  const dataProvider = useRef(new CollectionTreeDataProvider(folders, items));

  // useEffect(() => {
  //   registerTDP(dataProvider.current);
  //   return unRegisterTDP;
  // }, []);

  const openPlg = (plgId) => {
    // get a fresh copy of state
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
        return <span>Message Collection</span>;
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
                title="No saved messages"
                message="This WebSocket request does not have any saved messages.."
              />
            </div>
          );
        }

        return (
          <UncontrolledTreeEnvironment
            canRename={true}
            canReorderItems={true}
            canDragAndDrop={true}
            canDropOnItemWithChildren={true}
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
              treeLabel="WebSocket Message Collection"
              ref={treeRef}
            />
          </UncontrolledTreeEnvironment>
        );
      }}
    />
  );
};

export default CollectionTab;
