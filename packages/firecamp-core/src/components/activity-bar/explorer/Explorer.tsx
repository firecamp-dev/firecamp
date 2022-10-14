import { FC, useCallback, useEffect, useRef } from 'react';
import shallow from 'zustand/shallow';

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
import { VscRefresh } from '@react-icons/all-files/vsc/VscRefresh';
import { VscNewFolder } from '@react-icons/all-files/vsc/VscNewFolder';
// import { VscFileSymlinkFile } from '@react-icons/all-files/vsc/VscFileSymlinkFile';
import { VscFolder } from '@react-icons/all-files/vsc/VscFolder';

import { useWorkspaceStore } from '../../../store/workspace';
import { WorkspaceCollectionsProvider } from './WorkspaceCollectionsProvider';
import treeRenderer from './treeItemRenderer';
import AppService from '../../../services/app';
import { RE } from '../../../types'
import { platformEmitter as emitter } from '../../../services/platform-emitter'
import { EPlatformTabs } from '../../../services/platform-emitter/events'

const Explorer: FC<any> = () => {
  const environmentRef = useRef();
  const treeRef = useRef();

  let {
    workspace,
    explorer,
    fetchExplorer,

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

  const { is_progressing, collections, folders, requests } = explorer;

  let {
    // explorer: { collections, folders, requests },
    registerTDP,
    unRegisterTDP,
  } = useWorkspaceStore.getState();

  // console.log(explorer, "explorer")

  // console.log(folders, "folders....")
  const dataProvider = useRef(
    new WorkspaceCollectionsProvider(collections, folders, requests, workspace.meta?.c_orders || [])
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
      if (item._meta.is_collection)
        res = updateCollection(item._meta.id, { name });
      if (item._meta.is_folder) res = updateFolder(item._meta.id, { name });
      if (item._meta.is_request)
        res = updateRequest(item._meta.id, { meta: { name } });
    } catch (e) {
      //TODO: undo renaming using treeRef
    } finally {
      return res;
    }
  };

  const _openReqInTab = (request: any) => {
    // console.log(`node`, request);
    emitter.emit(EPlatformTabs.openSaved, request);
  };

  const _onNodeSelect = (nodeIdxs: TreeItemIndex[]) => {
    // console.log({ nodeIdxs });
    // return

    let nodeIndex = nodeIdxs[0];
    let colItem = [...collections, ...folders, ...requests].find(
      (c) => c._meta.id == nodeIndex
    );
    // console.log({ colItem });
    if (
      colItem &&
      [
        ERequestTypes.Rest,
        ERequestTypes.GraphQL,
        ERequestTypes.SocketIO,
        ERequestTypes.WebSocket,
      ].includes(colItem.meta.type)
    ) {
      // console.log({ colItem });

      _openReqInTab(colItem);
    }
  };

  const canDropAt = useCallback((item, target) => {
    const itemPayload= item.data;
    const isItemCollection = itemPayload._meta.is_collection;
    const isItemFolder = itemPayload._meta.is_folder;
    const isItemRequest = itemPayload._meta.is_request;
    const { targetType, depth, parentItem } = target;

    // return true

    // console.clear();
    // console.log(itemPayload, isItemCollection, target, "can drop at ...");

    /** collection can only reorder at depth 0 */
    if(isItemCollection &&
        targetType == "between-items" &&
        depth==0 &&
        parentItem== "root"
    ) {
      return true;
    }

    /** folder and request can be dropped on collection */
    if( (isItemFolder || isItemRequest) && 
        targetType == "item" && 
        depth == 0 &&
        parentItem== "root"
    ) {
      return true;
    }

    const parentCollection = collections.find(i=> i._meta.id == parentItem);
    const parentFolder = folders.find(i=> i._meta.id == parentItem);

    /** request and folders can be drop on collection and folder or reorder within the same depth/level */
    if((parentCollection || parentFolder) && (isItemFolder || isItemRequest)) {
      return true;
    }

    // console.log(false, "you can not drag")
    return false
    // return target.targetType === 'between-items' ? target.parentItem.startsWith('A') : target.targetItem.startsWith('A')       
  }, [ collections, folders ]);

  const onDrop = ((items, target )=> {
    console.log(items, target, "onDrop")
    const item = items[0].data;
    const { childIndex=0, parentItem, targetItem } = target;

    if(item._meta.is_collection) return;

    // if both exists then item is moving to collection/folder or just reordering
    if(parentItem && targetItem) {
      const payload: { collection_id: string, folder_id?: string} = { collection_id: "" }
      const tCollection = collections.find(i=> i._meta.id == targetItem);
      if(tCollection){
        payload.collection_id = tCollection._meta.id;
      }
      else {
        const tFolder = folders.find(i=> i._meta.id == targetItem);
        if(tFolder) {
          payload.collection_id = tFolder._meta.collection_id;
          payload.folder_id = tFolder._meta.id;
        }
      }

      if(item._meta.is_folder) {
        moveFolder(item._meta.id, payload);
      }
      else if(item._meta.is_request) {
        moveRequest(item._meta.id, payload);
      }
      else {}
    }
  });

  return (
    <div className="w-full h-full flex flex-row explorer-wrapper">
      <Container>
        <ProgressBarContainer />
        <Pane
          expanded={true}
          bodyClassName={'!p-0'}
          headerTitleRenderer={() => {
            return <span>Collections Explorer</span>;
          }}
          headerActionRenderer={() => {
            return (
              <ToolBar>
                <div>
                  <VscRefresh
                    className="cursor-pointer"
                    size={16}
                    onClick={() => {
                      fetchExplorer(workspace._meta.id);
                    }}
                  />
                </div>
                <div>
                  <VscNewFolder
                    className="cursor-pointer"
                    size={16}
                    onClick={() => AppService.modals.openCreateCollection()}
                  />
                </div>
                {/* <div>
                  <VscFileSymlinkFile className="cursor-pointer" size={16} />
                </div> */}
              </ToolBar>
            );
          }}
          bodyRenderer={({ expanded }) => {
            if (!is_progressing && !collections?.length) {
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
                    onClick={() => AppService.modals.openCreateCollection()}
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
                    createInteractiveElementProps: (item, treeId, actions, renderFlags) => ({
                      /**
                       * 1. avoid multi select
                       * 2. (will not work as isFocused is always true, ignore for now) focus on first click and select item if it's focused (second click)
                       * 3. if has children then toggle expand/collapse
                       */
                      onClick: e => { //avoid multi select
                        // console.log(item, actions, renderFlags)
                        if (item.hasChildren) actions.toggleExpandedState();
                        if(!renderFlags.isFocused)  actions.focusItem();
                        else actions.selectItem();
                      },
                      onFocus: (e) => {
                        actions.focusItem();
                      },
                    }),
                  }}

                  getItemTitle={(item) => item.data.name}
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
                  canDropOnItemWithChildren={true}
                  canDropOnItemWithoutChildren={true}
                  canDrag={(items)=> {
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
                  onMissingItems={(itemIds )=> {
                    // console.log(itemIds, "onMissingItems")
                  }}
                  onMissingChildren={(itemIds )=> {
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
        ></Pane>

        {/* <Pane 
          bodyClassName={'!p-0'}
          headerTitleRenderer={()=> {
            return <span>Open reuqest tabs</span>
          }}
          headerActionRenderer={()=> {
            return (
              <ToolBar>
                <div>
                  <VscFileSymlinkFile className="cursor-pointer" size={16} />
                </div>
              </ToolBar>
            )
          }}
          bodyRenderer={()=> <span>Pane body</span>}
        />
        <Pane 
          bodyClassName={'!p-0'}
          headerTitleRenderer={()=> {
            return <span>Open reuqest tabs</span>
          }}
          headerActionRenderer={()=> {
            return (
              <ToolBar>
                <div>
                  <VscFileSymlinkFile className="cursor-pointer" size={16} />
                </div>
              </ToolBar>
            )
          }}
          bodyRenderer={()=> <div><div>1</div><div>1</div><div>1</div><div>1</div><div>1</div><div>1</div><div>1</div></div>}
        /> */}
      </Container>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-row">
      <Container>
        <Container.Body>
          <div className="flex flex-col mt-8 p-4 items-center justify-center mt-2">
            <div className="fc-sidebar-noproject-icon iconv2-folder-icon text-5xl opacity-20 mb-2"></div>
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
  let { isProgressing } = useWorkspaceStore((s) => ({
    isProgressing: s.explorer.is_progressing,
  }));

  return <ProgressBar active={isProgressing} />;
};
