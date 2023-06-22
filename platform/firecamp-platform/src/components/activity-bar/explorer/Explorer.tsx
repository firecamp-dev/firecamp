import { FC, useCallback, useEffect, useRef } from 'react';
import shallow from 'zustand/shallow';
import { VscRefresh } from '@react-icons/all-files/vsc/VscRefresh';
import { VscNewFolder } from '@react-icons/all-files/vsc/VscNewFolder';
// import { VscFileSymlinkFile } from '@react-icons/all-files/vsc/VscFileSymlinkFile';
import { VscFolder } from '@react-icons/all-files/vsc/VscFolder';
import { VscArrowDown } from '@react-icons/all-files/vsc/VscArrowDown';
import {
  InteractionMode,
  Tree,
  TreeItem,
  TreeItemIndex,
  UncontrolledTreeEnvironment,
} from '@firecamp/ui/src/tree';
import { ERequestTypes } from '@firecamp/types';
import {
  Container,
  ProgressBar,
  Pane,
  ToolBar,
  Empty,
  Button,
  ScrollBar,
} from '@firecamp/ui';
import { CollectionExplorerProvider } from './treeDataProvider';
import treeRenderer from './treeItemRenderer';
import { Regex } from '../../../constants';
import { useWorkspaceStore } from '../../../store/workspace';
import { useTabStore } from '../../../store/tab';
import { ETabEntityTypes } from '../../tabs/types';
import platformContext from '../../../services/platform-context';
import { useExplorerStore } from '../../../store/explorer';

