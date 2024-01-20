import { FC, useCallback, useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { RotateCw, Folder, BookPlus, ArrowDown } from 'lucide-react';
import {
  InteractionMode,
  Tree,
  TreeItem,
  TreeItemIndex,
  UncontrolledTreeEnvironment
} from '@firecamp/ui/src/tree';
import { ERequestTypes } from '@firecamp/types';
import { Container, ProgressBar, Pane, ToolBar, Empty, Button, ScrollArea } from '@firecamp/ui';
import { CollectionExplorerProvider } from './treeDataProvider';
import treeRenderer from './treeItemRenderer';
import { Regex } from '../../../constants';
import { useWorkspaceStore } from '../../../store/workspace';
import { useTabStore } from '../../../store/tab';
import { ETabEntityTypes } from '../../tabs/types';
import platformContext from '../../../services/platform-context';
import { useExplorerStore } from '../../../store/explorer';
import useExplorerFacade from './useExplorerFacade';

const Explorer: FC<any> = () => {
  const explorerTreeRef = useRef();
  const treeRef = useRef();
  const { createCollectionPrompt } = platformContext.platform;

  const { workspace } = useWorkspaceStore(
    (s) => ({
      workspace: s.workspace
    }),
    shallow
  );
  const {
    explorer,
    fetchExplorer,
    updateCollection,
    updateFolder,
    // moveRequest,
    // moveFolder,
    changeWorkspaceMetaOrders,
    changeCollectionChildrenPosition,
    changeFolderChildrenPosition
    // deleteCollection,
    // deleteFolder,
    // deleteRequest,
  } = useExplorerFacade();

  const {
    // explorer: { collections, folders, requests },
    registerTDP,
    unRegisterTDP
  } = useExplorerStore.getState();
  const { open: openTab } = useTabStore.getState();
  const { openImportTab } = useWorkspaceStore.getState();

  const { isProgressing, collections, folders, requests } = explorer;

  // console.log(explorer, "explorer")

  // console.log(folders, "folders....")
  const dataProvider = useRef(
    new CollectionExplorerProvider(collections, folders, requests, workspace.__meta?.cOrders || [])
  );

  /** if mouse down then do not open the request in tab. example dragging item should not fire onSelect */
  const isMouseDown = useRef(false);
  //effect: register and unregister treeDataProvider instance
  useEffect(() => {
    document.body.onmousedown = () => (isMouseDown.current = true);
    document.body.onmouseup = () => (isMouseDown.current = false);
    registerTDP(dataProvider.current);
    return unRegisterTDP;
  }, []);

  const _onRenameItem = async (treeItem: TreeItem, name: string) => {
    let { data: item } = treeItem;
    const isNotValid = !Regex.CollectionName.test(name);
    if (!name || isNotValid) {
      //TODO: undo renaming using treeRef
      return false;
    }

    // console.log(item, 'request item...');
    let res: any;
    try {
      if (item.__ref.isCollection) res = updateCollection(item.__ref.id, { name });
      if (item.__ref.isFolder) res = updateFolder(item.__ref.id, { name });
      if (item.__ref.isRequest) {
        res = await platformContext.request.save(
          {
            __meta: {
              name,
              type: item.__meta.type
            },
            __ref: {
              id: item.__ref.id,
              collectionId: item.__ref.collectionId,
              folderId: item.__ref.folderId
            },
            __changes: { __meta: ['name'] }
          },
          ''
        );
      }
    } catch (e) {
      //TODO: undo renaming using treeRef
    } finally {
      return res;
    }
  };

  const _openReqInTab = (request: any) => {
    console.log(`node`, request);
    const entity = {
      url: request.url,
      method: request.method,
      __meta: request.__meta,
      __ref: request.__ref
    };
    // console.log({ entityId: request.__ref?.id, entityType: 'request' });
    openTab(entity, { id: request.__ref?.id, type: ETabEntityTypes.Request });
  };

  const _onNodeSelect = (nodeIndexes: TreeItemIndex[]) => {
    // console.log({ nodeIndexes });
    // return
    setTimeout(() => {
      // if item is being dragging then do not open it in new tab
      if (isMouseDown.current) return;
      let nodeIndex = nodeIndexes[0];
      let nodeItem = [...collections, ...folders, ...requests].find((c) => c.__ref.id == nodeIndex);
      // console.log({ nodeItem });
      if (
        nodeItem &&
        [
          ERequestTypes.Rest,
          ERequestTypes.GraphQL,
          ERequestTypes.SocketIO,
          ERequestTypes.WebSocket
        ].includes(nodeItem.__meta.type)
      ) {
        // console.log({ nodeItem });
        _openReqInTab(nodeItem);
      }
    }, 10);
  };

  const shouldIDropTheCollection = useCallback(
    (item: any, target: any): boolean => {
      const { childIndex, targetType, depth, parentItem } = target;
      const index = workspace.__meta.cOrders.indexOf(item.__ref.id);
      console.log(workspace.__meta.cOrders, item.__ref, target, childIndex, index);
      // if (index == dropIndex) return false;
      /** collection can only reorder at depth 0 */
      if (targetType == 'between-items' && depth == 0 && parentItem == 'root') return true;
      else return false;
    },
    [workspace.__meta.cOrders, collections]
  );

  const shouldIDropTheFolder = useCallback(
    (item: any, target: any): boolean => {
      const { targetType, depth, parentItem } = target;
      /** folder can be dropped on collection */
      if (targetType == 'item' && depth == 0 && parentItem == 'root') return true;

      const parentCollection = collections.find((i) => i.__ref.id == parentItem);
      const parentFolder = folders.find((i) => i.__ref.id == parentItem);

      /**folders can be drop on collection/folder or reorder within the same depth/level */
      if (parentCollection || parentFolder) return true;
      return false;
    },
    [collections, folders]
  );

  const shouldIDropTheRequest = useCallback(
    (target: any): boolean => {
      const { targetType, depth, parentItem } = target;
      /** request can be dropped on collection */
      if (targetType == 'item' && depth == 0 && parentItem == 'root') return true;

      const parentCollection = collections.find((i) => i.__ref.id == parentItem);
      const parentFolder = folders.find((i) => i.__ref.id == parentItem);

      /** request can be drop on collection and folder or reorder within the same depth/level */
      if (parentCollection || parentFolder) return true;

      return false;
    },
    [collections, folders]
  );

  const canDropAt = useCallback(
    (item, target) => {
      const itemPayload = item.data;
      const isItemCollection = itemPayload.__ref.isCollection;
      const isItemFolder = itemPayload.__ref.isFolder;
      const isItemRequest = itemPayload.__ref.isRequest;

      // console.clear();

      if (isItemCollection) return shouldIDropTheCollection(itemPayload, target);
      if (isItemFolder) return shouldIDropTheFolder(itemPayload, target);
      if (isItemRequest) return shouldIDropTheRequest(target);
      return false;
    },
    [collections, folders]
  );

  const reorderCollections = useCallback(
    (childIndex: number, collection: any) => {
      const index = workspace.__meta.cOrders.indexOf(collection.__ref.id);
      if (index < 0) return;
      // if item moving-down then minus one index because itself will removed from current index and subsequent items will go upward
      const dropIndex = childIndex > index ? childIndex - 1 : childIndex;
      if (dropIndex == index) return;
      changeWorkspaceMetaOrders(collection.__ref.id, dropIndex);
    },
    [workspace.__meta.cOrders]
  );

  const reorderWithinCollection = useCallback(
    (childIndex: number, item: any) => {
      const itemType = item.__ref.isRequest ? 'request' : 'folder';
      const collection = collections.find((c) => c.__ref.id == item.__ref.collectionId);
      if (!collection) return;
      const index = collection.__meta[itemType == 'request' ? 'rOrders' : 'fOrders'].indexOf(
        item.__ref.id
      );
      if (index < 0) return;

      // if item moving-down then minus one index because itself will removed from current index and subsequent items will go upward
      const dropIndex = childIndex > index ? childIndex - 1 : childIndex;
      if (dropIndex == index) return;
      changeCollectionChildrenPosition(item.__ref.collectionId, item.__ref.id, dropIndex, itemType);
    },
    [collections]
  );

  const reorderWithinFolder = useCallback(
    (childIndex: number, item: any) => {
      const itemType = item.__ref.isRequest ? 'request' : 'folder';
      const folder = folders.find((c) => c.__ref.id == item.__ref.folderId);
      if (!folder) return;
      const index = folder.__meta[itemType == 'request' ? 'rOrders' : 'fOrders'].indexOf(
        item.__ref.id
      );
      if (index < 0) return;

      // if item moving-down then minus one index because itself will removed from current index and subsequent items will go upward
      const dropIndex = childIndex > index ? childIndex - 1 : childIndex;
      if (dropIndex == index) return;

      changeFolderChildrenPosition(item.__ref.folderId, item.__ref.id, dropIndex, itemType);
    },
    [folders]
  );

  const itemDropOnCollectionOrFolder = useCallback(
    (targetItem: string, itemType: 'request' | 'folder', item: any) => {
      console.log('itemDropOnCollectionOrFolder');
      if (!targetItem) return;
      const moveTo: { collectionId: string; folderId?: string } = {
        collectionId: ''
      };

      const _targetCol = collections.find((i) => i.__ref.id == targetItem);
      if (_targetCol) {
        console.log('item drop on collection');
        moveTo.collectionId = _targetCol.__ref.id;
      } else {
        console.log('item drop on folder');
        const _targetFolder = folders.find((i) => i.__ref.id == targetItem);
        if (_targetFolder) {
          moveTo.collectionId = _targetFolder.__ref.collectionId;
          moveTo.folderId = _targetFolder.__ref.id;
        }
      }
      _moveItem(item, moveTo, itemType);
    },
    [collections, folders]
  );

  const _moveItem = (item, moveTo, itemType: 'request' | 'folder') => {
    if (itemType == 'folder') {
      // moveFolder(item.__ref.id, moveTo);
      console.log('moving the folder');
    } else if (itemType == 'request') {
      // moveRequest(item.__ref.id, moveTo);
      console.log('moving the request');
    } else {
    }
  };

  const onDrop = (items, target) => {
    console.log(items, target, 'onDrop');
    const item = items[0].data;
    const { childIndex = 0, depth, parentItem, targetItem } = target;

    const isItemCollection = item.__ref.isCollection;
    // const isItemFolder = item.__ref.isFolder;
    const isItemRequest = item.__ref.isRequest;

    /**
     * item is reordering within same parent
     * item is being reordered in collection or in folder or moving across folder but within collection
     * 1. collection is being reordered at root
     * 2. no target means item is not being dropped onto folder
     *    1.1 either it is being reordering within collection
     *    1.2 either it is being reordering within folder
     *    1.3 either it is being moved to folder but dropped in-between items
     */
    if (!targetItem) {
      if (isItemCollection) {
        // console.log("The collection reorders", childIndex, depth, parentItem);
        reorderCollections(childIndex, item);
        return;
      }
      // else if
      const moveToParent =
        collections.find((i) => i.__ref.id == parentItem) ||
        folders.find((i) => i.__ref.id == parentItem);
      const isParentFolder = !!moveToParent.__ref.collectionId;
      if (isParentFolder) {
        if (item.__ref.folderId == moveToParent.__ref.id) {
          // reorder within folders
          console.log('reorder within folders');
          reorderWithinFolder(childIndex, item);
        } else {
          // TODO: move item to folder within collection
          console.log('move item to folder within collection', childIndex, explorerTreeRef);
          itemDropOnCollectionOrFolder(
            moveToParent.__ref.id,
            isItemRequest ? 'request' : 'folder',
            item
          );
        }
      } else {
        if (item.__ref.folderId) {
          // TODO: moving item to collection root
          console.log('move item to collection root', childIndex, explorerTreeRef);
          itemDropOnCollectionOrFolder(
            item.__ref.collectionId,
            isItemRequest ? 'request' : 'folder',
            item
          );
        } else {
          // reorder within collection
          console.log('reorder within collection');
          reorderWithinCollection(childIndex, item);
        }
      }
    } else {
      /**
       * if targetItem exists then item is being moved/dropped to collection/folder
       * item is being dropped on item, here it'll be dropped on folder or collection
       */
      itemDropOnCollectionOrFolder(targetItem, isItemRequest ? 'request' : 'folder', item);
    }
  };

  return (
    <div className="w-full h-full flex flex-row explorer-wrapper">
      <Container>
        <ProgressBarContainer />
        <Pane
          expanded={true}
          bodyClassName={'!p-0'}
          headerTitleRenderer={() => {
            return <span className="font-bold">COLLECTIONS EXPLORER</span>;
          }}
          headerActionRenderer={() => {
            return (
              <ToolBar>
                <div>
                  <RotateCw
                    strokeWidth={1.5}
                    className="cursor-pointer"
                    size={16}
                    onClick={() => {
                      fetchExplorer(workspace.__ref.id);
                    }}
                    aria-label="Refresh Collections"
                  >
                    <title>Refresh Collections</title>
                  </RotateCw>
                </div>
                <div>
                  <BookPlus
                    strokeWidth={1.5}
                    className="cursor-pointer"
                    size={16}
                    onClick={createCollectionPrompt}
                    aria-label="Create a new Collection"
                  >
                    <title>Create a new collection</title>
                  </BookPlus>
                </div>
                <div>
                  <ArrowDown
                    strokeWidth={1.5}
                    className="cursor-pointer"
                    size={16}
                    onClick={openImportTab}
                    aria-label="Import API Collection"
                  >
                    <title>Import API Collection</title>
                  </ArrowDown>
                </div>
              </ToolBar>
            );
          }}
          bodyRenderer={({ expanded }) => {
            if (!isProgressing && !collections?.length) {
              return (
                <div className="items-center">
                  <Empty
                    icon={<Folder strokeWidth={1.5} size={40} />}
                    title="Create a new Collection"
                    message="This workspace doesn't have any collections, you can create the first collection."
                  />
                  <Button
                    text="Create Collection"
                    classNames={{ root: 'mx-auto mb-6' }}
                    onClick={createCollectionPrompt}
                    primary
                    xs
                  />
                </div>
              );
            }

            return (
              <>
                <ScrollArea>
                  <UncontrolledTreeEnvironment
                    ref={explorerTreeRef}
                    keyboardBindings={{
                      // primaryAction: ['f3'],
                      renameItem: ['enter', 'f2'],
                      abortRenameItem: ['esc']
                    }}
                    dataProvider={dataProvider.current}
                    // defaultInteractionMode={{
                    //   mode: 'custom',
                    //   extends: InteractionMode.ClickArrowToExpand,
                    //   createInteractiveElementProps: (
                    //     item,
                    //     treeId,
                    //     actions,
                    //     renderFlags
                    //   ) => ({
                    //     /**
                    //      * 1. avoid multi select
                    //      * 2. (will not work as isFocused is always true, ignore for now) focus on first click and select item if it's focused (second click)
                    //      * 3. if has children then toggle expand/collapse
                    //      */
                    //     onClick: (e) => {
                    //       //avoid multi select
                    //       // console.log(item, actions, renderFlags);
                    //       if (item.isFolder) actions.toggleExpandedState();
                    //       if (!renderFlags.isFocused) actions.focusItem();
                    //       else actions.selectItem();
                    //     },
                    //     onFocus: (e) => {
                    //       actions.focusItem();
                    //     },
                    //   }),
                    // }}
                    getItemTitle={(item) => item.data?.name}
                    viewState={{}}
                    renderItemArrow={treeRenderer.renderItemArrow}
                    // renderItemTitle={treeRenderer.renderItemTitle}
                    renderItem={(props) => treeRenderer.renderItem({ ...props, treeRef })}
                    // renderTreeContainer={({ children, containerProps }) => <div {...containerProps}>{children}</div>}
                    // renderItemsContainer={({ children, containerProps }) => <ul {...containerProps}>{children}</ul>}
                    canRename
                    canReorderItems
                    canDragAndDrop
                    canDropOnFolder
                    canDropOnNonFolder
                    canDrag={(items) => {
                      return true;
                    }}
                    canDropAt={(items, target) => canDropAt(items[0], target)}
                    onStartRenamingItem={(a) => {
                      console.log(a, 'onStartRenamingItem');
                    }}
                    onRenameItem={_onRenameItem}
                    // onPrimaryAction={console.log}
                    onSelectItems={_onNodeSelect}
                    onRegisterTree={(...a) => console.log(a, 'on register tree')}
                    onDrop={onDrop}
                    onMissingItems={(itemIds) => {
                      // console.log(itemIds, "onMissingItems")
                    }}
                    onMissingChildren={(itemIds) => {
                      // console.log(itemIds, "onMissingChildren")
                    }}
                  >
                    <Tree
                      treeId="collections-explorer"
                      rootItem="root"
                      treeLabel="Collections Explorer"
                      ref={treeRef}
                    />
                  </UncontrolledTreeEnvironment>
                </ScrollArea>
              </>
            );
          }}
        />
      </Container>
    </div>
  );
};

export default Explorer;

const ProgressBarContainer = () => {
  const { isProgressing } = useExplorerStore((s) => ({
    isProgressing: s.explorer.isProgressing
  }));
  return <ProgressBar active={isProgressing} />;
};
