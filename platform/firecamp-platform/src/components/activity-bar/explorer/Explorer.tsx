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
} from '@firecamp/ui-kit/src/tree';
import { ERequestTypes } from '@firecamp/types';
import {
  Container,
  ProgressBar,
  Pane,
  ToolBar,
  Empty,
  Button,
} from '@firecamp/ui-kit';
import { WorkspaceCollectionsProvider } from './WorkspaceCollectionsProvider';
import treeRenderer from './treeItemRenderer';
import { RE } from '../../../types';
import { platformEmitter as emitter } from '../../../services/platform-emitter';
import { EPlatformTabs } from '../../../services/platform-emitter/events';
import { useWorkspaceStore } from '../../../store/workspace';
import { useTabStore } from '../../../store/tab';
import { ETabEntityTypes } from '../../tabs/types';

const Explorer: FC<any> = () => {
  const environmentRef = useRef();
  const treeRef = useRef();

  const {
    workspace,
    explorer,
    fetchExplorer,

    createCollectionPrompt,
    openImportTab,
    updateCollection,
    updateFolder,
    updateRequest,
    moveRequest,
    moveFolder,

    deleteCollection,
    deleteFolder,
    deleteRequest,
  } = useWorkspaceStore(
    (s) => ({
      workspace: s.workspace,
      explorer: s.explorer,
      fetchExplorer: s.fetchExplorer,

      createCollectionPrompt: s.createCollectionPrompt,
      openImportTab: s.openImportTab,
      updateCollection: s.updateCollection,
      updateFolder: s.updateFolder,
      updateRequest: s.updateRequest,

      moveRequest: s.moveRequest,
      moveFolder: s.moveFolder,

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
  } = useWorkspaceStore.getState();
  const { open: openTab } = useTabStore.getState();

  // console.log(explorer, "explorer")

  // console.log(folders, "folders....")
  const dataProvider = useRef(
    new WorkspaceCollectionsProvider(
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
    const isNotValid = !RE.CollectionName.test(name);
    if (!name || isNotValid) {
      //TODO: undo renaming using treeRef
      return false;
    }

    let res: any;
    try {
      if (item.__ref.isCollection)
        res = updateCollection(item.__ref.id, { name });
      if (item.__ref.isFolder) res = updateFolder(item.__ref.id, { name });
      if (item.__ref.isRequest)
        res = updateRequest(item.__ref.id, { __meta: { name } });
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

  const onDrop = (items, target) => {
    console.log(items, target, 'onDrop');
    const item = items[0].data;
    const { childIndex = 0, parentItem, targetItem } = target;

    if (item.__ref.isCollection) return;

    // if both exists then item is moving to collection/folder or just reordering
    if (parentItem && targetItem) {
      const payload: { collectionId: string; folderId?: string } = {
        collectionId: '',
      };
      const tCollection = collections.find((i) => i.__ref.id == targetItem);
      if (tCollection) {
        payload.collectionId = tCollection.__ref.id;
      } else {
        const tFolder = folders.find((i) => i.__ref.id == targetItem);
        if (tFolder) {
          payload.collectionId = tFolder.__ref.collectionId;
          payload.folderId = tFolder.__ref.id;
        }
      }

      if (item.__ref.isFolder) {
        moveFolder(item.__ref.id, payload);
      } else if (item.__ref.isRequest) {
        moveRequest(item.__ref.id, payload);
      } else {
      }
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
                    sm
                    primary
                    className="mx-auto mb-6"
                    onClick={createCollectionPrompt}
                  />
                </div>
              );
            }

            return (
              <>
                <UncontrolledTreeEnvironment
                  ref={environmentRef}
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
                        // console.log(item, actions, renderFlags)
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
              <div className="text-sm text-appForegroundInActive text-center mb-1">
                <span className="text-base block mb-2">No search found...</span>
                Your search is not found within this workspace.
              </div>
            ) : (
              <div className="text-sm text-appForegroundInActive text-center mb-1">
                <span className="text-appForeground text-base block mb-2">
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
  const { isProgressing } = useWorkspaceStore((s) => ({
    isProgressing: s.explorer.isProgressing,
  }));
  return <ProgressBar active={isProgressing} />;
};