const Explorer: FC<any> = () => {
  const explorerTreeRef = useRef();
  const treeRef = useRef();
  const { createCollectionPrompt } = platformContext.platform;

  const { workspace } = useWorkspaceStore(
    (s) => ({
      workspace: s.workspace,
    }),
    shallow
  );
  const {
    explorer,
    fetchExplorer,
    updateCollection,
    updateFolder,
    moveRequest,
    moveFolder,
    changeCollectionChildrenPosition,
    changeFolderChildrenPosition,
    deleteCollection,
    deleteFolder,
    deleteRequest,
  } = useExplorerStore(
    (s) => ({
      explorer: s.explorer,
      fetchExplorer: s.fetchExplorer,
      updateCollection: s.updateCollection,
      updateFolder: s.updateFolder,
      moveRequest: s.moveRequest,
      moveFolder: s.moveFolder,
      changeCollectionChildrenPosition: s.changeCollectionChildrenPosition,
      changeFolderChildrenPosition: s.changeFolderChildrenPosition,
      deleteCollection: s.deleteCollection,
      deleteFolder: s.deleteFolder,
      deleteRequest: s.deleteRequest,
    }),
    shallow
  );

  const { isProgressing, collections, folders, requests } = explorer;

  const {
    // explorer: { collections, folders, requests },
    registerTDP,
    unRegisterTDP,
  } = useExplorerStore.getState();
  const { open: openTab } = useTabStore.getState();
  const { openImportTab } = useWorkspaceStore.getState();

  // console.log(explorer, "explorer")

  // console.log(folders, "folders....")
  const dataProvider = useRef(
    new CollectionExplorerProvider(
      collections,
      folders,
      requests,
      workspace.__meta?.cOrders || []
    )
  );

  //effect: register and unregister treeDataProvider instance
  useEffect(() => {
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
      if (item.__ref.isCollection)
        res = updateCollection(item.__ref.id, { name });
      if (item.__ref.isFolder) res = updateFolder(item.__ref.id, { name });
      if (item.__ref.isRequest) {
        res = await platformContext.request.save(
          {
            __meta: {
              name,
              type: item.__meta.type,
            },
            __ref: {
              id: item.__ref.id,
              collectionId: item.__ref.collectionId,
              folderId: item.__ref.folderId,
            },
            __changes: { __meta: ['name'] },
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
      __ref: request.__ref,
    };
    // console.log({ entityId: request.__ref?.id, entityType: 'request' });
    openTab(entity, { id: request.__ref?.id, type: ETabEntityTypes.Request });
  };

  const _onNodeSelect = (nodeIndexes: TreeItemIndex[]) => {
    // console.log({ nodeIndexes });
    // return

    let nodeIndex = nodeIndexes[0];
    let nodeItem = [...collections, ...folders, ...requests].find(
      (c) => c.__ref.id == nodeIndex
    );
    // console.log({ nodeItem });
    if (
      nodeItem &&
      [
        ERequestTypes.Rest,
        ERequestTypes.GraphQL,
        ERequestTypes.SocketIO,
        ERequestTypes.WebSocket,
      ].includes(nodeItem.__meta.type)
    ) {
      // console.log({ nodeItem });
      _openReqInTab(nodeItem);
    }
  };

  const canDropAt = useCallback(
    (item, target) => {
      const itemPayload = item.data;
      const isItemCollection = itemPayload.__ref.isCollection;
      const isItemFolder = itemPayload.__ref.isFolder;
      const isItemRequest = itemPayload.__ref.isRequest;
      const { targetType, depth, parentItem } = target;

      // return true

      // console.clear();
      // console.log(itemPayload, isItemCollection, target, "can drop at ...");

      /** collection can only reorder at depth 0 */
      if (
        isItemCollection &&
        targetType == 'between-items' &&
        depth == 0 &&
        parentItem == 'root'
      ) {
        return true;
      }

      /** folder and request can be dropped on collection */
      if (
        (isItemFolder || isItemRequest) &&
        targetType == 'item' &&
        depth == 0 &&
        parentItem == 'root'
      ) {
        return true;
      }

      const parentCollection = collections.find(
        (i) => i.__ref.id == parentItem
      );
      const parentFolder = folders.find((i) => i.__ref.id == parentItem);

      /** request and folders can be drop on collection and folder or reorder within the same depth/level */
      if (
        (parentCollection || parentFolder) &&
        (isItemFolder || isItemRequest)
      ) {
        return true;
      }

      // console.log(false, "you can not drag")
      return false;
      // return target.targetType === 'between-items' ? target.parentItem.startsWith('A') : target.targetItem.startsWith('A')
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

    if (item.__ref.isCollection) return;

    /**
     * item is reordering within same parent
     * item is being reordered in collection or in folder or moving across folder but within collection
     *
     * 1. no target means item is not being dropped onto folder
     *    1.1 either it is being reordering within collection
     *    1.2 either it is being reordering within folder
     *    1.3 either it is being moved to folder but dropped in-between items
     */
    if (!targetItem) {
      const moveToParent =
        collections.find((i) => i.__ref.id == parentItem) ||
        folders.find((i) => i.__ref.id == parentItem);
      const isParentFolder = !!moveToParent.__ref.collectionId;
      if (isParentFolder) {
        if (item.__ref.folderId == moveToParent.__ref.id) {
          // reorder within folders
          console.log('reorder within folders'); //, explorerTreeRef);
          changeFolderChildrenPosition(
            moveToParent.__ref.id,
            item.__ref.id,
            childIndex,
            item.__ref.isRequest ? 'request' : 'folder'
          );
        } else {
          // TODO: move item to folder within collection
          console.log('move item to folder within collection', explorerTreeRef);
          // _moveItem()
        }
      } else {
        if (item.__ref.folderId) {
          // TODO: moving item to collection root
          console.log('move item to collection root', explorerTreeRef);
          // _moveItem()
        } else {
          // reorder within collection
          console.log('reorder within collection');
          changeCollectionChildrenPosition(
            parentItem,
            item.__ref.id,
            childIndex,
            item.__ref.isRequest ? 'request' : 'folder'
          );
        }
      }
    } else {
      /**
       * if both exists then item is moving to collection/folder
       * Item is being dropped on item, here it'll be dropped on folder or collection
       */

      const moveTo: { collectionId: string; folderId?: string } = {
        collectionId: '',
      };
      const _targetCollection = collections.find(
        (i) => i.__ref.id == targetItem
      );
      if (_targetCollection) moveTo.collectionId = _targetCollection.__ref.id;
      else {
        const _targetFolder = folders.find((i) => i.__ref.id == targetItem);
        if (_targetFolder) {
          moveTo.collectionId = _targetFolder.__ref.collectionId;
          moveTo.folderId = _targetFolder.__ref.id;
        }
      }
      _moveItem(item, moveTo, item.__ref.isFolder ? 'folder' : 'request');
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
                  <VscRefresh
                    className="cursor-pointer"
                    size={16}
                    onClick={() => {
                      fetchExplorer(workspace.__ref.id);
                    }}
                  />
                </div>
                <div>
                  <VscNewFolder
                    className="cursor-pointer"
                    size={16}
                    onClick={createCollectionPrompt}
                  />
                </div>
                <div>
                  <VscArrowDown
                    className="cursor-pointer"
                    size={16}
                    onClick={openImportTab}
                  />
                </div>
                {/* <div>
                  <VscFileSymlinkFile className="cursor-pointer" size={16} />
                </div> */}
              </ToolBar>
            );
          }}
          bodyRenderer={({ expanded }) => {
            if (!isProgressing && !collections?.length) {
              return (
                <div className="items-center">
                  <Empty
                    icon={<VscFolder size="40" />}
                    title="Create a new Collection"
                    message="This workspace doesn't have any collections, you can create the first collection."
                  />
                  <Button
                    text="Create Collection"
                    className="mx-auto mb-6"
                    onClick={createCollectionPrompt}
                    primary
                    sm
                  />
                </div>
              );
            }

            return (
              <>
              <ScrollBar transparent fullHeight>
                <UncontrolledTreeEnvironment
                  ref={explorerTreeRef}
                  keyboardBindings={{
                    // primaryAction: ['f3'],
                    renameItem: ['enter', 'f2'],
                    abortRenameItem: ['esc'],
                  }}
                  // dataProvider={new StaticTreeDataProvider(items, (item, data) => ({ ...item, data }))}
                  dataProvider={dataProvider.current}
                  defaultInteractionMode={{
                    mode: 'custom',
                    extends: InteractionMode.ClickItemToExpand,
                    createInteractiveElementProps: (
                      item,
                      treeId,
                      actions,
                      renderFlags
                    ) => ({
                      /**
                       * 1. avoid multi select
                       * 2. (will not work as isFocused is always true, ignore for now) focus on first click and select item if it's focused (second click)
                       * 3. if has children then toggle expand/collapse
                       */
                      onClick: (e) => {
                        //avoid multi select
                        // console.log(item, actions, renderFlags);
                        if (item.isFolder) actions.toggleExpandedState();
                        if (!renderFlags.isFocused) actions.focusItem();
                        else actions.selectItem();
                      },
                      onFocus: (e) => {
                        actions.focusItem();
                      },
                    }),
                  }}
                  getItemTitle={(item) => item.data?.name}
                  viewState={{}}
                  // renderItemTitle={({ title }) => <span>{title}</span>}
                  renderItemArrow={treeRenderer.renderItemArrow}
                  // renderItemTitle={treeRenderer.renderItemTitle}
                  renderItem={(props) =>
                    treeRenderer.renderItem({ ...props, treeRef })
                  }
                  // renderTreeContainer={({ children, containerProps }) => <div {...containerProps}>{children}</div>}
                  // renderItemsContainer={({ children, containerProps }) => <ul {...containerProps}>{children}</ul>}

                  canRename={true}
                  canReorderItems={true}
                  canDragAndDrop={true}
                  canDropOnFolder={true}
                  canDropOnNonFolder={true}
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
              </ScrollBar>
              </>
            );
          }}
        />
      </Container>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-row">
      <Container>
        <Container.Body>
          <div className="flex flex-col mt-8 p-4 items-center justify-center mt-2">
            <div className="fc-sidebar-noproject-icon text-5xl opacity-20 mb-2"></div>
            {!!searchString ? (
              <div className="text-sm text-app-foreground-inactive text-center mb-1">
                <span className="text-base block mb-2">No search found...</span>
                Your search is not found within this workspace.
              </div>
            ) : (
              <div className="text-sm text-app-foreground-inactive text-center mb-1">
                <span className="text-app-foreground text-base block mb-2">
                  Create your first API collection!
                </span>
                You don't have any API collection in this workspace.
              </div>
            )}
          </div>
        </Container.Body>
      </Container>
    </div>
  );
};

export default Explorer;

const ProgressBarContainer = () => {
  const { isProgressing } = useExplorerStore((s) => ({
    isProgressing: s.explorer.isProgressing,
  }));
  return <ProgressBar active={isProgressing} />;
};
